import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-insert',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.css']
})
export class InsertComponent implements OnInit {
  categories: any[] = [];
  questions: any[] = [];
  questionTypes: any[] = [];
  alternatives: any[] = [];
  newCategory = { nameEn: '', nameEs: '' };
  newQuestion = { categoryID: 0, questionTypeID: 0, textEn: '', textEs: '' };
  newAlternative = { questionID: 0, textEn: '', textEs: '', translationChatGptEn: '', translationChatGptEs: '' };
  selectedCategory: any = null;
  selectedQuestion: any = null;
  selectedAlternative: any = null;

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.getCategories();
    this.getQuestions();
    this.getQuestionTypes();
    this.getAlternatives();
  }

  getCategories(): void {
    this.questionService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  getQuestions(): void {
    this.questionService.getQuestions().subscribe(questions => {
      this.questions = questions;
    });
  }

  getQuestionTypes(): void {
    this.questionService.getQuestionTypes().subscribe(questionTypes => {
      this.questionTypes = questionTypes;
    });
  }

  getAlternatives(): void {
    this.questionService.getAlternatives().subscribe(alternatives => {
      this.alternatives = alternatives;
    });
  }

  addCategory(form: NgForm): void {
    if (form.valid) {
      this.questionService.createCategory(this.newCategory).subscribe(() => {
        this.getCategories();
        this.newCategory = { nameEn: '', nameEs: '' };
        form.resetForm();
      });
    }
  }

  addQuestion(form: NgForm): void {
    if (form.valid) {
      this.questionService.createQuestion(this.newQuestion).subscribe(() => {
        this.getQuestions();
        this.newQuestion = { categoryID: 0, questionTypeID: 0, textEn: '', textEs: '' };
        form.resetForm();
      });
    }
  }

  addAlternative(form: NgForm): void {
    if (form.valid) {
      this.questionService.createAlternative(this.newAlternative).subscribe(() => {
        this.getAlternatives();
        this.newAlternative = { questionID: 0, textEn: '', textEs: '', translationChatGptEn: '', translationChatGptEs: '' };
        form.resetForm();
      });
    }
  }

  deleteCategory(id: number): void {
    this.questionService.deleteCategory(id).subscribe(() => {
      this.getCategories();
    });
  }

  deleteQuestion(id: number): void {
    this.questionService.deleteQuestion(id).subscribe(() => {
      this.getQuestions();
    });
  }

  deleteAlternative(id: number): void {
    this.questionService.deleteAlternative(id).subscribe(() => {
      this.getAlternatives();
    });
  }

  editCategory(category: any): void {
    this.selectedCategory = { ...category };
    const modal = document.getElementById('editCategoryModal') as HTMLElement;
    if (modal) {
      modal.style.display = 'block';
    }
  }

  updateCategory(form: NgForm): void {
    if (form.valid) {
      this.questionService.updateCategory(this.selectedCategory.categoryID, this.selectedCategory).subscribe(() => {
        this.getCategories();
        this.selectedCategory = null;
        const modal = document.getElementById('editCategoryModal') as HTMLElement;
        if (modal) {
          modal.style.display = 'none';
        }
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
      });
    }
  }

  cancelEdit(): void {
    this.selectedCategory = null;
    this.selectedQuestion = null;
    this.selectedAlternative = null;
    const modals = document.querySelectorAll('.modal-content') as NodeListOf<HTMLElement>;
    modals.forEach(modal => {
      modal.style.display = 'none';
    });
  }
}
