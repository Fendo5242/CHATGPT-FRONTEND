import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../services/question.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LanguageService } from '../services/language.service';

// Define la interfaz para las alternativas
interface Alternative {
  alternativeID: string;
  translationChatGptEn: string;
  translationChatGptEs: string;
  textEn: string; // Asegúrate de que este campo se incluye si lo necesitas
  textEs: string; // Agregado para el texto en español
}

// Define la interfaz para las respuestas
interface Answer {
  selectedAnswerId: string; // ID de la respuesta seleccionada o ' ' para texto
  translationChatGptEn: string; // Traducción de ChatGPT en inglés
  translationChatGptEs: string; // Traducción de ChatGPT en español
  userInputText?: string; // Texto del input, opcional
  textEn?: string; // Texto de la alternativa en inglés, opcional
  textEs?: string; // Texto de la alternativa en español, opcional
}

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
  answers: { [key: number]: Answer } = {}; // Cambiado a incluir la interfaz Answer
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
  formattedChatGptResponse: string | null = null;
  categoryPrompt: string = '';
  selectedLanguage: string = ''; // Declara la propiedad selectedLanguage

  constructor(private questionService: QuestionService, private languageService: LanguageService) { }

  ngOnInit(): void {
    console.log('Componente inicializado');
    this.getCategories();
  
    // Suscribirse al observable del LanguageService para obtener el idioma actual
    this.languageService.language$.subscribe(language => {
      this.selectedLanguage = language; // Asignar el idioma seleccionado a la variable
    });
  }

  getCategories(): void {
    console.log('Obteniendo categorías...');
    this.questionService.getCategories().subscribe(
      categories => {
        this.categories = categories;
        console.log('Categorías recibidas:', this.categories);
      },
      error => {
        console.error('Error al obtener categorías', error);
      }
    );
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const categoryId = parseInt(selectElement.value, 10);
    console.log('Categoría seleccionada:', categoryId);

    if (!isNaN(categoryId)) {
      this.getQuestionsByCategory(categoryId);
      const category = this.categories.find(category => category.categoryID === categoryId);
      this.selectedCategoryName = category?.nameEn || '';
      this.categoryPrompt = category?.prompt || ''; // Obtén el prompt de la categoría
      this.isCategorySelected = true;
      console.log('Nombre de la categoría seleccionada:', this.selectedCategoryName);
      console.log('Prompt de la categoría seleccionada:', this.categoryPrompt);
    }
  }

  getQuestionsByCategory(categoryId: number): void {
    console.log('Obteniendo preguntas para la categoría:', categoryId);
    this.questionService.getQuestionsByCategory(categoryId).subscribe(
      questions => {
        this.questions = questions.questions;
        this.answers = {};
        console.log('Preguntas recibidas:', this.questions);

        this.questions.forEach(question => {
          console.log(`Pregunta ID: ${question.questionID}`, question);

          question.alternatives.forEach((alternative: Alternative) => {
            console.log(`Alternativa ID: ${alternative.alternativeID}, Text: ${alternative.textEn}, Translation: ${alternative.translationChatGptEn}`);
          });
        });
      },
      error => {
        console.error('Error al obtener preguntas', error);
      }
    );
  }

  onAnswerChange(questionId: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    // Buscar la pregunta correspondiente
    const question = this.questions.find(q => q.questionID === questionId);

    if (!question) {
      console.error('Pregunta no encontrada:', questionId);
      return;
    }

    // Verificar si es una pregunta de tipo input de texto (Tipo 2)
    if (question.questionTypeID === 2) {
      console.log(`Texto ingresado para la pregunta ${questionId}:`, value);

      this.answers[questionId] = {
        selectedAnswerId: value, // Usar el texto ingresado como selectedAnswerId
        translationChatGptEn: value, // Copiar el texto ingresado en translationChatGptEn
        translationChatGptEs: value // Traducción de ChatGPT
      };

      // Verificar si es del tipo slider (Tipo 4)
    } else if (question.questionTypeID === 4) {
      const sliderValue = parseInt(value, 10);
      const selectedAnswerId = question.alternatives[sliderValue - 1]?.alternativeID; // Ajustar índice del array

      if (!selectedAnswerId) {
        console.error('Alternativa no encontrada para el valor del slider:', sliderValue);
        return;
      }

      console.log(`Respuesta cambiada para la pregunta ${questionId} mediante slider:`, selectedAnswerId);

      const previousAnswerId = this.answers[questionId]?.selectedAnswerId || null;
      this.answers[questionId] = {
        selectedAnswerId: selectedAnswerId,
        translationChatGptEn: '', // Inicializar en vacío
        translationChatGptEs: '' // Inicializar en vacío
      };

      // Obtener detalles de la alternativa seleccionada
      this.getAlternativeById(selectedAnswerId, questionId);

      if (previousAnswerId !== selectedAnswerId) {
        console.log(`Respuesta cambiada de: ${previousAnswerId} a ${selectedAnswerId}`);
      }

      // Manejar el caso de preguntas de tipo selección simple o de "yes or no" (Tipo 1 y 3)
    } else if (question.questionTypeID === 1 || question.questionTypeID === 3) {
      const selectedAnswerId = value.toString(); // Tomar el valor de la respuesta seleccionada

      console.log(`Respuesta cambiada para la pregunta ${questionId} mediante alternativa seleccionada:`, selectedAnswerId);

      const previousAnswerId = this.answers[questionId]?.selectedAnswerId || null;
      this.answers[questionId] = {
        selectedAnswerId: selectedAnswerId,
        translationChatGptEn: '', // Inicializar en vacío
        translationChatGptEs: '', // Inicializar en vacío
        textEn: '', // Inicializar en vacío
        textEs: '' // Inicializar en vacío
      };

      // Obtener detalles de la alternativa seleccionada
      this.getAlternativeById(selectedAnswerId, questionId);

      if (previousAnswerId !== selectedAnswerId) {
        console.log(`Respuesta cambiada de: ${previousAnswerId} a ${selectedAnswerId}`);
      }

      // Para las preguntas tipo "yes or no", si no hay selección, asignar "No" como valor predeterminado
      if (question.questionTypeID === 3 && !selectedAnswerId) {
        this.answers[questionId].selectedAnswerId = 'No';
      }
    }

    console.log('Respuestas actuales:', this.answers);
  }

  getAlternativeById(alternativeId: string, questionId: number): void {
    this.questionService.getAlternative(parseInt(alternativeId)).subscribe(
      (alternative: Alternative) => {
        console.log(`Alternativa ID = ${alternativeId}, textEn = "${alternative.textEn}", translationChatGptEn = "${alternative.translationChatGptEn}"`);

        // Actualiza la respuesta con los valores obtenidos
        this.answers[questionId].textEn = alternative.textEn;
        this.answers[questionId].translationChatGptEn = alternative.translationChatGptEn;
        this.answers[questionId].textEs = alternative.textEs;
        this.answers[questionId ].translationChatGptEs = alternative.translationChatGptEs;
      },
      error => {
        console.error('Error al obtener la alternativa por ID:', error);
      }
    );
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.isLoading = true;
    this.showResponse = false;
    console.log('Enviando formulario...');
  
    // Mapeo de las respuestas del usuario
    const userResponses = this.questions.map(question => {
      const answer = this.answers[question.questionID]; // Obtiene la respuesta para la pregunta
      let selectedAnswer = ''; 
      let translationChatGpt = '';
  
      // **Manejo de preguntas tipo 1 y 3 (selección simple o "yes or no")**
      if (question.questionTypeID === 1 || question.questionTypeID === 3) {
        selectedAnswer = answer 
          ? (this.selectedLanguage === 'es' ? answer.textEs : answer.textEn) || '' 
          : ''; 
  
        translationChatGpt = answer 
          ? (this.selectedLanguage === 'es' ? answer.translationChatGptEs : answer.translationChatGptEn) || '' 
          : '';
  
        // Si es pregunta tipo 3 y no hay respuesta seleccionada, se asigna 'No'
        if (question.questionTypeID === 3 && !selectedAnswer) {
          const noAlternative = question.alternatives.find((alt: Alternative) => alt.textEn === 'No');
          if (noAlternative) {
            selectedAnswer = this.selectedLanguage === 'es' ? 'No' : noAlternative.textEn;
            translationChatGpt = this.selectedLanguage === 'es' ? '' : noAlternative.translationChatGptEn;
          }
        }
  
      // **Manejo de preguntas tipo 2 (input de texto)**
      } else if (question.questionTypeID === 2) {
        const defaultAlternative = question.alternatives[0] || null;
  
        // **Asignación correcta según el idioma**
        translationChatGpt = defaultAlternative 
          ? (this.selectedLanguage === 'es' 
              ? defaultAlternative.translationChatGptEs 
              : defaultAlternative.translationChatGptEn) 
          : '';
  
        selectedAnswer = answer ? answer.selectedAnswerId || '' : ''; 
        
      // **Manejo de preguntas tipo 4 (slider)**
      } else if (question.questionTypeID === 4) {
        selectedAnswer = answer 
          ? (this.selectedLanguage === 'es' ? answer.textEs : answer.textEn) || '3' 
          : '3'; // Valor predeterminado: '3'
        translationChatGpt = answer 
          ? (this.selectedLanguage === 'es' ? answer.translationChatGptEs : answer.translationChatGptEn) 
          : 'On a range from 1 through 5, the length should be a 3';
  
      // **Manejo de otros tipos de preguntas**
      } else {
        const selectedAlternative = question.alternatives.find(
          (alt: Alternative) => alt.alternativeID === (answer ? answer.selectedAnswerId : null)
        );
        selectedAnswer = selectedAlternative 
          ? (this.selectedLanguage === 'es' ? selectedAlternative.textEs : selectedAlternative.textEn) 
          : '';
  
        translationChatGpt = answer 
          ? (this.selectedLanguage === 'es' ? answer.translationChatGptEs : answer.translationChatGptEn) 
          : '';
      }
  
      // **Reemplazo de {respuesta} por selectedAnswer en todas las preguntas**
      if (translationChatGpt.includes('{respuesta}')) {
        translationChatGpt = translationChatGpt.replace('{respuesta}', selectedAnswer);
      }
  
      return {
        questionText: this.selectedLanguage === 'es' ? question.textEs : question.textEn,
        selectedAnswer: selectedAnswer,
        translationChatGpt: translationChatGpt,
      };
    }).filter(response => response !== null); // Filtra las preguntas sin respuesta
  
    // **Creación del payload de solicitud**
    this.requestPayload = {
      userID: this.userId,
      categoryName: this.selectedCategoryName,
      categoryPrompt: this.categoryPrompt,
      questions: userResponses
    };
  
    console.log('Payload de solicitud:', JSON.stringify(this.requestPayload, null, 2));
  
    // **Envío de las respuestas del usuario**
    this.questionService.processUserResponses(this.requestPayload).subscribe(
      response => {
        this.chatGptResponse = response.response;
        this.isLoading = false;
        this.showResponse = true;
        console.log('Respuesta de ChatGPT:', this.chatGptResponse);
  
        // Acciones posteriores a la respuesta
        this.getResponseById(response.responseID);
        this.getLastResponse();
        this.scrollToResponse();
      },
      error => {
        console.error('Error al procesar las respuestas del usuario', error);
        this.isLoading = false;
      }
    );
  }
  
  getResponseById(id: number): void {
    console.log('Obteniendo respuesta por ID:', id);
    this.questionService.getResponseById(id).subscribe(
      response => {
        this.responseDetails = response;
        console.log('Detalles de la respuesta:', this.responseDetails);
        this.userInput = this.responseDetails.response;
      },
      error => {
        console.error('Error al obtener la respuesta por ID', error);
      }
    );
  }

  scrollToResponse(): void {
    const element = document.getElementById('response-box');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      console.log('Desplazándose a la caja de respuesta...');
    }
  }


  closeModal(): void {
    this.isModalOpen = false;
  }

  getLastRequest(): void {
    console.log('Obteniendo última solicitud...');
    this.questionService.getLastRequest().subscribe(
      response => {
        console.log('Respuesta de última solicitud recibida:', response);
        this.lastRequest = this.formatRequest(response.request); // Formatear la solicitud
        this.editedRequest = this.lastRequest || '';
        console.log('Última solicitud:', this.lastRequest); // Imprime la última solicitud formateada
      },
      error => {
        console.error('Error al obtener la última solicitud', error);
      }
    );
  }

  // Función para formatear la solicitud eliminando líneas con ' . '
  private formatRequest(request: string): string {
    if (!request) return '';

    // Divide el texto en líneas y filtra las que no contengan ' . ' sin texto antes o después
    const formattedRequest = request
      .split('\n')
      .filter(line => !/^\s*\.\s*$/.test(line)) // Elimina líneas que consisten en un punto sin texto antes o después
      .join('\n');

    return formattedRequest;
  }


  getLastResponse(): void {
    console.log('Obteniendo última respuesta...');
    this.questionService.getLastResponse().subscribe(
      response => {
        console.log('Respuesta de última respuesta recibida:', response);
        this.lastResponse = response;
        this.editedResponse = this.lastResponse?.response || '';
        console.log('Última respuesta:', this.lastResponse); // Imprime la última respuesta
      },
      error => {
        console.error('Error al obtener la última respuesta', error);
      }
    );
  }

  openModal(): void {
    console.log('Abriendo modal...');
    this.getLastRequest(); // Llama sin parámetros
    this.getLastResponse(); // Llama sin parámetros

    // Esperar a que se carguen las respuestas antes de mostrar el modal
    setTimeout(() => {
      this.editedRequest = this.lastRequest || '';
      this.editedResponse = this.lastResponse?.response || '';
      this.isModalOpen = true; // Establecer el modal abierto al final
    }, 1000);
  }


  canSubmit(): boolean {
    return this.isCategorySelected && this.questions.every(question => this.answers[question.questionID]?.selectedAnswerId !== undefined);
  }

  saveChanges(): void {
    const requestPayload = {
      userID: 1, // Establecido en 1
      categoryName: this.lastResponse?.categoryName || '', // Mantiene la misma categoría
      request: this.editedRequest // El nuevo request del textarea
    };

    this.questionService.requestAndSaveResponse(requestPayload).subscribe(
      response => {
        console.log('Respuesta guardada correctamente:', response);
        this.chatGptResponse = response.Response; // Actualiza la respuesta con la nueva
        this.getNewChatGptResponse(); // Llama a un método para obtener la nueva respuesta de ChatGPT
        this.closeModal(); // Cierra el modal después de guardar
      },
      error => {
        console.error('Error al guardar la respuesta:', error);
      }
    );
  }

  getNewChatGptResponse(): void {
    // Llama al servicio para obtener la respuesta más reciente
    this.questionService.getLastResponse().subscribe(
      (response) => {
        this.chatGptResponse = response.response; // Actualiza chatGptResponse
        this.showResponse = true; // Asegúrate de que la respuesta se muestre
      },
      (error) => {
        console.error('Error al obtener la nueva respuesta de ChatGPT', error);
      }
    );

  }

}










