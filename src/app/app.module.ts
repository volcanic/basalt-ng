import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {NgModule} from '@angular/core';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {TimelineModule} from './pages/timeline/timeline.module';
import {CalendarModule} from './pages/calendar/calendar.module';
import {CoreModule} from './core/core.module';

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

    // Core service
    CoreModule,

    // Pages
    TimelineModule,
    CalendarModule,
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
}
