import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  baseURL = environment.apiUrl + '/user';

  token:any = localStorage.getItem('token');

  headers_object = new HttpHeaders().set("Authorization", this.token);

  httpOptions = {
    headers: this.headers_object
  };
  
  constructor(private http: HttpClient) { }

  login(data:any): Observable<any> {
    return this.http.post(`${this.baseURL}/login`, data)
  }

  get(data:any): Observable<any> {
    return this.http.post(`${this.baseURL}/`, data,this.httpOptions)
  }

  getById(id:number): Observable<any> {
    return this.http.get(`${this.baseURL}/userById/${id}`,this.httpOptions)
  }

  create(data:any): Observable<any> {
    return this.http.post(`${this.baseURL}/create`, data, this.httpOptions)
  }

}