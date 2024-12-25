import { Injectable, Signal, signal } from "@angular/core";
import tagsData from "../data/tags.json";

@Injectable({
  providedIn: "root",
})
export class TagsService {
  private readonly tagsSignal = signal<string[]>([]);

  constructor() {
    this.fetchTagsWithDelay();
  }

  getTagsSignal(): Signal<string[]> {
    return this.tagsSignal.asReadonly();
  }
  private fetchTagsWithDelay(): void {
    setTimeout(() => {
      this.tagsSignal.set(tagsData.tags);
    }, 2000);
  }
}
