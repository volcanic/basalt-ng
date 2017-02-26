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

* the application will be started in a separate window automatically

### Android

* run the following command to start the Android version of the application

```
npm cordova-android-start
```

## Building

For each supported platform there is a script that can be used to bundle the application.

### Web

* run the following command to create a release bundle for web
```
npm run release-web
```
* a release bundle for web named ```%npm_package_name%-web-%npm_package_version%.zip``` will be created in directory ```release```

### Linux

* run the following command to create a release bundle for Linux (64-bit)
```
npm run release-linux
```
* a release bundle for Linux named ```%npm_package_name%-linux-x64-%npm_package_version%.zip``` will be created in directory ```release```

### MacOS

* run the following command to create a release bundle for MacOS (64-bit)
* note: to build for MacOS NodeJS command prompt must be run as administrator
```
npm run release-macos
```
* a release bundle for MacOS named ```%npm_package_name%-macos-x64-%npm_package_version%.zip``` will be created in directory ```release```

### Windows

* run the following command to create a release bundle for Windows (64-bit)
```
npm run release-windows
```
* a release bundle for Windows named ```%npm_package_name%-win32-x64-%npm_package_version%.zip``` will be created in directory ```release```

### Android

* run the following command to create a release bundle for Android
```
npm run release-android
```
* a release bundle for Android named ```%npm_package_name%-android-%npm_package_version%.zip``` will be created in directory ```release```
