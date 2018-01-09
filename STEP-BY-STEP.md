# Step by step

This guide describes all the steps necessary to recreate the state of the project.

## NodeJS

* install NodeJS 6.9.4+ from [nodejs.org](https://nodejs.org/en/)

##  Angular

* for details see [Angular CLI Quickstart](https://angular.io/docs/ts/latest/cli-quickstart.html)

* install Angular CLI
```
npm install -g @angular/cli
```
* initialize project
```
mkdir basalt
cd basalt
ng init
```

### Angular Material

* for details see [Angular Material Getting Started](https://material.angular.io/guide/getting-started)

* install Angular Material
```
npm install --save @angular/material
```
* add import statement to src/app/app.module.ts
```
import { MaterialModule } from '@angular/material';
// other imports 
@NgModule({
  imports: [MaterialModule],
  ...
})
export class PizzaPartyAppModule { }
```
* add theme file src/theme.scss
``` 
@import '~@angular/material/core/theming/all-theme';

@include mat-core();
$app-primary: mat-palette($mat-cyan);
$app-accent:  mat-palette($mat-amber, A200, A100, A400);
$app-theme: mat-light-theme($app-primary, $app-accent, $app-warn);
@include angular-material-theme($app-theme);
```

## Electron

* install Electron
```
npm install --save-dev electron
```
* add file src/electron/electron.js
```
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let win;

function createWindow () {
  win = new BrowserWindow({width: 1080, height: 800});
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  win.on('closed', () => { win = null })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit() }
});

app.on('activate', () => {
  if (win === null) { createWindow() }
});
```
* add file src/electron/package.json
```
{
  "name"    : "basalt",
  "version" : "0.0.0",
  "main"    : "electron.ts"
}
```

## Cordova

* install Cordova
```
npm install -g cordova
```
* create cordova directories
```
mkdir cordova/scripts
mkdir cordova/www
```
* create file cordova/config.xml
```
<?xml version='1.0' encoding='utf-8'?>
<widget id="de.interoberlin.basalt" version="1.0.0" android-versionCode="1">
  <name>basalt</name>
  <description>
    A sample Apache Cordova application
  </description>
  <author email="florian.schwanz@interoberlin.de" href="https://interoberlin.de">
    Interoberlin
  </author>
  <content src="index.html"/>
  <plugin name="cordova-plugin-whitelist" spec="~1.3.0"/>
  <plugin name="cordova-plugin-splashscreen" spec="~4.0.0"/>
  <access origin="*"/>
  <allow-intent href="http://*/*"/>
  <allow-intent href="https://*/*"/>
  <allow-intent href="tel:*"/>
  <allow-intent href="sms:*"/>
  <allow-intent href="mailto:*"/>
  <allow-intent href="geo:*"/>

  <!-- Build and prepare the Angular 2 application. -->
  <hook type="before_prepare" src="scripts/prepare-app.js"/>

  <!-- Configure the splashscreen. -->
  <preference name="SplashShowOnlyFirstTime" value="false"/>
  <preference name="ShowSplashScreenSpinner" value="false"/>

  <platform name="android">
    <allow-intent href="market:*"/>
  </platform>
  <platform name="ios">
    <allow-intent href="itms:*"/>
    <allow-intent href="itms-apps:*"/>
  </platform>
  <engine name="android" spec="~5.2.2"/>
</widget>
```
* create file cordova/scripts/prepare-app.js
```
const fs = require('fs');
const execSync = require('child_process').execSync;

module.exports = function(context) {
    console.log('Building Angular 2 application into "./www" directory.');
    const basePath = context.opts.projectRoot;
    const baseWWW = basePath + '/www';

    console.log(execSync(
      "ng build --target=production --environment=prod --output-path cordova/www/ --base-href .",
      {
        maxBuffer: 1024*1024,
        cwd: basePath + '/..'
      }).toString('utf8')
    );
    var files = fs.readdirSync(baseWWW);
    for (var i = 0; i < files.length; i++) {
      if (files[i].endsWith('.gz')) {
        fs.unlinkSync(baseWWW + '/' + files[i]);
      }
    }
    fs.writeFileSync(baseWWW + '/.gitignore', `# Ignore everything in this directory
*
# Except this file
!.gitignore
`);
};
```
* add Android platform
```
cordova platform add android
```

## Gradle

* copy gradle files and directory from a gradle project
  * .gradle
  * gradlew
  * gradlew.bat
  
* add build.gradle
```
buildscript {
  repositories {
    mavenCentral()
    jcenter()
  }
  dependencies {
    classpath 'com.moowork.gradle:gradle-node-plugin:0.12'
  }
}

apply plugin: "com.moowork.node"

node {
  version = '5.8.0'
  npmVersion = '3.8.0'
  download = true
  // distBaseUrl = Custom artifactory location here for node/npm.
}

repositories {
  mavenCentral()
}

configurations {
  providedRuntime
}

task start(type: Exec) {
  executable = 'npm'
  args = ['run', 'start']
}

task wrapper(type: Wrapper) {
  gradleVersion = '2.12'
}
```
* initialize npm with gradle
```
gradlew npmInstall
gradlew npm_update
```
