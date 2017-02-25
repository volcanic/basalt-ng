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
mkdir amphibian
cd amphibian
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
  "name"    : "amphibian",
  "version" : "0.0.0",
  "main"    : "electron.ts"
}
```
