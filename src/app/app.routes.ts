import { Routes } from '@angular/router';
import { FormComponent } from './form-component/form-component.component';
import { InsertComponent } from './insert/insert.component'; 
import { CategoryComponent } from './crud/category/category.component';
import { QuestionComponent } from './crud/question/question.component';
import { AlternativeComponent } from './crud/alternative/alternative.component';


export const routes: Routes = [
  { path: 'form', component: FormComponent },
  { path: 'categories', component: CategoryComponent }, 
  { path: 'questions', component: QuestionComponent }, 
  { path: 'alternatives', component: AlternativeComponent }, 
  { path: '', redirectTo: '/form', pathMatch: 'full' }
];
