import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth-guard/auth.service';
import { BlogService } from '../service/blog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  record:any=[];

  constructor(
    private _service:BlogService,
    private _auth:AuthService
  ) { }

  baseURL = environment.apiUrl + '/upload';

  ngOnInit(): void {
    this._service.get().subscribe(res => {
      this.record=res['data'];
    })
  }

  logout(){
    this._auth.logout();
  }

}
