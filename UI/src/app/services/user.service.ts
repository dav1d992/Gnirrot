import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '@models/user';
import { catchError, map, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  baseUrl = environment.apiUrl;
  users: User[] = [];

  getUsers() {
    if (this.users.length > 0) return of(this.users);
    return this.http.get<User[]>(this.baseUrl + 'users').pipe(
      map((users) => {
        this.users = users.map((user) => ({
          ...user,
        }));
        return this.users;
      })
    );
  }

  getUser(username: string) {
    const user = this.users.find((x) => x.shortName === username);
    if (user) return of(user);
    return this.http.get<User>(this.baseUrl + 'users/' + username);
  }

  updateUser(updatedUser: User) {
    const request = {
      shortName: updatedUser.shortName,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      dateOfBirth: updatedUser.dateOfBirth.toISOString().split('T')[0],
      workplace: updatedUser.workplace,
      photoUrl: updatedUser.photoUrl,
    };

    return this.http.put(this.baseUrl + 'users', request).pipe(
      catchError((error) => {
        console.error('Error occurred while updating user:', error);
        return throwError(error);
      })
    );
  }
}
