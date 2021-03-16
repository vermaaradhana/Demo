import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../service/blog.service';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth-guard/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {

  baseURL = environment.apiUrl + '/upload';

  Form: FormGroup;

  record: any = [];
  replyData: any = [];
  user: any;
  activeRow: any;
  msgData: any;
  id: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _blog: BlogService,
    private fb: FormBuilder,
    private _auth: AuthService,
  ) {
    this.Form = this.fb.group({
      msg: ['', Validators.required],
      blogId: [''],
    });
  }

  ngOnInit(): void {
    this.user = this._auth.getUser();
    this._route.params.subscribe(data => {
      this._blog.getById(data.id).subscribe(res => {
        this.record = res['data'][0];
        this.Form.patchValue({
          blogId: this.record._id
        });
        this._blog.getReply({ id: this.record._id }).subscribe(res => {
          if (res['data'] === 'No data to show') {
            this.replyData = [];
          } else {
            this.replyData = res['data'];
          }
        })
      });

    })
  }

  logout() {
    this._auth.logout();
  }

  reply(i?: any, commentId?: any) {
    this.id=commentId;
    this.activeRow = i;
    if (this._auth.isAuthenticated()) {
      if (this.Form.invalid) {
        return;
      }
      this._blog.createReply(this.Form.value).subscribe(res => {
        this._router.navigate(['home']);
      })
    } else {
      this._router.navigate(['/login'])
    }
  }

  enterMsg(e: any) {
    this.msgData = e.target.value
    if (this._auth.isAuthenticated()) {
      this._blog.updateReply({authoreply:this.msgData},this.id).subscribe(res => {
        this.id;
        this.activeRow=-1;
        this.ngOnInit();
      })
    } else {
      this._router.navigate(['/login'])
    }
  }

}
