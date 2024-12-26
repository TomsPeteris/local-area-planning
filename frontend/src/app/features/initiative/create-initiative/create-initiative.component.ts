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
import { FeedsService } from "../../../core/services/feeds.service";
import { LoadingSpinnerComponent } from "../../../shared/ui/loading-spinner/loading-spinner.component";
import { Router } from "@angular/router";

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
    LoadingSpinnerComponent,
  ],
  templateUrl: "./create-initiative.component.html",
  styleUrls: ["./create-initiative.component.scss"],
})
export class CreateInitiativeComponent {
  private tagsService = inject(TagsService);
  private feedsService = inject(FeedsService);
  private readonly router = inject(Router);

  form: FormGroup;
  isLoading = signal(false);
  submissionStatus = signal<"idle" | "success" | "error">("idle");

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

  options: Signal<string[]> = this.tagsService.getTagsSignal();

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.submissionStatus.set("idle");
    const formValues = this.form.value;

    this.feedsService
      .submitFeed(formValues)
      .then(() => {
        this.isLoading.set(false);
        this.submissionStatus.set("success");
        this.router.navigate(["/dashboard"]);
      })
      .catch(() => {
        this.isLoading.set(false);
        this.submissionStatus.set("error");
      });
  }
}
