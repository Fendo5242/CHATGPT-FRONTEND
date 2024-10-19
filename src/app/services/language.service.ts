import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private selectedLanguage = new BehaviorSubject<string>(this.getSavedLanguage());

  // Observable que emite los cambios de idioma
  language$ = this.selectedLanguage.asObservable();

  private getSavedLanguage(): string {
    return localStorage.getItem('selectedLanguage') || 'en';
  }

  setLanguage(language: string) {
    this.selectedLanguage.next(language);
    localStorage.setItem('selectedLanguage', language);
    this.updateHtmlLangAttribute(language);
  }

  private updateHtmlLangAttribute(language: string) {
    document.documentElement.lang = language;
  }
}
