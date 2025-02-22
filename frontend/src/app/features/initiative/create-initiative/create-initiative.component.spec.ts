import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateInitiativeComponent } from "./create-initiative.component";

describe("CreateInitiativeComponent", () => {
  let component: CreateInitiativeComponent;
  let fixture: ComponentFixture<CreateInitiativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInitiativeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateInitiativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
