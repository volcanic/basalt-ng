(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-intro-intro-module"],{

/***/ "./src/app/pages/intro/components/feature-fragment/feature-fragment.component.html":
/*!*****************************************************************************************!*\
  !*** ./src/app/pages/intro/components/feature-fragment/feature-fragment.component.html ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"flexcontainer\">\r\n  <div class=\"flexbox centered\" *ngFor=\"let action of featureActions\" (mouseenter)=\"onHoverContainer(true, action)\"\r\n       (mouseleave)=\"onHoverContainer(false, action)\">\r\n    <app-suggested-action-button\r\n      [backgroundColor]=\"action.backgroundColor\"\r\n      [iconColor]=\"action.iconColor\"\r\n      [icon]=\"action.icon\"\r\n      [label]=\"action.label\"\r\n      (buttonClickedEmitter)=\"onFeatureToggled(action)\">\r\n    </app-suggested-action-button>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/pages/intro/components/feature-fragment/feature-fragment.component.scss":
/*!*****************************************************************************************!*\
  !*** ./src/app/pages/intro/components/feature-fragment/feature-fragment.component.scss ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".flexcontainer {\n  display: flex; }\n\n.flexbox {\n  flex-grow: 1; }\n\n.centered {\n  text-align: center; }\n\n::ng-deep .typeSelect div.mat-select-arrow-wrapper {\n  display: none; }\n\n::ng-deep .typeSelect.mat-select {\n  display: inline;\n  width: 1px; }\n"

/***/ }),

/***/ "./src/app/pages/intro/components/feature-fragment/feature-fragment.component.ts":
/*!***************************************************************************************!*\
  !*** ./src/app/pages/intro/components/feature-fragment/feature-fragment.component.ts ***!
  \***************************************************************************************/
/*! exports provided: FeatureFragmentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeatureFragmentComponent", function() { return FeatureFragmentComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core_ui_services_color_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/ui/services/color.service */ "./src/app/core/ui/services/color.service.ts");
/* harmony import */ var _core_settings_services_feature_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../core/settings/services/feature.service */ "./src/app/core/settings/services/feature.service.ts");
/* harmony import */ var _core_settings_services_settings_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../core/settings/services/settings.service */ "./src/app/core/settings/services/settings.service.ts");
/* harmony import */ var _core_settings_model_setting_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../core/settings/model/setting.model */ "./src/app/core/settings/model/setting.model.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Represents a feature action button
 */
var FeatureAction = /** @class */ (function () {
    function FeatureAction() {
        /** Active **/
        this.active = false;
    }
    return FeatureAction;
}());
/**
 * Displays feature fragment
 */
var FeatureFragmentComponent = /** @class */ (function () {
    /**
     * Constructor
     * @param colorService color service
     * @param featureService feature service
     * @param settingsService settings service
     */
    function FeatureFragmentComponent(colorService, featureService, settingsService) {
        this.colorService = colorService;
        this.featureService = featureService;
        this.settingsService = settingsService;
        /** Map of current settings */
        this.settings = new Map();
        /** Event emitter indicating tasklet type selection */
        this.featureToggledEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        /** List of tasklet type actions */
        this.featureActions = [];
    }
    //
    // Lifecycle hooks
    //
    /**
     * Handles on-init lifecycle phase
     */
    FeatureFragmentComponent.prototype.ngOnInit = function () {
        this.initializeFeatures();
    };
    /**
     * Handles on-changes lifecycle phase
     */
    FeatureFragmentComponent.prototype.ngOnChanges = function (changes) {
        this.updateActionActive();
        this.updateActionColor();
    };
    //
    // Initialization
    //
    /**
     * Initializes tasklet types
     */
    FeatureFragmentComponent.prototype.initializeFeatures = function () {
        var _this = this;
        this.featureActions = [];
        if (this.featureService.features != null) {
            this.featureService.features.forEach(function (feature) {
                var action = new FeatureAction();
                action.featureType = feature.type;
                action.settingType = feature.settingType;
                action.backgroundColor = _this.getFeatureColor(action.featureType, action.active);
                action.iconColor = _this.getFeatureContrast(action.featureType, action.active);
                action.icon = feature.icon;
                action.label = feature.type.toString();
                _this.featureActions.push(action);
            });
        }
    };
    //
    // Actions
    //
    /**
     * Handles selection of a feature
     * @param action feature action
     */
    FeatureFragmentComponent.prototype.onFeatureToggled = function (action) {
        this.settingsService.updateSetting(new _core_settings_model_setting_model__WEBPACK_IMPORTED_MODULE_4__["Setting"](action.settingType, !action.active));
    };
    /**
     * Handles hover over container
     * @param {boolean} hovered whether there is currently a hover event
     * @param {TaskletTypeGroupAction} action tasklet type group action
     */
    FeatureFragmentComponent.prototype.onHoverContainer = function (hovered, action) {
        this.hoveredFeature = hovered ? action.featureType : null;
        this.updateActionColor();
    };
    //
    // Helpers
    //
    /**
     * Updates active status
     */
    FeatureFragmentComponent.prototype.updateActionActive = function () {
        var _this = this;
        this.featureActions.forEach(function (action) {
            var setting = _this.settingsService.settings.get(action.settingType);
            action.active = setting != null && JSON.parse(setting.value) === true;
        });
    };
    /**
     * Updates colors
     */
    FeatureFragmentComponent.prototype.updateActionColor = function () {
        var _this = this;
        this.featureActions.forEach(function (action) {
            action.backgroundColor = _this.getFeatureColor(action.featureType, action.active);
            action.iconColor = _this.getFeatureContrast(action.featureType, action.active);
        });
    };
    /**
     * Retrieves a color by feature and current settingType
     * @param feature feature
     * @param active active
     */
    FeatureFragmentComponent.prototype.getFeatureColor = function (feature, active) {
        if (active || this.hoveredFeature === feature) {
            return this.colorService.getFeatureTypeColor(feature).color;
        }
        else {
            return this.colorService.getFeatureTypeColor(null).color;
        }
    };
    /**
     * Retrieves a contrast by feature and current settingType
     * @param feature feature
     * @param active active
     */
    FeatureFragmentComponent.prototype.getFeatureContrast = function (feature, active) {
        if (active || this.hoveredFeature === feature) {
            return this.colorService.getFeatureTypeColor(feature).contrast;
        }
        else {
            return this.colorService.getFeatureTypeColor(null).contrast;
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], FeatureFragmentComponent.prototype, "settings", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], FeatureFragmentComponent.prototype, "featureToggledEmitter", void 0);
    FeatureFragmentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-feature-fragment',
            template: __webpack_require__(/*! ./feature-fragment.component.html */ "./src/app/pages/intro/components/feature-fragment/feature-fragment.component.html"),
            styles: [__webpack_require__(/*! ./feature-fragment.component.scss */ "./src/app/pages/intro/components/feature-fragment/feature-fragment.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [_core_ui_services_color_service__WEBPACK_IMPORTED_MODULE_1__["ColorService"],
            _core_settings_services_feature_service__WEBPACK_IMPORTED_MODULE_2__["FeatureService"],
            _core_settings_services_settings_service__WEBPACK_IMPORTED_MODULE_3__["SettingsService"]])
    ], FeatureFragmentComponent);
    return FeatureFragmentComponent;
}());



/***/ }),

/***/ "./src/app/pages/intro/intro-routing.module.ts":
/*!*****************************************************!*\
  !*** ./src/app/pages/intro/intro-routing.module.ts ***!
  \*****************************************************/
/*! exports provided: IntroRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntroRoutingModule", function() { return IntroRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _pages_intro_intro_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/intro/intro.component */ "./src/app/pages/intro/pages/intro/intro.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var routes = [
    { path: '', component: _pages_intro_intro_component__WEBPACK_IMPORTED_MODULE_2__["IntroComponent"] }
];
var IntroRoutingModule = /** @class */ (function () {
    function IntroRoutingModule() {
    }
    IntroRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], IntroRoutingModule);
    return IntroRoutingModule;
}());



/***/ }),

/***/ "./src/app/pages/intro/intro.module.ts":
/*!*********************************************!*\
  !*** ./src/app/pages/intro/intro.module.ts ***!
  \*********************************************/
/*! exports provided: IntroModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntroModule", function() { return IntroModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _pages_intro_intro_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/intro/intro.component */ "./src/app/pages/intro/pages/intro/intro.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _ui_material_material_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../ui/material/material.module */ "./src/app/ui/material/material.module.ts");
/* harmony import */ var _intro_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./intro-routing.module */ "./src/app/pages/intro/intro-routing.module.ts");
/* harmony import */ var _components_feature_fragment_feature_fragment_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/feature-fragment/feature-fragment.component */ "./src/app/pages/intro/components/feature-fragment/feature-fragment.component.ts");
/* harmony import */ var _ui_suggested_action_button_suggested_action_button_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../ui/suggested-action-button/suggested-action-button.module */ "./src/app/ui/suggested-action-button/suggested-action-button.module.ts");
/* harmony import */ var _ui_new_features_dialog_new_features_dialog_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../ui/new-features-dialog/new-features-dialog.module */ "./src/app/ui/new-features-dialog/new-features-dialog.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var IntroModule = /** @class */ (function () {
    function IntroModule() {
    }
    IntroModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                _ui_material_material_module__WEBPACK_IMPORTED_MODULE_4__["MaterialModule"],
                _intro_routing_module__WEBPACK_IMPORTED_MODULE_5__["IntroRoutingModule"],
                _ui_new_features_dialog_new_features_dialog_module__WEBPACK_IMPORTED_MODULE_8__["NewFeaturesDialogModule"],
                _ui_suggested_action_button_suggested_action_button_module__WEBPACK_IMPORTED_MODULE_7__["SuggestedActionButtonModule"]
            ],
            declarations: [
                _pages_intro_intro_component__WEBPACK_IMPORTED_MODULE_2__["IntroComponent"],
                _components_feature_fragment_feature_fragment_component__WEBPACK_IMPORTED_MODULE_6__["FeatureFragmentComponent"]
            ]
        })
    ], IntroModule);
    return IntroModule;
}());



/***/ }),

/***/ "./src/app/pages/intro/pages/intro/intro.component.html":
/*!**************************************************************!*\
  !*** ./src/app/pages/intro/pages/intro/intro.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main\">\r\n  <div class=\"content\">\r\n    <div class=\"header\">\r\n      <div class=\"title\">{{ title }}</div>\r\n      <div class=\"description\">{{ description }}</div>\r\n    </div>\r\n    <app-feature-fragment [settings]=\"settings\"></app-feature-fragment>\r\n    <div class=\"footer flexcontainer\">\r\n      <div class=\"flexbox\"></div>\r\n      <button mat-button (click)=\"onContinue()\">\r\n        Continue\r\n      </button>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/pages/intro/pages/intro/intro.component.scss":
/*!**************************************************************!*\
  !*** ./src/app/pages/intro/pages/intro/intro.component.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".flexcontainer {\n  display: flex; }\n\n.flexbox {\n  flex-grow: 1; }\n\n/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n\n/* Theme for the ripple elements.*/\n\n/* stylelint-disable material/no-prefixes */\n\n/* stylelint-enable */\n\n/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n\n/* Theme for the ripple elements.*/\n\n/* stylelint-disable material/no-prefixes */\n\n/* stylelint-enable */\n\n.main {\n  height: 100%; }\n\n@media screen and (max-width: 960px) {\n  .content {\n    margin: 10px auto;\n    padding: 10px;\n    width: 100%;\n    /* Safari/Chrome, other WebKit */\n    /* Firefox, other Gecko */\n    box-sizing: border-box;\n    /* Opera/IE 8+ */ } }\n\n@media screen and (min-width: 960px) and (max-width: 1280px) {\n  .content {\n    padding: 20px;\n    margin: 50px auto;\n    width: 450px; } }\n\n@media screen and (min-width: 1280px) {\n  .content {\n    margin: 65px auto;\n    width: 450px; } }\n\n@media screen and (max-width: 960px) {\n  .header {\n    margin-bottom: 10px; } }\n\n@media screen and (min-width: 960px) and (max-width: 1280px) {\n  .header {\n    margin-bottom: 20px; } }\n\n@media screen and (min-width: 1280px) {\n  .header {\n    margin-bottom: 65px; } }\n\n.title {\n  font-family: 'Roboto Slab', serif;\n  font-weight: 700;\n  font-size: 1.8em; }\n\n@media screen and (max-width: 960px) {\n  .footer {\n    margin-top: 10px; } }\n\n@media screen and (min-width: 960px) and (max-width: 1280px) {\n  .footer {\n    margin-top: 20px; } }\n\n@media screen and (min-width: 1280px) {\n  .footer {\n    margin-top: 65px; } }\n"

/***/ }),

/***/ "./src/app/pages/intro/pages/intro/intro.component.ts":
/*!************************************************************!*\
  !*** ./src/app/pages/intro/pages/intro/intro.component.ts ***!
  \************************************************************/
/*! exports provided: IntroComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntroComponent", function() { return IntroComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core_settings_model_setting_type_enum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/settings/model/setting-type.enum */ "./src/app/core/settings/model/setting-type.enum.ts");
/* harmony import */ var _core_settings_model_setting_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../core/settings/model/setting.model */ "./src/app/core/settings/model/setting.model.ts");
/* harmony import */ var _core_settings_services_settings_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../core/settings/services/settings.service */ "./src/app/core/settings/services/settings.service.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _ui_new_features_dialog_new_features_dialog_new_features_dialog_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../ui/new-features-dialog/new-features-dialog/new-features-dialog.component */ "./src/app/ui/new-features-dialog/new-features-dialog/new-features-dialog.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _core_ui_model_media_enum__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../core/ui/model/media.enum */ "./src/app/core/ui/model/media.enum.ts");
/* harmony import */ var _core_ui_services_media_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../core/ui/services/media.service */ "./src/app/core/ui/services/media.service.ts");
/* harmony import */ var _core_ui_services_material_color_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../core/ui/services/material-color.service */ "./src/app/core/ui/services/material-color.service.ts");
/* harmony import */ var _core_ui_services_material_icon_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../core/ui/services/material-icon.service */ "./src/app/core/ui/services/material-icon.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _core_settings_services_feature_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../core/settings/services/feature.service */ "./src/app/core/settings/services/feature.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
















/**
 * Displays an intro page
 */
var IntroComponent = /** @class */ (function () {
    /**
     * Constructor
     * @param featureService feature service
     * @param mediaService media service
     * @param materialColorService material color service
     * @param materialIconService material icon service
     * @param settingsService settings service
     * @param router router
     * @param dialog dialog
     * @param iconRegistry icon registry
     * @param sanitizer dom sanitizer
     */
    function IntroComponent(featureService, mediaService, materialColorService, materialIconService, settingsService, router, dialog, iconRegistry, sanitizer) {
        this.featureService = featureService;
        this.mediaService = mediaService;
        this.materialColorService = materialColorService;
        this.materialIconService = materialIconService;
        this.settingsService = settingsService;
        this.router = router;
        this.dialog = dialog;
        this.iconRegistry = iconRegistry;
        this.sanitizer = sanitizer;
        /** Title to be displayed */
        this.title = 'How do you work?';
        /** Description to be displayed */
        this.description = 'Select the aspects you want to use (you can change this later)';
        /** Helper subject used to finish other subscriptions */
        this.unsubscribeSubject = new rxjs__WEBPACK_IMPORTED_MODULE_12__["Subject"]();
        /** Enum of media types */
        this.mediaType = _core_ui_model_media_enum__WEBPACK_IMPORTED_MODULE_8__["Media"];
        /** Current media */
        this.media = _core_ui_model_media_enum__WEBPACK_IMPORTED_MODULE_8__["Media"].UNDEFINED;
        /** Map of current settings */
        this.settings = new Map();
    }
    //
    // Initialization
    //
    /**
     * Handles on-init lifecycle phase
     */
    IntroComponent.prototype.ngOnInit = function () {
        this.initializeSettings();
        this.initializeSemaphore();
        this.initializeMaterial();
        this.initializeMediaSubscription();
    };
    /**
     * Handles on-destroy lifecycle phase
     */
    IntroComponent.prototype.ngOnDestroy = function () {
        this.unsubscribeSubject.next();
        this.unsubscribeSubject.complete();
    };
    //
    // Initialization
    //
    /**
     * Initializes an unset settingType
     * @param settings settingType
     * @param value value
     */
    IntroComponent.prototype.initializeSetting = function (settings, value) {
        if (this.settingsService.settings.get(settings) == null) {
            var setting = new _core_settings_model_setting_model__WEBPACK_IMPORTED_MODULE_2__["Setting"](settings, value);
            this.settingsService.updateSetting(setting);
        }
    };
    /**
     * Initializes semaphore
     */
    IntroComponent.prototype.initializeSemaphore = function () {
        // Activate semaphore
        this.settingsService.updateSetting(new _core_settings_model_setting_model__WEBPACK_IMPORTED_MODULE_2__["Setting"](_core_settings_model_setting_type_enum__WEBPACK_IMPORTED_MODULE_1__["SettingType"].SEMAPHORE_FEATURE, true));
    };
    /**
     * Initializes settings
     */
    IntroComponent.prototype.initializeSettings = function () {
        var _this = this;
        this.settingsService.fetch();
        this.settingsService.settingsSubject.subscribe(function (value) {
            if (value != null) {
                _this.settings = new Map(value);
                // Initialize version setting
                if (_this.settings.get(_core_settings_model_setting_type_enum__WEBPACK_IMPORTED_MODULE_1__["SettingType"].VERSION) != null) {
                    _this.showNewFeatures(_this.settings.get(_core_settings_model_setting_type_enum__WEBPACK_IMPORTED_MODULE_1__["SettingType"].VERSION).value);
                }
            }
        });
    };
    /**
     * Handles display of new features dialog
     * @param {string} currentVersion
     */
    IntroComponent.prototype.showNewFeatures = function (currentVersion) {
        var _this = this;
        // Current version
        var currentMajor = Number.parseInt(_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].VERSION.split('.')[0]);
        var currentMinor = Number.parseInt(_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].VERSION.split('.')[1]);
        var currentPatch = Number.parseInt(_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].VERSION.split('.')[2]);
        // Latest version
        var latestMajor = Number.parseInt(currentVersion.split('.')[0]);
        var latestMinor = Number.parseInt(currentVersion.split('.')[1]);
        var latestPatch = Number.parseInt(currentVersion.split('.')[2]);
        if ((currentMajor > latestMajor)
            || (currentMajor === latestMajor && currentMinor > latestMinor)
            || (currentMajor === latestMajor && currentMinor === latestMinor && currentPatch > latestPatch)) {
            var dialogRef = this.dialog.open(_ui_new_features_dialog_new_features_dialog_new_features_dialog_component__WEBPACK_IMPORTED_MODULE_5__["NewFeaturesDialogComponent"], {
                disableClose: false,
                data: {
                    dialogTitle: 'New features',
                    gitTags: _environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].TAGS.filter(function (gt) {
                        gt.annotation = gt.annotation.replace(/.*v/g, '');
                        // Tag version
                        var tagMajor = Number.parseInt(gt.annotation.split('.')[0]);
                        var tagMinor = Number.parseInt(gt.annotation.split('.')[1]);
                        var tagPatch = Number.parseInt(gt.annotation.split('.')[2]);
                        var relevant = ((tagMajor > latestMajor)
                            || (tagMajor === latestMajor && tagMinor > latestMinor)
                            || (tagMajor === latestMajor && tagMinor === latestMinor && tagPatch > latestPatch));
                        console.log("tag version " + gt.annotation + ", relevant: " + relevant);
                        return relevant;
                    })
                }
            });
            dialogRef.afterClosed().subscribe(function () {
                // Save latest version
                _this.settingsService.updateSetting(new _core_settings_model_setting_model__WEBPACK_IMPORTED_MODULE_2__["Setting"](_core_settings_model_setting_type_enum__WEBPACK_IMPORTED_MODULE_1__["SettingType"].VERSION, _environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].VERSION));
            });
        }
    };
    /**
     * Initializes material colors and icons
     */
    IntroComponent.prototype.initializeMaterial = function () {
        this.materialColorService.initializeColors();
        this.materialIconService.initializeIcons(this.iconRegistry, this.sanitizer);
    };
    /**
     * Initializes media subscription
     */
    IntroComponent.prototype.initializeMediaSubscription = function () {
        var _this = this;
        this.media = this.mediaService.media;
        this.mediaService.mediaSubject.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.unsubscribeSubject)).subscribe(function (value) {
            _this.media = value;
        });
    };
    //
    // Actions
    //
    /**
     * Handles click on continue button
     */
    IntroComponent.prototype.onContinue = function () {
        // Set default values
        this.initializeSetting(_core_settings_model_setting_type_enum__WEBPACK_IMPORTED_MODULE_1__["SettingType"].DEVELOPMENT, false);
        this.initializeSetting(_core_settings_model_setting_type_enum__WEBPACK_IMPORTED_MODULE_1__["SettingType"].SCRUM, false);
        this.initializeSetting(_core_settings_model_setting_type_enum__WEBPACK_IMPORTED_MODULE_1__["SettingType"].POMODORO, false);
        this.initializeSetting(_core_settings_model_setting_type_enum__WEBPACK_IMPORTED_MODULE_1__["SettingType"].POMODORO_DURATION, 5);
        this.initializeSetting(_core_settings_model_setting_type_enum__WEBPACK_IMPORTED_MODULE_1__["SettingType"].POMODORO_BREAK, 5);
        // Deactivate semaphore
        this.settingsService.updateSetting(new _core_settings_model_setting_model__WEBPACK_IMPORTED_MODULE_2__["Setting"](_core_settings_model_setting_type_enum__WEBPACK_IMPORTED_MODULE_1__["SettingType"].SEMAPHORE_FEATURE, false));
        this.router.navigate(["/timeline"]).then(function () {
        });
    };
    IntroComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-intro',
            template: __webpack_require__(/*! ./intro.component.html */ "./src/app/pages/intro/pages/intro/intro.component.html"),
            styles: [__webpack_require__(/*! ./intro.component.scss */ "./src/app/pages/intro/pages/intro/intro.component.scss")]
        }),
        __metadata("design:paramtypes", [_core_settings_services_feature_service__WEBPACK_IMPORTED_MODULE_15__["FeatureService"],
            _core_ui_services_media_service__WEBPACK_IMPORTED_MODULE_9__["MediaService"],
            _core_ui_services_material_color_service__WEBPACK_IMPORTED_MODULE_10__["MaterialColorService"],
            _core_ui_services_material_icon_service__WEBPACK_IMPORTED_MODULE_11__["MaterialIconService"],
            _core_settings_services_settings_service__WEBPACK_IMPORTED_MODULE_3__["SettingsService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_14__["Router"],
            _angular_material__WEBPACK_IMPORTED_MODULE_6__["MatDialog"],
            _angular_material__WEBPACK_IMPORTED_MODULE_6__["MatIconRegistry"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_13__["DomSanitizer"]])
    ], IntroComponent);
    return IntroComponent;
}());



/***/ })

}]);
//# sourceMappingURL=pages-intro-intro-module.js.map