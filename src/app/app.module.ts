import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { QuestionService } from './questionService.service';
import { UserService } from './user.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule,ReactiveFormsModule
  ],
  providers: [QuestionService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
