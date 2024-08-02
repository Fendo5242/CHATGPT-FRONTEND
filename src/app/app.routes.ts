import { Routes } from '@angular/router';
import { FormComponent } from './form-component/form-component.component';
import { CategoryComponent } from './crud/category/category.component';
import { QuestionComponent } from './crud/question/question.component';
import { AlternativeComponent } from './crud/alternative/alternative.component';
import { ChatGptResponsesComponent } from './crud/chat-gpt-responses/chat-gpt-responses.component';
import { LoginComponent } from './login/login.component';
import { navbarGuard } from './navbar.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'form', component: FormComponent },
  { path: 'categories', component: CategoryComponent, canActivate: [navbarGuard] },
  { path: 'questions', component: QuestionComponent, canActivate: [navbarGuard] },
  { path: 'alternatives', component: AlternativeComponent, canActivate: [navbarGuard] },
  { path: 'chatgpt', component: ChatGptResponsesComponent, canActivate: [navbarGuard] },
  { path: '', redirectTo: '/form', pathMatch: 'full' }
];
