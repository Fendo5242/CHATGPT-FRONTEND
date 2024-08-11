import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  //private baseUrl = 'https://localhost:7071'; 
  private baseUrl = 'https://chatgpt-api20240720143212.azurewebsites.net/'; 
  private apiUrl = `${this.baseUrl}/Categories`;
  private userResponseUrl = `${this.baseUrl}/UserResponse`;
  private questionUrl = `${this.baseUrl}/Questions`;
  private questionTypeUrl = `${this.baseUrl}/QuestionTypes`;
  private alternativeUrl = `${this.baseUrl}/Alternatives`;
  private chatGptUrl = `${this.baseUrl}/ChatGpt`;
  private userUrl = `${this.baseUrl}/Users`;

  constructor(private http: HttpClient) { }

  // ===========================
  //        CATEGORIES
  // ===========================
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

  // ===========================
  //        QUESTIONS
  // ===========================
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

  getQuestionsByCategory(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${categoryId}/Questions`);
  }

  // ===========================
  //     QUESTION TYPES
  // ===========================
  getQuestionTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.questionTypeUrl);
  }

  // ===========================
  //        ALTERNATIVES
  // ===========================
  getAlternatives(): Observable<any[]> {
    return this.http.get<any[]>(this.alternativeUrl);
  }

  getAlternative(id: number): Observable<any> { // Agregado aquí
    return this.http.get<any>(`${this.alternativeUrl}/${id}`);
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

  // ===========================
  //    USER RESPONSES
  // ===========================
  saveUserResponse(response: any): Observable<any> {
    return this.http.post<any>(this.userResponseUrl, response);
  }

  // ===========================
  //        ChatGPT
  // ===========================
  processUserResponses(userResponseRequest: any): Observable<any> {
    return this.http.post<any>(`${this.chatGptUrl}/ProcessUserResponses`, userResponseRequest);
  }

  getAllResponses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.chatGptUrl}/GetAllResponses`);
  }

  getAllData(): Observable<any> {
    return forkJoin({
      responses: this.getAllResponses(),
      questions: this.getQuestions(),
      categories: this.getCategories()
    });
  }

  getResponseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.chatGptUrl}/${id}`);
  }

  getLastRequest(): Observable<any> {
    return this.http.get<any>(`${this.chatGptUrl}/GetLatestRequest`); // Cambiado a GetLatestRequest sin userId
  }
  
  getLastResponse(): Observable<any> {
    return this.http.get<any>(`${this.chatGptUrl}/GetLatestResponse`); // Cambiado a GetLatestResponse sin userId
  }
  
  requestAndSaveResponse(requestModel: any): Observable<any> {
    return this.http.post<any>(`${this.chatGptUrl}/RequestAndSaveResponse`, requestModel);
  }

  
  // ===========================
  //        USERS
  // ===========================
  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.userUrl, user);
  }

  loginUser(loginRequest: any): Observable<any> {
    return this.http.post<any>(`${this.userUrl}/Login`, loginRequest);
  }
}

