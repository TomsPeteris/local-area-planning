import { Component, OnInit } from "@angular/core";
import {
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
  ],
  templateUrl: "./create-initiative.component.html",
  styleUrls: ["./create-initiative.component.scss"],
})
export class CreateInitiativeComponent implements OnInit {
  form = new FormGroup({
    title: new FormControl("", [Validators.required, Validators.minLength(7)]),
    description: new FormControl("", [
      Validators.required,
      Validators.minLength(15),
    ]),
    goal: new FormControl("", [Validators.required, Validators.minLength(7)]),
    tags: new FormControl<string[]>([]),
    phoneNumber: new FormControl("", [
      Validators.required,
      Validators.pattern(/^\+?\d{10,15}$/),
    ]),
    date: new FormControl("", Validators.required),
  });

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions!: Observable<string[]>;

  constructor(private tagsService: TagsService) {}

  ngOnInit(): void {
    this.tagsService.getTags().subscribe(tags => {
      this.options = tags;

      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(""),
        map(value => this.filterTags(value || ""))
      );
    });
  }

  onOptionSelected(event: any): void {
    const selectedTag = event.option.value;
    const currentTags = this.form.get("tags")?.value || [];

    if (!currentTags.includes(selectedTag)) {
      currentTags.push(selectedTag);
      this.form.get("tags")?.setValue(currentTags);
    }
    this.myControl.setValue("");
  }

  private filterTags(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(tag => tag.toLowerCase().includes(filterValue));
  }

  removeTag(tag: string): void {
    const updatedTags = (this.form.get("tags")?.value || []).filter(
      t => t !== tag
    );
    this.form.get("tags")?.setValue(updatedTags);
  }
}
