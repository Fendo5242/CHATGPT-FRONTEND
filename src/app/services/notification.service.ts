import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSubject = new BehaviorSubject<string>('');
  public message$ = this.messageSubject.asObservable();

  showMessage(message: string): void {
    this.messageSubject.next(message);
    setTimeout(() => this.clearMessage(), 3000); // Limpiar mensaje después de 3 segundos
  }

  clearMessage(): void {
    this.messageSubject.next('');
  }
}
