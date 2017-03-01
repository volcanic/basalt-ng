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

* [Electron](https://electron.atom.io/)
* [Cordova](https://cordova.apache.org/)

## Project structure

* **cordova** - cordova working dir (do not touch)
* **doc** - release notes
* **e2e** - end-to-end tests
* **gradle** - gradle wrapper (do not touch)
* **src** - app code

## Requirements

* you can run/build this template using either
  * [NodeJS](https://nodejs.org/en/) or
  * [Gradle](https://gradle.org/) which wraps NodejJS 

## Development

For some supported platforms there is a script that can be used to run the application locally.

### Web

* run the following command to start the web version of the application

```
npm start
```
or
```
gradlew start
```

* call ```http://localhost:4200``` in a browser to start the app

### Desktop

* run the following command to start the desktop version of the application

```
npm electron-start
```
or
```
gradlew electronStart
```

* the application will be started in a separate window automatically

### Android

* run the following command to start the Android version of the application
* note: for the Android version to run you need to have Android SDK installed

```
npm cordova-android-start
```
or
```
gradlew cordovaAndroidStart
```

## Building

For each supported platform there is a script that can be used to bundle the application.

### Web

* run the following command to create a release bundle for web

```
npm run release-web
```
or
```
gradlew releaseWeb
```

* a release bundle for web named ```%npm_package_name%-web-%npm_package_version%.zip``` will be created in directory ```release```

### Linux

* run the following command to create a release bundle for Linux (64-bit)

```
npm run release-linux
```
or
```
gradlew releaseLinux
```

* a release bundle for Linux named ```%npm_package_name%-linux-x64-%npm_package_version%.zip``` will be created in directory ```release```

### MacOS

* run the following command to create a release bundle for MacOS (64-bit)
* note: to build for MacOS NodeJS command prompt must be run as administrator

```
npm run release-macos
```
or
```
gradlew releaseMacos
```

* a release bundle for MacOS named ```%npm_package_name%-macos-x64-%npm_package_version%.zip``` will be created in directory ```release```

### Windows

* run the following command to create a release bundle for Windows (64-bit)

```
npm run release-windows
```
or
```
gradlew releaseWindows
```

* a release bundle for Windows named ```%npm_package_name%-win32-x64-%npm_package_version%.zip``` will be created in directory ```release```

### Android

* run the following command to create a release bundle for Android

```
npm run release-android
```
or
```
gradlew releaseAndroid
```

* a release bundle for Android named ```%npm_package_name%-android-%npm_package_version%.zip``` will be created in directory ```release```
