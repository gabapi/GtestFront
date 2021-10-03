import {Component, OnInit ,QueryList,ViewChildren,ElementRef} from '@angular/core';
import {QuestionService} from './questionService.service';
import {UserService} from './user.service';
import {throwError} from 'rxjs';  // Angular 6/RxJS 6
import { FormBuilder, FormGroup ,FormArray ,FormControl, Validators,ValidationErrors } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public user: any;
  public questions: any;
  public quiz: any;
  public sent: boolean;
  public e:string[];
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  public answers: any;
  public form: FormGroup;
  constructor(private fb: FormBuilder,private _questionService: QuestionService, private _userService: UserService) { }

  ngOnInit() {
    this.quiz = {};
    this.form = this.fb.group(this.quiz);
    this.getQuestions();
    this.sent=false;
    this.answers = [];
    this.user = {
      username: '',
      password: ''
    };
  }

  login() {
    this._userService.login({'username': this.user.username, 'password': this.user.password});
  }

  refreshToken() {
    this._userService.refreshToken();
  }

  logout() {
    this._userService.logout();
  }
  onCheckboxChange(e,id) {
    const checkArray: FormArray = this.form.get('q'+id) as FormArray;
  
    if (e && e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  getFormValidationErrors() {
    this.e=[];
    Object.keys(this.form.controls).forEach(key => {
    
    const controlErrors: ValidationErrors = this.form.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
            //this.e.push('Key control: ' + key + ', keyError: ' + keyError + ', err value: '+ controlErrors[keyError]);
            this.e.push('please fill out all required fields');
          });
        }
      });
      
    }
  getQuestions() {
    this._questionService.list().subscribe(
      // the first argument is a function which runs on success
      data => {
        this.questions = data;
        // convert the dates to a nice format
        for (let question of this.questions) {
          if(question.question_type==2){
            if(question.require){
              this.form.addControl('q'+question.id,this.fb.array([],Validators.required));
            }else{
              this.form.addControl('q'+question.id,this.fb.array([]));
            }
            
          }else{
            if(question.require){
              this.form.addControl('q'+question.id,new FormControl('', Validators.required));
            }else{
              this.form.addControl('q'+question.id,new FormControl(''));
            }
            
          }
          
        }
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading questions')
    );
  }
  uncheckAll() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }
  submitForm() {
   
    //console.log(this.form.value);
      this.getFormValidationErrors();
      if(this.e.length){
        return;
      }
      let newtest = {json:this.form.value};
      this._questionService.create(newtest, this.user.token).subscribe(
          data => {
            // refresh the list
            //this.getPosts();
            //console.log(data);
            this.sent = true;
            this.form.reset();
            this.uncheckAll();
            return true;
          },
          error => {
            //console.error('Error saving!');
            return throwError(error);
          }
      );
    }
}
