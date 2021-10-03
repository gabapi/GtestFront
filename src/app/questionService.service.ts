import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from './user.service';

@Injectable()
export class QuestionService {

  constructor(private http: HttpClient, private _userService: UserService) {
  }

  // Uses http.get() to load data from a single API endpoint
  list() {
    return this.http.get('/api/questions');
  }

  // send a POST request to the API to create a new data object
  create(post, token) {
    return this.http.post('/api/answers', JSON.stringify(post), this.getHttpOptions());
  }


  
  // helper function to build the HTTP headers
  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this._userService.token
      })
    };
  }

}
