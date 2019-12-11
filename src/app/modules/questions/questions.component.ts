import { Component, OnInit, Optional, ChangeDetectorRef } from '@angular/core';
import { HttpQuestionService } from './services/questions.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { AddNewQuestionComponent } from './components/add-new-question/add-new-question.component';
import { NotificationService } from '../../shared/services/notifications/notification.service';
import { UpdateQuestionComponent } from './components/update-question/update-question.component';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  questions: any;
  $destroy = new Subject<any>();
  loading = false;
  constructor(
    private httpQuestionService: HttpQuestionService,
    @Optional() public dialogRef: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private notifcationService: NotificationService
  ) { }

  ngOnInit() {
    this.getQuestions();
  }

  getQuestions() {
    this.httpQuestionService.getAllQuestions().subscribe(data => {
      if (data.status === 200) {
        this.questions = data.body;
      }
    })
  }

  updateQuestion(questionId, element) {
    const dialogRef = this.dialogRef.open(UpdateQuestionComponent, {
      maxWidth: "60%",
      width: "60%",
      data: {
        questionData: element,
        questionId: questionId
      }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.getQuestions();
        this.changeDetectorRefs.detectChanges();
      });
  }

  deleteQuestion(questionId, index) {
    this.httpQuestionService.deleteQuestion(questionId).subscribe(data => {
      if (data.status === 200) {
        console.log({
          array: this.questions,
          index: index
        })
        this.questions.splice(index, 1);
        this.notifcationService.errorNotification(`تم حذف السؤال `)
      }
    }, err => {
      this.notifcationService.errorNotification(err.error.message);
    })
  }

  addNewQuestion() {
    const dialogRef = this.dialogRef.open(AddNewQuestionComponent, {
      maxWidth: "60%",
      width: "60%",
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.getQuestions();
        this.changeDetectorRefs.detectChanges();
      });
  }
}
