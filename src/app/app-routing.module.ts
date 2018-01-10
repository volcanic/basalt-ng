import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TaskletsComponent} from './view/pages/stacks/tasklets.component';

const routes: Routes = [
    {path: '', redirectTo: 'tasklets', pathMatch: 'full'},
    {path: 'tasklets', component: TaskletsComponent}
  ]
;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
