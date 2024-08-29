import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alternativev2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alternativev2.component.html',
  styleUrls: ['./alternativev2.component.css']
})
export class Alternativev2Component implements OnInit {
  categories: any[] = []; // Almacena las categorías
  questions: any[] = []; // Almacena las preguntas
  selectedCategoryId: number | null = null; // Almacena el ID de la categoría seleccionada
  selectedQuestionId: number | null = null; // Almacena el ID de la pregunta seleccionada
  searchText: string | null = ''; // Almacena el texto de búsqueda (inicializado como cadena vacía)
  alternatives: any[] = []; // Almacena las alternativas filtradas
  hasFiltered: boolean = false; // Variable para controlar si se ha filtrado
  showNoAlternativesMessage: boolean = false; // Controla la visibilidad del mensaje

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  // Método para cargar las categorías desde el servicio
  loadCategories(): void {
    console.log('Cargando categorías...');
    this.questionService.getCategories().subscribe(
      (data) => {
        this.categories = data;
        console.log('Categorías cargadas:', this.categories);
      },
      (error) => {
        console.error('Error loading categories', error);
      }
    );
  }

  // Método que se llama cuando se selecciona una categoría
  onCategoryChange(): void {
    console.log('Categoría seleccionada:', this.selectedCategoryId);
    if (this.selectedCategoryId) {
      this.loadQuestionsByCategory(this.selectedCategoryId);
    } else {
      this.questions = []; // Si no hay categoría seleccionada, limpia las preguntas
      console.log('No hay categoría seleccionada. Limpio las preguntas.');
    }
  }

  // Método para cargar las preguntas según la categoría seleccionada
  loadQuestionsByCategory(categoryId: number): void {
    console.log('Cargando preguntas para la categoría:', categoryId);
    this.questionService.getQuestionsByCategory(categoryId).subscribe(
      (data) => {
        this.questions = data.questions; // Asume que `data` tiene una propiedad `questions`
        console.log('Preguntas cargadas:', this.questions);
      },
      (error) => {
        console.error('Error loading questions', error);
      }
    );
  }

  // Método que se llama al hacer clic en el botón "Filter"
  filterAlternatives(): void {
    // Crear un objeto de solicitud de filtro
    const filterRequest = {
      categoryId: this.selectedCategoryId !== null ? Number(this.selectedCategoryId) : null, // Convertir a número
      questionId: this.selectedQuestionId !== null ? Number(this.selectedQuestionId) : null, // Convertir a número si es necesario
      searchText: this.searchText || "" // cadena vacía si no hay texto de búsqueda
    };

    // Imprimir el objeto filterRequest en la consola
    console.log('Filter Request JSON:', JSON.stringify(filterRequest));

    // Llamar al servicio de filtro con el objeto filterRequest
    this.questionService.filterAlternatives(filterRequest).subscribe(
      (data) => {
        this.alternatives = data; // Asume que `data` es un arreglo de alternativas
        
        // Mostrar el mensaje si no hay alternativas
        this.showNoAlternativesMessage = this.alternatives.length === 0;
        
        if (this.showNoAlternativesMessage) {
          console.warn('No alternatives found for the provided filters.');
        } else {
          console.log('Filtered alternatives:', this.alternatives); // Mostrar alternativas filtradas
        }
      },
      (error) => {
        console.error('Error filtering alternatives', error);
      }
    );
  }
}











