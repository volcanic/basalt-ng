import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {NgModule} from '@angular/core';
import {CoreModule} from './core/core.module';
import {MaterialModule} from './ui/material/material.module';
import {NewFeaturesDialogModule} from './ui/new-features-dialog/new-features-dialog.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,

    MaterialModule,

    // Core service
    CoreModule,

    NewFeaturesDialogModule,

    // Pages (loaded via lazy loading)
    // TimelineModule,
    // CalendarModule,
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {

}
