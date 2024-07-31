import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-response-list',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './chat-gpt-responses.component.html',
  styleUrls: ['./chat-gpt-responses.component.css']
})
export class ChatGptResponsesComponent implements OnInit {
  responses: any[] = []; 
  selectedResponse: any | null = null; 

  constructor(private responseService: QuestionService) { }

  ngOnInit(): void {
    this.loadResponses();
  }

  loadResponses(): void {
    this.responseService.getAllResponses().subscribe((data: any[]) => {
      this.responses = data.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()); // Ordena los datos de forma descendente por fecha
    });
  }

  viewResponse(response: any): void {
    this.selectedResponse = response; 
  }

  closeModal(): void {
    this.selectedResponse = null; 
  }
}


