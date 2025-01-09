import { Pipe, PipeTransform } from "@angular/core";
import { User } from "../../core/models/user.interface";

@Pipe({
  name: "userName",
})
export class UserNamePipe implements PipeTransform {
  transform(user: User | undefined): string {
    // return user ? `${user.firstName} ${user.lastName}` : "";
    return user ? user.username : "";
  }
}
