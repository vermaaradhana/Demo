import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  baseURL = environment.apiUrl + '/blog';

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

  create(comment:string,file:FileList) {
    var formData: any = new FormData();
    formData.append("comment",comment);
    formData.append("file",file);
    return this.http.post(`${this.baseURL}/create`, formData, this.httpOptions)
  }
}
