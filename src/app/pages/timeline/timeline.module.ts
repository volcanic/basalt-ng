import {NgModule} from '@angular/core';
import {PersonDialogComponent} from './components/dialogs/person-dialog/person-dialog.component';
import {ProjectDialogComponent} from './components/dialogs/project-dialog/project-dialog.component';
import {ProjectListDialogComponent} from './components/dialogs/project-list-dialog/project-list-dialog.component';
import {TagDialogComponent} from './components/dialogs/tag-dialog/tag-dialog.component';
import {TagListDialogComponent} from './components/dialogs/tag-list-dialog/tag-list-dialog.component';
import {TaskDialogComponent} from './components/dialogs/task-dialog/task-dialog.component';
import {TaskletDialogComponent} from './components/dialogs/tasklet-dialog/tasklet-dialog.component';
import {UploadDialogComponent} from './components/dialogs/upload-dialog/upload-dialog.component';
import {TimelineComponent} from './pages/timeline/timeline.component';
import {TaskletComponent} from './pages/tasklet/tasklet.component';
import {TaskComponent} from './pages/task/task.component';
import {TaskListDialogComponent} from './components/dialogs/task-list-dialog/task-list-dialog.component';
import {UnusedTagsDialogComponent} from './components/dialogs/unused-tags-dialog/unused-tags-dialog.component';
import {TimelineImports} from './timeline.imports';
import {TimelineDeclarations} from './timeline.declaration';
import {BaseComponent} from './pages/base/base.component';

@NgModule({
  imports: [TimelineImports],
  declarations: [TimelineDeclarations],
  entryComponents: [
    // Pages
    BaseComponent,
    TimelineComponent,
    TaskletComponent,
    TaskComponent,

    // Dialogs
    PersonDialogComponent,

    ProjectDialogComponent,
    ProjectListDialogComponent,

    TagDialogComponent,
    TagListDialogComponent,
    UnusedTagsDialogComponent,

    TaskDialogComponent,
    TaskListDialogComponent,

    TaskletDialogComponent,

    UploadDialogComponent
  ], providers: [], exports: [
    TimelineComponent
  ]
})
/**
 * Contains timeline page
 */
export class TimelineModule {
}
