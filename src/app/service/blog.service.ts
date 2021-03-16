import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  baseURL = environment.apiUrl + '/blog';

  token:any = localStorage.getItem('token');

  headers_object = new HttpHeaders().set("Authorization", this.token);

  httpOptions = {
    headers: this.headers_object
  };
  
  constructor(private http: HttpClient) { }

  get(): Observable<any> {
    return this.http.get(`${this.baseURL}/`, this.httpOptions)
  }

  getById(id:number): Observable<any> {
    return this.http.get(`${this.baseURL}/dataById/${id}`,this.httpOptions)
  }

  create(comment:string,file:FileList): Observable<any> {
    var formData: any = new FormData();
    formData.append("comment",comment);
    formData.append("file",file);
    return this.http.post(`${this.baseURL}/create`, formData, this.httpOptions)
  }

  getReply(data:any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/reply/`,data, this.httpOptions)
  }
  createReply(data:any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/reply/create/`,data, this.httpOptions)
  }
}
