import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../services/question.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-component.component.html',
  styleUrls: ['./form-component.component.css']
})
export class FormComponent implements OnInit {
  categories: any[] = [];
  questions: any[] = [];
  answers: { [key: number]: string } = {};
  selectedCategoryName: string = '';
  userId = 1;
  chatGptResponse: string | null = null;
  requestPayload: any;
  responseDetails: any;
  lastRequest: string | null = null;  
  lastResponse: any;
  isModalOpen: boolean = false;
  editedRequest: string = '';
  editedResponse: string = '';
  userInput: string = ''; 
  isLoading: boolean = false;
  showResponse: boolean = false;
  isCategorySelected: boolean = false;

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.questionService.getCategories().subscribe(
      categories => {
        this.categories = categories;
      },
      error => {
        console.error('Error fetching categories', error);
      }
    );
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const categoryId = parseInt(selectElement.value, 10);
    if (!isNaN(categoryId)) {
      this.getQuestionsByCategory(categoryId);
      this.selectedCategoryName = this.categories.find(category => category.categoryID === categoryId)?.nameEn || '';
      this.isCategorySelected = true;
    }
  }

  getQuestionsByCategory(categoryId: number): void {
    this.questionService.getQuestionsByCategory(categoryId).subscribe(
      questions => {
        this.questions = questions.questions;
        this.answers = {};
        this.questions.forEach(question => {
          if (question.questionTypeID === 4) {
            this.answers[question.questionID] = '5'; // Valor por defecto
          }
        });
      },
      error => {
        console.error('Error fetching questions', error);
      }
    );
  }

  onAnswerChange(questionId: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement | HTMLSelectElement;
    this.answers[questionId] = inputElement.value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.isLoading = true;
    this.showResponse = false;

    const userResponses = this.questions.map(question => ({
      questionText: question.textEn,
      selectedAnswer: this.answers[question.questionID] || 'No answer'
    }));

    this.requestPayload = {
      userID: this.userId,
      categoryName: this.selectedCategoryName,
      questions: userResponses
    };

    this.lastRequest = `Crea un "Instagram Post" con la siguiente información:\r\nTe voy a pasar una serie de preguntas con sus respuestas. Quiero que las consideres para que puedas dar una respuesta más precisa.\r\n${userResponses.map(q => `${q.questionText}\r\nSelected Answer: ${q.selectedAnswer}`).join('\r\n')}\r\n`;

    console.log('Request Payload:', JSON.stringify(this.requestPayload, null, 2));

    this.questionService.processUserResponses(this.requestPayload).subscribe(
      response => {
        this.chatGptResponse = response.response;
        this.isLoading = false;
        this.showResponse = true;

        console.log('ChatGPT Response:', this.chatGptResponse);
        this.getResponseById(response.responseID);
        this.getLastResponse();
        this.scrollToResponse();
      },
      error => {
        console.error('Error processing user responses', error);
        this.isLoading = false;
      }
    );
  }

  getResponseById(id: number): void {
    this.questionService.getResponseById(id).subscribe(
      response => {
        this.responseDetails = response;
        console.log('Response Details:', this.responseDetails);
        this.userInput = this.responseDetails.response;
      },
      error => {
        console.error('Error fetching response by ID', error);
      }
    );
  }

  getLastResponse(): void {
    this.questionService.getLastResponse(this.userId).subscribe(
      response => {
        this.lastResponse = response;
        console.log('Last Response:', this.lastResponse);
      },
      error => {
        console.error('Error fetching last response', error);
      }
    );
  }

  scrollToResponse(): void {
    const element = document.getElementById('response-box');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openModal(): void {
    // Llamar al método para obtener el último request registrado
    this.getLastRequest(); // Ahora no se pasa userId
  
    // Llamar al método para obtener la última respuesta
    this.getLastResponse();
    
    // Después de obtener la última respuesta, asignar los valores a las propiedades
    this.editedRequest = this.lastRequest || '';
    this.editedResponse = this.chatGptResponse || '';
    this.isModalOpen = true;
  }
  
  // Nuevo método para obtener el último request de la base de datos
  getLastRequest(): void {
    this.questionService.getLastRequest().subscribe({
      next: request => {
        this.lastRequest = request.request; // Asigna el último request
        console.log('Last Request:', this.lastRequest);
      },
      error: error => {
        console.error('Error fetching last request', error);
      }
    });
  }
  
  closeModal(): void {
    this.isModalOpen = false;
  }

  saveChanges(): void {
    const modifiedRequest = {
      userID: this.userId,
      categoryName: this.selectedCategoryName,
      request: this.editedRequest
    };
  
    console.log('Modified Request:', modifiedRequest);
  
    this.questionService.requestAndSaveResponse(modifiedRequest).subscribe(
      response => {
        this.chatGptResponse = response.response;
        console.log('Saved Response:', this.chatGptResponse);
        
        // Actualiza el último request después de guardarlo
        this.getLastRequest(); // Asegúrate de no pasar userId aquí
        
        this.closeModal();
      },
      error => {
        console.error('Error saving response', error);
      }
    );
  }

  adjustTextAreaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  canSubmit(): boolean {
    return this.questions.every(question => {
      const answer = this.answers[question.questionID];
      if (question.questionTypeID === 4) {
        return true; // No requiere respuesta
      }
      return answer && answer !== ''; // Requiere respuesta
    });
  }
}

