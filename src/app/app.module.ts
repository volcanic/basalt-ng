import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {MaterialModule} from "@angular/material";
import {PlatformService} from "./services/platform.service";
import {ResponsiveModule} from "ng2-responsive";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    ResponsiveModule
  ],
  providers: [PlatformService],
  bootstrap: [AppComponent]
})

export class AppModule {
}
