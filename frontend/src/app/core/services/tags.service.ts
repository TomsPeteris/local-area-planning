import { Injectable } from "@angular/core";
import tagsData from "../data/tags.json";
import { delay, Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TagsService {
  private tags = tagsData.tags;
  getTags(): Observable<string[]> {
    return of(this.tags).pipe(delay(2000));
  }
}
