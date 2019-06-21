# Step by step

This guide describes all the steps necessary to recreate the state of the project.

* Check installed versions of NodeJS and npm

```
$ node -v
v8.11.2
```
```
$ npm -v
5.6.0
```

* Install latest version of Angular CLI

```
$ npm install -g @angular/cli
+ @angular/cli@7.3.1
```

* Initialize project

```
ng new basalt-ng --service-worker
```

* Turn app into progressive web app

```
ng add @angular/pwa --project basalt-ng
```

* Enable Angular Material

```
npm install --save @angular/material @angular/cdk @angular/animations
```

* Enable Electron

```
npm install --save-dev electron
npm install --save-dev electron-builder
npm install --save-dev electron-packager
npm install --save-dev @types/node
```

* Enable Cordova

```
npm install --save-dev cordova
```
