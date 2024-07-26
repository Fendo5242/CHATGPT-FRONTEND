import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGptResponsesComponent } from './chat-gpt-responses.component';

describe('ChatGptResponsesComponent', () => {
  let component: ChatGptResponsesComponent;
  let fixture: ComponentFixture<ChatGptResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatGptResponsesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatGptResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
