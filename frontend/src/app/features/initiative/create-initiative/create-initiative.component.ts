import {
  Component,
  inject,
  Signal,
  ChangeDetectionStrategy,
  signal,
} from "@angular/core";
import {
  FormBuilder,
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
import { CommonModule } from "@angular/common";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { TagsService } from "../../../core/services/tags.service";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";
import { InitiativeService } from "../../../core/services/initiative.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoadingOnSubmitDirective } from "../../../directives/index";
import { ErrorMessagesPipe } from "../../../shared/pipes";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    MatSelectModule,
    LoadingOnSubmitDirective,
    ErrorMessagesPipe,
  ],
  templateUrl: "./create-initiative.component.html",
  styleUrls: ["./create-initiative.component.scss"],
})
export class CreateInitiativeComponent {
  private tagsService = inject(TagsService);
  private initiativeService = inject(InitiativeService);
  private readonly router = inject(Router);
  private _submitResSnackBar = inject(MatSnackBar);

  form: FormGroup;
  isLoading = signal(false);

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
      startDate: ["", Validators.required],
    });
  }

  options: Signal<string[]> = this.tagsService.getTagsSignal();

  onSubmit(): void {
    this.isLoading.set(true);
    const formValues = this.form.value;

    this.initiativeService
      .createInitiative(formValues)
      .then(response => {
        if (response) {
          this.router.navigate(["/dashboard"]);
        } else {
          this._submitResSnackBar.open("Submition failed!", "Close");
        }
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }
}
