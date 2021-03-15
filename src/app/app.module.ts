import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { CreateBlogComponent } from './create-blog/create-blog.component';

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    HomeComponent,
    BlogDetailComponent,
    CreateBlogComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        throwNoTokenError: false,
      },
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
