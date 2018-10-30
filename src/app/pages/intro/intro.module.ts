import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IntroComponent} from './pages/intro/intro.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {IntroRoutingModule} from './intro-routing.module';
import {FeatureFragmentComponent} from './components/feature-fragment/feature-fragment.component';
import {SuggestedActionButtonModule} from '../../ui/suggested-action-button/suggested-action-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    IntroRoutingModule,

    SuggestedActionButtonModule
  ],
  declarations: [
    IntroComponent,
    FeatureFragmentComponent
  ]
})
export class IntroModule {
}
