import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MyInitiativesComponent } from "./my-initiatives.component";

describe("MyInitiativesComponent", () => {
  let component: MyInitiativesComponent;
  let fixture: ComponentFixture<MyInitiativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyInitiativesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyInitiativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
