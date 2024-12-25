import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeLayoutComponent } from './initiative-layout.component';

describe('InitiativeLayoutComponent', () => {
  let component: InitiativeLayoutComponent;
  let fixture: ComponentFixture<InitiativeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitiativeLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitiativeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
