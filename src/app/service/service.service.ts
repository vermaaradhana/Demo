import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  baseURL = environment.apiUrl + '/user';

  // token = localStorage.getItem('token');

  // headers_object = new HttpHeaders().set("Authorization", this.token);

  httpOptions = {
    // headers: this.headers_object
  };
  
  constructor(private http: HttpClient) { }

  login(data:any) {
    return this.http.post(`${this.baseURL}/login`, data)
  }

  emailCheck(data:any) {
    return this.http.post(`${this.baseURL}/validateEmail`, data)
  }


  get(data:any) {
    return this.http.post(`${this.baseURL}/`, data)
  }

  getById(id:number) {
    return this.http.get(`${this.baseURL}/userById/${id}`,this.httpOptions)
  }

  create(data:any) {
    return this.http.post(`${this.baseURL}/create`, data, this.httpOptions)
  }

}