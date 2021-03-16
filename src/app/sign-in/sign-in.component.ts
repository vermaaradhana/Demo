import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {


  Form: FormGroup;
  submitted: boolean = false;
  errMessage: string='';

  constructor(
    private fb: FormBuilder,
    private _service: ServiceService,
    private router: Router
  ) {
    this.Form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  get f() {
    return this.Form.controls
  }

  onSubmit() {
    this.submitted = true;
    if (this.Form.invalid) {
      return;
    }
    this._service.login(this.Form.value).subscribe((res) => {
      let data = res['data'];
      let token = res['token'];
      localStorage.setItem('profile', (JSON.stringify(data)));
      localStorage.setItem('token', token);
      this.submitted = false;
      this.router.navigate(['/home']);
    }, err => {
      this.errMessage=err.error.message
    });
  }
}
