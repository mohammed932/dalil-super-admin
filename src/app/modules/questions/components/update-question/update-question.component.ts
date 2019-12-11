import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpQuestionService } from "../../services/questions.service";

@Component({
  selector: "app-update-question",
  templateUrl: "./update-question.component.html",
  styleUrls: ["./update-question.component.scss"]
})
export class UpdateQuestionComponent implements OnInit {
  public updateQuestionsForm: FormGroup;
  loading = false;
  isFixed = false;
  isDisabled = false;
  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpQuestionService: HttpQuestionService,
    private dialogRef: MatDialog,
    private notificationSerive: NotificationService
  ) {}

  ngOnInit() {
    this.updateQuestionsForm = this.fg.group({
      question: ["", Validators.required],
      anwser: ["", Validators.required],
      question_ar: ["", Validators.required],
      answer_ar: ["", Validators.required]
    });
    console.log(this.data);
    this.setFormData();
  }

  setFormData() {
    this.updateQuestionsForm["controls"].question.setValue(
      this.data.questionData.question
    );
    this.updateQuestionsForm["controls"].anwser.setValue(
      this.data.questionData.answer
    );
    this.updateQuestionsForm["controls"].question_ar.setValue(
      this.data.questionData.translation.ar.question
    );
    this.updateQuestionsForm["controls"].answer_ar.setValue(
      this.data.questionData.translation.ar.answer
    );
  }
  updateQuestionsss() {
    this.isDisabled = true;
    this.loading = true;
    const data = {
      question: this.updateQuestionsForm["controls"].question.value,
      answer: this.updateQuestionsForm["controls"].anwser.value,
      translation: {
        ar: {
          question: this.updateQuestionsForm["controls"].question_ar.value,
          answer: this.updateQuestionsForm["controls"].answer_ar.value
        }
      }
    };
    if (this.updateQuestionsForm.invalid) {
      this.notificationSerive.errorNotification("من فضلك اكمل ادخال البيانات");
      this.isDisabled = false;
      this.loading = false;
      return;
    }
    this.httpQuestionService
      .updateQuestion(data, this.data.questionId)
      .subscribe(
        data => {
          if (data.status === 200) {
            this.isDisabled = false;
            this.loading = false;
            this.notificationSerive.successNotification(`تم تعديل السؤال`);
            this.dialogRef.closeAll();
          }
        },
        err => {
          this.isDisabled = false;
          this.loading = false;
          this.notificationSerive.errorNotification(err.error.message);
        }
      );
  }
}
