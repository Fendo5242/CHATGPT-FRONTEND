import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { QuestionService } from '../services/question.service';
import { LanguageService } from '../services/language.service'; // Importa el servicio de idioma

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuActive = false;
  showPopup = false;
  languages: any[] = []; // Almacena los lenguajes obtenidos
  selectedLanguage: string = 'en'; // Idioma por defecto

  constructor(
    private authService: AuthService,
    private questionService: QuestionService,
    private languageService: LanguageService // Inyecta el servicio de idioma
  ) {}

  ngOnInit() {
    this.loadLanguages(); // Cargar lenguajes al iniciar
    this.subscribeToLanguageChanges(); // Suscribirse a los cambios de idioma
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  toggleLanguagesPopup() {
    this.showPopup = !this.showPopup;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
  }

  loadLanguages() {
    this.questionService.getLanguages().subscribe(
      (data) => {
        this.languages = data;
      },
      (error) => {
        console.error('Error al cargar lenguajes:', error);
        alert('Hubo un problema al cargar los lenguajes.');
      }
    );
  }

  selectLanguage(language: string) {
    const code = language === 'English' ? 'en' : 'es';
    this.languageService.setLanguage(code); // Establecer idioma usando el servicio
  }

  subscribeToLanguageChanges() {
    this.languageService.language$.subscribe((language) => {
      this.selectedLanguage = language; // Actualiza el idioma en el componente
    });
  }
}
