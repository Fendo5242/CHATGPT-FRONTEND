import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-alternative',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alternative.component.html',
  styleUrls: ['./alternative.component.css']
})
export class AlternativeComponent implements OnInit {
  questions: any[] = [];
  alternatives: any[] = [];
  newAlternative = { questionID: 0, textEn: '', textEs: '', translationChatGptEn: '', translationChatGptEs: '' };
  selectedAlternative: any = null;
  alternativeToDelete: any = null; // Nueva propiedad para manejar la alternativa a eliminar
  alertMessage: string = ''; // Nueva propiedad para el mensaje de alerta

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.getQuestions();
    this.getAlternatives();
  }

  getQuestions(): void {
    this.questionService.getQuestions().subscribe(questions => {
      this.questions = questions;
    });
  }

  getAlternatives(): void {
    this.questionService.getAlternatives().subscribe(alternatives => {
      this.alternatives = alternatives;
    });
  }

  addAlternative(form: NgForm): void {
    if (form.valid) {
      this.questionService.createAlternative(this.newAlternative).subscribe(() => {
        this.getAlternatives();
        this.newAlternative = { questionID: 0, textEn: '', textEs: '', translationChatGptEn: '', translationChatGptEs: '' };
        form.resetForm();
        this.showAlert('Alternative added successfully!'); // Mostrar notificación de éxito
      });
    }
  }

  confirmDelete(alternative: any): void {
    this.alternativeToDelete = alternative;
  }

  cancelDelete(): void {
    this.alternativeToDelete = null;
  }

  deleteAlternativeConfirmed(): void {
    if (this.alternativeToDelete) {
      this.questionService.deleteAlternative(this.alternativeToDelete.alternativeID).subscribe(() => {
        this.getAlternatives();
        this.showAlert('Alternative deleted successfully!'); // Mostrar notificación de éxito
        this.alternativeToDelete = null;
      });
    }
  }

  editAlternative(alternative: any): void {
    this.selectedAlternative = { ...alternative };
    const modal = document.getElementById('editAlternativeModal') as HTMLElement;
    if (modal) {
      modal.style.display = 'block';
    }
  }

  updateAlternative(form: NgForm): void {
    if (form.valid) {
      this.questionService.updateAlternative(this.selectedAlternative.alternativeID, this.selectedAlternative).subscribe(() => {
        this.getAlternatives();
        this.selectedAlternative = null;
        const modal = document.getElementById('editAlternativeModal') as HTMLElement;
        if (modal) {
          modal.style.display = 'none';
        }
        this.showAlert('Alternative updated successfully!'); // Mostrar notificación de éxito
      });
    }
  }

  cancelEdit(): void {
    this.selectedAlternative = null;
    const modal = document.getElementById('editAlternativeModal') as HTMLElement;
    if (modal) {
      modal.style.display = 'none';
    }
  }

  showAlert(message: string): void {
    this.alertMessage = message;
    setTimeout(() => {
      this.alertMessage = '';
    }, 3000); // Limpiar el mensaje después de 3 segundos
  }

  getQuestionText(questionID: number): string {
    const question = this.questions.find(q => q.questionID === questionID);
    return question ? question.textEn : 'Unknown';
  }
}
