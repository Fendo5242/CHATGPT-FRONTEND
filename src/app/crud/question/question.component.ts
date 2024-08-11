import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { NotificationService } from '../../services/notification.service'; // Importar el servicio de notificación

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  categories: any[] = [];
  questions: any[] = [];
  questionTypes: any[] = [];
  newQuestion = { categoryID: 0, questionTypeID: 0, textEn: '', textEs: '', prompt: '' };
  selectedQuestion: any = null;
  selectedQuestionForAlternatives: any = null;
  alternatives: any[] = [];
  newAlternative = { questionID: 0, textEn: '', textEs: '', translationChatGptEn: '', translationChatGptEs: '' };
  editingAlternative: any = null;
  editingIndex: number = -1;
  questionToDelete: any = null;  // Propiedad para almacenar la pregunta a eliminar
  alertMessage: string = ''; // Nueva propiedad para el mensaje de alerta

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private notificationService: NotificationService // Inyectar el servicio de notificación
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.getQuestions();
    this.getQuestionTypes();
    this.notificationService.message$.subscribe(message => {
      this.alertMessage = message;
    });
  }

  getCategories(): void {
    this.questionService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  getQuestions(): void {
    this.questionService.getQuestions().subscribe(questions => {
      this.questions = questions;
      console.log('Loaded questions:', this.questions); // Registro de depuración
    });
  }

  getQuestionTypes(): void {
    this.questionService.getQuestionTypes().subscribe(questionTypes => {
      this.questionTypes = questionTypes;
    });
  }

  addQuestion(form: NgForm): void {
    if (form.valid) {
      this.questionService.createQuestion(this.newQuestion).subscribe(() => {
        this.getQuestions();
        this.newQuestion = { categoryID: 0, questionTypeID: 0, textEn: '', textEs: '', prompt: '' };
        form.resetForm();
        this.notificationService.showMessage('Question added successfully!'); // Mostrar notificación de éxito
      });
    }
  }

  confirmDelete(question: any): void {
    this.questionToDelete = question;
  }

  cancelDelete(): void {
    this.questionToDelete = null;
  }

  deleteQuestionConfirmed(): void {
    if (this.questionToDelete) {
      this.questionService.deleteQuestion(this.questionToDelete.questionID).subscribe(() => {
        this.getQuestions();
        this.notificationService.showMessage('Question deleted successfully!'); // Mostrar notificación de éxito
        this.questionToDelete = null;
      });
    }
  }

  editQuestion(question: any): void {
    this.selectedQuestion = { ...question };
    const modal = document.getElementById('editQuestionModal') as HTMLElement;
    if (modal) {
      modal.style.display = 'block';
    }
  }

  updateQuestion(form: NgForm): void {
    if (form.valid) {
      this.questionService.updateQuestion(this.selectedQuestion.questionID, this.selectedQuestion).subscribe(() => {
        this.getQuestions();
        this.selectedQuestion = null;
        const modal = document.getElementById('editQuestionModal') as HTMLElement;
        if (modal) {
          modal.style.display = 'none';
        }
        this.notificationService.showMessage('Question updated successfully!'); // Mostrar notificación de éxito
      });
    }
  }

  cancelEdit(): void {
    this.selectedQuestion = null;
    const questionModal = document.getElementById('editQuestionModal') as HTMLElement;
    if (questionModal) {
      questionModal.style.display = 'none';
    }
    this.editingAlternative = null;
    this.editingIndex = -1;
  }

  showAlternatives(question: any): void {
    this.selectedQuestionForAlternatives = { ...question };
    this.getAlternatives();
    const modal = document.getElementById('alternativesModal') as HTMLElement;
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeAlternativesModal(): void {
    this.selectedQuestionForAlternatives = null;
    const modal = document.getElementById('alternativesModal') as HTMLElement;
    if (modal) {
      modal.style.display = 'none';
    }
    this.cancelEdit();
  }

  getAlternatives(): void {
    this.questionService.getAlternatives().subscribe(alternatives => {
      this.alternatives = alternatives.filter(a => a.questionID === this.selectedQuestionForAlternatives.questionID);
    });
  }

  editAlternative(alternative: any, index: number): void {
    this.editingAlternative = { ...alternative };
    this.editingIndex = index;
  }

  saveAlternative(): void {
    if (this.editingIndex >= 0) {
      this.selectedQuestionForAlternatives.alternatives[this.editingIndex] = this.editingAlternative;
      this.questionService.updateAlternative(this.editingAlternative.alternativeID, this.editingAlternative).subscribe(() => {
        this.editingAlternative = null;
        this.editingIndex = -1;
        this.notificationService.showMessage('Alternative updated successfully!'); // Mostrar notificación de éxito
        this.getAlternatives();
      }, error => {
        console.error('Error updating alternative', error);
        this.notificationService.showMessage('Error updating alternative!'); // Mostrar notificación de error
      });
    }
  }

  deleteAlternative(alternativeID: number, index: number): void {
    this.questionService.deleteAlternative(alternativeID).subscribe(() => {
      this.selectedQuestionForAlternatives.alternatives.splice(index, 1);
      this.notificationService.showMessage('Alternative deleted successfully!'); // Mostrar notificación de éxito
      this.getAlternatives();
    });
  }

  addAlternative(form: NgForm): void {
    if (form.valid) {
      const newAlt = {
        questionID: this.selectedQuestionForAlternatives.questionID,
        textEn: this.newAlternative.textEn,
        textEs: this.newAlternative.textEs,
        translationChatGptEn: this.newAlternative.translationChatGptEn,
        translationChatGptEs: this.newAlternative.translationChatGptEs
      };
      this.questionService.createAlternative(newAlt).subscribe((createdAlt) => {
        this.selectedQuestionForAlternatives.alternatives.push(createdAlt);
        this.newAlternative = { questionID: 0, textEn: '', textEs: '', translationChatGptEn: '', translationChatGptEs: '' };
        this.notificationService.showMessage('Alternative added successfully!'); // Mostrar notificación de éxito
        this.getAlternatives();
      });
    }
  }

  getCategoryName(categoryID: number): string {
    const category = this.categories.find(c => c.categoryID === categoryID);
    return category ? category.nameEn : 'Unknown';
  }

  getQuestionTypeName(questionTypeID: number): string {
    const questionType = this.questionTypes.find(qt => qt.questionTypeID === questionTypeID);
    return questionType ? questionType.typeEn : 'Unknown';
  }

  showAlert(message: string, alertClass: string): void {
    this.alertMessage = message;
    setTimeout(() => {
      this.alertMessage = '';
    }, 3000); // Limpiar el mensaje después de 3 segundos
  }
}
