import { Component, inject, Signal, signal } from "@angular/core";
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
import { ActivatedRoute, Router } from "@angular/router";
import { InitiativeService } from "../../../core/services/initiative.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoadingOnSubmitDirective } from "../../../directives/index";
import { ErrorMessagesPipe } from "../../../shared/pipes";
import { take } from "rxjs";

@Component({
  selector: "app-create-proposal",
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
  templateUrl: "./create-proposal.component.html",
  styleUrls: ["./create-proposal.component.scss"],
})
export class CreateProposalComponent {
  private tagsService = inject(TagsService);
  private initiativeService = inject(InitiativeService);
  private readonly router = inject(Router);
  private _submitResSnackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      description: ["", [Validators.required, Validators.minLength(15)]],
      costEstimate: ["", [Validators.required]],
      completionDate: ["", Validators.required],
    });
  }

  isLoading = signal(false);
  options: Signal<string[]> = this.tagsService.getTagsSignal();

  onSubmit(): void {
    this.isLoading.set(true);

    this.route.params.pipe(take(1)).subscribe(params => {
      const initiativeId = params["id"];
      const formValues = this.form.value;
      if (initiativeId) {
        this.initiativeService
          .createProposal(formValues, initiativeId)
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
    });
  }
}
