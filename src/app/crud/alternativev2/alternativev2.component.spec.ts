import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alternativev2Component } from './alternativev2.component';

describe('Alternativev2Component', () => {
  let component: Alternativev2Component;
  let fixture: ComponentFixture<Alternativev2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alternativev2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Alternativev2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
