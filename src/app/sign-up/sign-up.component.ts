import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  Form: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _service: ServiceService,
    private router: Router,
  ) {
    this.Form = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],

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
    this._service.create(this.Form.value).subscribe(res => {
      this.router.navigate(['login']);
    });
  }
}
