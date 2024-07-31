import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../services/question.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-component.component.html',
  styleUrls: ['./form-component.component.css']
})
export class FormComponent implements OnInit {
  categories: any[] = [];
  questions: any[] = [];
  answers: { [key: number]: string } = {};
  selectedCategoryName: string = ''; // Variable para almacenar el nombre de la categoría seleccionada
  userId = 1; // ID del usuario (puede ser dinámico según la aplicación)
  chatGptResponse: string | null = null; // Variable para almacenar la respuesta de ChatGPT

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
      // Actualiza el nombre de la categoría seleccionada
      this.selectedCategoryName = this.categories.find(category => category.categoryID === categoryId)?.nameEn || '';
    }
  }

  getQuestionsByCategory(categoryId: number): void {
    this.questionService.getQuestionsByCategory(categoryId).subscribe(
      questions => {
        this.questions = questions.questions; // Ajusta esto según la estructura de tu respuesta API
        this.answers = {}; // Reiniciar respuestas al cambiar de categoría
        this.questions.forEach(question => {
          if (question.questionTypeID === 4) { // Rango 1-5
            this.answers[question.questionID] = '5'; // Valor por defecto del rango
          }
        });
      },
      error => {
        console.error('Error fetching questions', error);
      }
    );
  }

  onAnswerChange(questionId: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.answers[questionId] = inputElement.value;
  }

  onSubmit(event: Event): void {
    event.preventDefault(); // Evitar que el formulario se envíe de la manera tradicional
    const userResponses = this.questions.map(question => ({
      questionText: question.textEn,
      selectedAnswer: this.answers[question.questionID] || 'No answer'
    }));

    const requestPayload = {
      userID: this.userId,
      categoryName: this.selectedCategoryName, // Usa la categoría seleccionada
      questions: userResponses
    };

    this.questionService.processUserResponses(requestPayload).subscribe(
      response => {
        this.chatGptResponse = response.response; // Mostrar la respuesta de ChatGPT
        this.scrollToResponse(); // Scroll a la respuesta
      },
      error => {
        console.error('Error processing user responses', error);
      }
    );
  }

  // Método para hacer scroll a la respuesta
  scrollToResponse(): void {
    const element = document.getElementById('response-box');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
