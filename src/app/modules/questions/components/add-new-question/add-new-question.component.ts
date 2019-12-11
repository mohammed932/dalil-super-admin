import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpQuestionService } from "../../services/questions.service";

@Component({
  selector: "app-add-new-question",
  templateUrl: "./add-new-question.component.html",
  styleUrls: ["./add-new-question.component.scss"]
})
export class AddNewQuestionComponent implements OnInit {
  public addNewQuestionForm: FormGroup;
  loading = false;
  isFixed = false;
  isDisabled = false;
  constructor(
    private fg: FormBuilder,
    // @Inject(MAT_DIALOG_DATA) public city: any,
    private httpQuestionService: HttpQuestionService,
    private dialogRef: MatDialog,
    private notificationSerive: NotificationService
  ) {}

  ngOnInit() {
    this.addNewQuestionForm = this.fg.group({
      question: ["", Validators.required],
      anwser: ["", Validators.required],
      question_ar: ["", Validators.required],
      answer_ar: ["", Validators.required]
    });
  }
  saveNewQuestion() {
    this.isDisabled = true;
    this.loading = true;
    const data = {
      question: this.addNewQuestionForm["controls"].question.value,
      answer: this.addNewQuestionForm["controls"].anwser.value,
      translation: {
        ar: {
          question: this.addNewQuestionForm["controls"].question_ar.value,
          answer: this.addNewQuestionForm["controls"].answer_ar.value
        }
      }
    };
    if (this.addNewQuestionForm.invalid) {
      this.notificationSerive.errorNotification("Please enter correct data");
      this.isDisabled = false;
      this.loading = false;
      return;
    }
    this.httpQuestionService.createNewQuestion(data).subscribe(
      data => {
        if (data.status === 200) {
          this.isDisabled = false;
          this.loading = false;
          this.notificationSerive.successNotification(`تم انشاء السؤال`);
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
