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
