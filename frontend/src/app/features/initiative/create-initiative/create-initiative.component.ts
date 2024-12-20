import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SplitterComponent } from '../../../shared/ui/splitter/splitter.component';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BehaviorSubject, map, Observable, startWith } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-create-initiative',
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
  ],
  templateUrl: './create-initiative.component.html',
  styleUrls: ['./create-initiative.component.scss'],
})
export class CreateInitiativeComponent implements OnInit {
  // FormControl for the input field
  myControl = new FormControl();
  // Sample options
  options: string[] = [
    'Tag1',
    'Tag2',
    'Tasadasdasdg3',
    'Tag4',
    'dsadsadasd',
    'dasdsadasdasd',
    '324324234',
    'asdsadasdxc',
    'hjkhjkjhkl',
  ];
  // Selected tags to display in the input
  private selectedTagsSubject = new BehaviorSubject<string[]>([]);
  selectedTags$: Observable<string[]> = this.selectedTagsSubject.asObservable();
  // Observable for filtered options
  filteredOptions: Observable<string[]>;

  constructor(private router: Router) {
    // Filter options based on the input value
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  onSubmit() {
    // Handle form submission logic here
    // After submission, navigate back to the previous route
    this.router.navigate(['..']); // Adjust the route as necessary
  }

  goBack() {
    this.router.navigate(['..']); // Navigate back to the previous route
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }
  displayFn(option: string): string {
    return option ? option : '';
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  // Add the selected tag to the selectedTags array
  onOptionSelected(event: any): void {
    const selectedTag = event.option.value;
    const currentTags = this.selectedTagsSubject.value;

    if (!currentTags.includes(selectedTag)) {
      currentTags.push(selectedTag);
      this.selectedTagsSubject.next(currentTags);
      this.myControl.setValue('');
    }
  }

  // Remove a selected tag
  removeTag(tag: string): void {
    const updatedTags = this.selectedTagsSubject.value.filter((t) => t !== tag);
    this.selectedTagsSubject.next(updatedTags);
  }

  // Handle input changes (optional)
  onInput(event: any): void {
    // You can add logic to handle input events, e.g., validation, custom behavior, etc.
  }
}
