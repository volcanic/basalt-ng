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

## Building

For each supported platform there is a script that can be used to bundle the application.

### Web

* run the following command to create a release bundle for web
```
npm run release-web
```
* release bundle for web named ```%npm_package_name%-web-%npm_package_version%.zip``` will be created in releases directory where
