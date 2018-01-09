import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {PlatformService} from "./services/platform.service";
import {ResponsiveModule} from "ng2-responsive";
import {ToolbarComponent} from "./components/toolbar/toolbar.component";
import {MatToolbarModule} from "@angular/material";

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MatToolbarModule,
    ResponsiveModule
  ],
  providers: [PlatformService],
  bootstrap: [AppComponent]
})

export class AppModule {
}
