import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-guard/auth.service';
import { BlogService } from '../service/blog.service';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent implements OnInit {

  Form: FormGroup;
  submitted: boolean = false;
  preview: string = '';

  constructor(
    private fb: FormBuilder,
    private _service: BlogService,
    private router: Router,
    private _auth: AuthService,

  ) {
    this.Form = this.fb.group({
      comment: ['', Validators.required],
      file: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  uploadFile(event: any) {
    const file = event.target.files[0];
    this.Form.patchValue({
      file: file
    });
    // this.Form.get('file').updateValueAndValidity();
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  onSubmit() {
    this._service.create(this.Form.value.comment, this.Form.value.file).subscribe(res => {
      this.router.navigate(['/home'])
    })
  }

  logout() {
    this._auth.logout();
  }

}
