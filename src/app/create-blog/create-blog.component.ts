import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from '../service/blog.service';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent implements OnInit {
  
  Form: FormGroup;
  submitted: boolean = false;
  preview: string='';

  constructor(
    private fb: FormBuilder,
    private _service:BlogService,
    private router:Router
  ) { 
    this.Form = this.fb.group({
      comment: ['', Validators.required],
      file: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  uploadFile(event:Event) {
    console.log(event)
    const file = (event.target as HTMLInputElement).files;
    console.log(file)
    this.Form.patchValue({
      file: file
    });
    // this.Form.get('file').updateValueAndValidity();
     // File Preview
     const reader = new FileReader();
     reader.onload = () => {
       this.preview = reader.result as string;
       console.log(reader.result)
     }
     console.log(this.preview)
    //  reader.readAsDataURL(file)
  }

  onSubmit(){
    console.log(this.Form.value)
    this._service.create(this.Form.value.comment,this.Form.value.file).subscribe(res=>{
      console.log(res)
    })
  }
  
}
