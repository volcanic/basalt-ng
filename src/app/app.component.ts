import {Component} from "@angular/core";
import {PlatformService} from "./services/platform.service";
import {OperatingSystem} from "./model/operating-system";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [require('./app.component.scss')],
})
export class AppComponent {
  title = 'app works!';
  operatingSystem = '';

  constructor(platformService: PlatformService) {
    this.operatingSystem = `${OperatingSystem[platformService.operatingSystem]}`;
  }
}
