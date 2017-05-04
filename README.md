# Amphibian

## Aim

This project can be used as an app template to target multiple platforms such as

* Web browsers
  * incl. progressive web app enhancement
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

as well as frameworks and guidelines to enable multi-platform support

* [Electron](https://electron.atom.io/)
* [Cordova](https://cordova.apache.org/)
* [PWA](https://developers.google.com/web/progressive-web-apps/)

## Project structure

* **cordova** - cordova working dir (do not touch)
* **doc** - release notes
* **e2e** - end-to-end tests
* **gradle** - gradle wrapper (do not touch)
* **src** - app code

## Requirements

* you can run/build this template using either
  * [NodeJS](https://nodejs.org/en/) or
  * [Gradle](https://gradle.org/) which wraps NodeJS 

## Developing

For some supported platforms there is a script that can be used to run the application locally.

### Web

* run the following command and call ```http://localhost:4200``` in a browser to start the web version of the application

```
npm web-start
```
or
```
gradlew webStart
```

### Web (Progressive Web App)

* run the following command and call ```http://localhost:4200``` in a browser to start the progressive web app version of the application

```
npm progressive-start
```
or
```
gradlew progressiveStart
```

### Desktop

* run the following command to start the desktop version of the application in a separate window automatically

```
npm electron-start
```
or
```
gradlew electronStart
```

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

## Testing

tbd

## Building

For each supported platform there is a script that can be used to bundle the application.
Call the following command to build release bundles for all supported platforms as well as release notes

```
npm run release-all
```
or
```
gradlew releaseAll
```

### Web

* run the following command to create a release bundle for web
* a release bundle for web named ```%npm_package_name%-web-%npm_package_version%.zip``` will be created in directory ```release```

```
npm run web-release
```
or
```
gradlew webRelease
```

### Web (Progressive Web App)

* run the following command to create a release bundle for a progressive web app
* a release bundle for web named ```%npm_package_name%-progressive-%npm_package_version%.zip``` will be created in directory ```release```

```
npm run progressive-release
```
or
```
gradlew progressiveRelease
```

### Linux

* run the following command to create a release bundle for Linux (64-bit)
* a release bundle for Linux named ```%npm_package_name%-linux-x64-%npm_package_version%.zip``` will be created in directory ```release```

```
npm run linux-release
```
or
```
gradlew linuxRelease
```

### MacOS

* run the following command to create a release bundle for MacOS (64-bit)
* note: to build for MacOS NodeJS command prompt must be run as administrator
* a release bundle for MacOS named ```%npm_package_name%-macos-x64-%npm_package_version%.zip``` will be created in directory ```release```

```
npm run macos-release
```
or
```
gradlew macosRelease
```

### Windows

* run the following command to create a release bundle for Windows (64-bit)
* a release bundle for Windows named ```%npm_package_name%-win32-x64-%npm_package_version%.zip``` will be created in directory ```release```

```
npm run windows-release
```
or
```
gradlew windowsRelease
```

### Android

* run the following command to create a release bundle for Android
* a release bundle for Android named ```%npm_package_name%-android-%npm_package_version%.zip``` will be created in directory ```release```

```
npm run android-release
```
or
```
gradlew androidRelease
```

### Release Notes

* run the following command to create release notes as html file
* note: you can add information by editing```release-notes-<version>.md``` where <_version_> must match the version attribute in ```package.json``` 
* a release notes html file named ```%npm_package_name%-release-notes-%npm_package_version%.html``` will be created in directory ```release```

```
npm run release-notes
```
or
```
gradlew releaseNotes
```
