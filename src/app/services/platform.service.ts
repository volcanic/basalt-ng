import {Injectable} from "@angular/core";
import {OperatingSystem} from "../model/operating-system";

@Injectable()
export class PlatformService {

  operatingSystem: OperatingSystem;

  constructor() {
    if (navigator.appVersion.indexOf("Win") != -1) this.operatingSystem = OperatingSystem.WINDOWS;
    if (navigator.appVersion.indexOf("Mac") != -1) this.operatingSystem = OperatingSystem.MAC;
    if (navigator.appVersion.indexOf("X11") != -1) this.operatingSystem = OperatingSystem.UNIX;
    if (navigator.appVersion.indexOf("Linux") != -1) this.operatingSystem = OperatingSystem.LINUX;
  }
}
