import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackedInitiativesComponent } from './tracked-initiatives.component';

describe('TrackedInitiativesComponent', () => {
  let component: TrackedInitiativesComponent;
  let fixture: ComponentFixture<TrackedInitiativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackedInitiativesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackedInitiativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
