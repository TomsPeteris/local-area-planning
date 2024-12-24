import { Component, DoCheck, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { SplitterComponent } from "../../../shared/ui/splitter/splitter.component";
import { AsyncPipe, CommonModule } from "@angular/common";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { map, Observable, startWith } from "rxjs";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { TagsService } from "../../../core/services/tags.service";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: "app-create-initiative",
  imports: [
    SplitterComponent,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    MatSelectModule,
  ],
  templateUrl: "./create-initiative.component.html",
  styleUrls: ["./create-initiative.component.scss"],
})
export class CreateInitiativeComponent implements OnInit, DoCheck {
  private tagsService = inject(TagsService);
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(7)]],
      description: ["", [Validators.required, Validators.minLength(15)]],
      goal: ["", [Validators.required, Validators.minLength(7)]],
      tags: [[]],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)],
      ],
      date: ["", Validators.required],
    });
  }

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]> = new Observable<string[]>();

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map(value => this.filterTags(value || ""))
    );
    this.options = this.tagsService.getTagsSignal()();
  }

  ngDoCheck(): void {
    const tags = this.tagsService.getTagsSignal()();
    if (tags && tags.length !== this.options.length) {
      this.options = tags;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(""),
        map(value => this.filterTags(value || ""))
      );
    }
  }

  private filterTags(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(tag => tag.toLowerCase().includes(filterValue));
  }
}
