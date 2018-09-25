import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from '../model/user';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {
  private API_URL = environment.apiUrl;
  private usersUrl = '/api/users';
  private FULL_URL = this.API_URL + this.usersUrl;

  constructor(private http: Http) { }

  // get("/api/users") - get all users
  getAllUsers(): Promise<void | User[]> {
    return this.http.get(this.FULL_URL)
      .toPromise()
      .then(response => response.json() as User[])
      .catch(this.handleError);
  }

  createUser(newUser: User): Promise<void | User> {
    return this.http.post(this.FULL_URL, newUser)
    .toPromise()
    .then(response => response.json() as User)
    .catch(this.handleError);
  }

  // get("/api/users/:id") - get user by id
  getUserById(userId: string): Promise<void | User> {
    return this.http
      .get(this.FULL_URL + '/' + userId)
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
  }

  // delete("/api/users/:id") - delete user
  deleteUser(userId: String): Promise<void | User> {
    return this.http.delete(this.FULL_URL + '/' + userId)
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
  }

  // put("/api/users/:id") - update user
  updateUser(updateUser: User): Promise<void | User> {
    return this.http.put(this.FULL_URL + '/' + updateUser._id, updateUser)
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
  }
}
