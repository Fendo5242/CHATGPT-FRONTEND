import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];
  newCategory = { nameEn: '', nameEs: '' };
  selectedCategory: any = null;
  categoryToDelete: any = null; // Nueva propiedad para manejar la categoría a eliminar
  alertMessage: string = ''; // Nueva propiedad para el mensaje de alerta

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.questionService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  addCategory(form: NgForm): void {
    if (form.valid) {
      this.questionService.createCategory(this.newCategory).subscribe(() => {
        this.getCategories();
        this.newCategory = { nameEn: '', nameEs: '' };
        form.resetForm();
        this.showAlert('Category added successfully!'); // Mostrar notificación de éxito
      });
    }
  }

  confirmDelete(category: any): void {
    this.categoryToDelete = category;
  }

  cancelDelete(): void {
    this.categoryToDelete = null;
  }

  deleteCategoryConfirmed(): void {
    if (this.categoryToDelete) {
      this.questionService.deleteCategory(this.categoryToDelete.categoryID).subscribe(() => {
        this.getCategories();
        this.showAlert('Category deleted successfully!'); // Mostrar notificación de éxito
        this.categoryToDelete = null;
      });
    }
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
        this.showAlert('Category updated successfully!'); // Mostrar notificación de éxito
      });
    }
  }

  cancelEdit(): void {
    this.selectedCategory = null;
    const modal = document.getElementById('editCategoryModal') as HTMLElement;
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
}
