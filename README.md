# Amphibian

## Aim

This project can be used as an app template to target multiple platforms such as

* Web servers
* Desktop operating systems
  * Linux
  * MacOS
  * Windows
* Mobile operating systems
  * Android
  * iOS
  * Windows Mobile

This template uses frameworks and guidelines to allow for a quick development such as

* [Angular](https://angular.io)
* [Material Design](http://material.io/)
* [Typescript](https://www.typescriptlang.org/)
* [Sass](http://sass-lang.com/)

as well as frameworks to enable multi-platform support

* [electron](https://electron.atom.io/)
* [cordova](https://cordova.apache.org/)

## Project structure

tbd

## Development

For some supported platforms there is a script that can be used to run the application locally.

### Web

* run the following command to start the web version of the application

```
npm start
```

* call ```http://localhost:4200``` in a browser to start the app

### Desktop

* run the following command to start the desktop version of the application

```
npm electron-start
```

* the application will be started in separate window automatically

## Building

For each supported platform there is a script that can be used to bundle the application.

### Web

* run the following command to create a release bundle for web
```
npm run release-web
```
* release bundle for web named ```%npm_package_name%-web-%npm_package_version%.zip``` will be created in releases directory

### MacOS

* run the following command to create a release bundle for MacOS (64-bit)
* note: to build for MacOS NodeJS command prompt must be run as administrator
```
npm run release-macos
```
* release bundle for MacOS named ```%npm_package_name%-macos-x64-%npm_package_version%.zip``` will be created in releases directory

### Windows

* run the following command to create a release bundle for Windows (64-bit)
```
npm run release-windows
```
* release bundle for Windows named ```%npm_package_name%-win32-x64-%npm_package_version%.zip``` will be created in releases directory
