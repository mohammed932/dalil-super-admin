import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { QuestionsRoutingModule } from './questions.routing';
import { QuestionsComponent } from './questions.component';
import { AddNewQuestionComponent } from './components/add-new-question/add-new-question.component';
import { UpdateQuestionComponent } from './components/update-question/update-question.component';

@NgModule({
  imports: [CommonModule, SharedModule, QuestionsRoutingModule],
  declarations: [QuestionsComponent, AddNewQuestionComponent, UpdateQuestionComponent],
  entryComponents: [AddNewQuestionComponent, UpdateQuestionComponent]
})
export class QuestionsModule { }
