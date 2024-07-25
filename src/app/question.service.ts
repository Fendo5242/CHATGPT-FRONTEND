import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseUrl = 'https://chatgpt-api20240720143212.azurewebsites.net';
  // private baseUrl = 'https://localhost:7071';
  private apiUrl = `${this.baseUrl}/Categories`;
  private userResponseUrl = `${this.baseUrl}/UserResponse`;
  private questionUrl = `${this.baseUrl}/Questions`;
  private questionTypeUrl = `${this.baseUrl}/QuestionTypes`;
  private alternativeUrl = `${this.baseUrl}/Alternatives`;
  private chatGptUrl = `${this.baseUrl}/ChatGpt/ProcessUserResponses`;

  constructor(private http: HttpClient) { }

  // Categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, category);
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Questions
  getQuestions(): Observable<any[]> {
    return this.http.get<any[]>(this.questionUrl);
  }

  createQuestion(question: any): Observable<any> {
    return this.http.post<any>(this.questionUrl, question);
  }

  updateQuestion(id: number, question: any): Observable<any> {
    return this.http.put<any>(`${this.questionUrl}/${id}`, question);
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.questionUrl}/${id}`);
  }

  // Question Types
  getQuestionTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.questionTypeUrl);
  }

  // Alternatives
  getAlternatives(): Observable<any[]> {
    return this.http.get<any[]>(this.alternativeUrl);
  }

  createAlternative(alternative: any): Observable<any> {
    return this.http.post<any>(this.alternativeUrl, alternative);
  }

  updateAlternative(id: number, alternative: any): Observable<any> {
    return this.http.put<any>(`${this.alternativeUrl}/${id}`, alternative);
  }

  deleteAlternative(id: number): Observable<any> {
    return this.http.delete<any>(`${this.alternativeUrl}/${id}`);
  }

  // User Responses
  saveUserResponse(response: any): Observable<any> {
    return this.http.post<any>(this.userResponseUrl, response);
  }

  getQuestionsByCategory(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${categoryId}/Questions`);
  }

  // ChatGPT
  processUserResponses(userResponseRequest: any): Observable<any> {
    return this.http.post<any>(this.chatGptUrl, userResponseRequest);
  }
}

