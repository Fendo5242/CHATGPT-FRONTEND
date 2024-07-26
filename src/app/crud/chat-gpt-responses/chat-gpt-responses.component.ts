import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../question.service';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-response-list',
  standalone: true, // Indica que es un componente independiente
  imports: [CommonModule], // Agrega CommonModule aquí
  templateUrl: './chat-gpt-responses.component.html',
  styleUrls: ['./chat-gpt-responses.component.css']
})
export class ChatGptResponsesComponent implements OnInit {
  responses: any[] = []; // Almacena las respuestas
  selectedResponse: any | null = null; // Almacena la respuesta seleccionada

  constructor(private responseService: QuestionService) { }

  ngOnInit(): void {
    this.loadResponses(); // Carga las respuestas al iniciar el componente
  }

  loadResponses(): void {
    this.responseService.getAllResponses().subscribe((data: any[]) => {
      this.responses = data; // Asigna los datos recibidos a la propiedad responses
    });
  }

  viewResponse(response: any): void {
    this.selectedResponse = response; // Establece la respuesta seleccionada
  }

  closeModal(): void {
    this.selectedResponse = null; // Cierra el modal
  }
}
