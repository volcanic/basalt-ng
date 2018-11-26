(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["common"],{

/***/ "./node_modules/rxjs-compat/_esm5/add/observable/from.js":
/*!***************************************************************!*\
  !*** ./node_modules/rxjs-compat/_esm5/add/observable/from.js ***!
  \***************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");

rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"].from = rxjs__WEBPACK_IMPORTED_MODULE_0__["from"];
//# sourceMappingURL=from.js.map

/***/ }),

/***/ "./src/app/core/entity/model/description.model.ts":
/*!********************************************************!*\
  !*** ./src/app/core/entity/model/description.model.ts ***!
  \********************************************************/
/*! exports provided: Description */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Description", function() { return Description; });
/**
 * Represents a description which is the main part of a tasklet
 */
var Description = /** @class */ (function () {
    /**
     * Constructor
     */
    function Description() {
        this.value = '';
    }
    return Description;
}());



/***/ }),

/***/ "./src/app/core/entity/model/tasklet.model.ts":
/*!****************************************************!*\
  !*** ./src/app/core/entity/model/tasklet.model.ts ***!
  \****************************************************/
/*! exports provided: Tasklet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tasklet", function() { return Tasklet; });
/* harmony import */ var _tasklet_type_enum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tasklet-type.enum */ "./src/app/core/entity/model/tasklet-type.enum.ts");
/* harmony import */ var _entity_type_enum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entity-type.enum */ "./src/app/core/entity/model/entity-type.enum.ts");
/* harmony import */ var _entity_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./entity.model */ "./src/app/core/entity/model/entity.model.ts");
/* harmony import */ var _description_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./description.model */ "./src/app/core/entity/model/description.model.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




/**
 * Represents a tasklet which is a fraction of a task
 */
var Tasklet = /** @class */ (function (_super) {
    __extends(Tasklet, _super);
    /**
     * Constructor
     */
    function Tasklet() {
        var _this = _super.call(this) || this;
        _this.entityType = _entity_type_enum__WEBPACK_IMPORTED_MODULE_1__["EntityType"].TASKLET;
        _this.type = _tasklet_type_enum__WEBPACK_IMPORTED_MODULE_0__["TaskletType"].UNSPECIFIED;
        _this.taskId = '';
        _this.description = new _description_model__WEBPACK_IMPORTED_MODULE_3__["Description"]();
        _this.tagIds = [];
        _this.personIds = [];
        _this.meetingMinuteItems = [];
        _this.dailyScrumItems = [];
        _this.pomodoroTask = new _description_model__WEBPACK_IMPORTED_MODULE_3__["Description"]();
        _this.pomodoroDuration = -1;
        _this.pomodoroBreak = -1;
        return _this;
    }
    return Tasklet;
}(_entity_model__WEBPACK_IMPORTED_MODULE_2__["Entity"]));



/***/ }),

/***/ "./src/app/ui/suggested-action-button/suggested-action-button.module.ts":
/*!******************************************************************************!*\
  !*** ./src/app/ui/suggested-action-button/suggested-action-button.module.ts ***!
  \******************************************************************************/
/*! exports provided: SuggestedActionButtonModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SuggestedActionButtonModule", function() { return SuggestedActionButtonModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _suggested_action_button_suggested_action_button_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./suggested-action-button/suggested-action-button.component */ "./src/app/ui/suggested-action-button/suggested-action-button/suggested-action-button.component.ts");
/* harmony import */ var _material_material_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../material/material.module */ "./src/app/ui/material/material.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var SuggestedActionButtonModule = /** @class */ (function () {
    function SuggestedActionButtonModule() {
    }
    SuggestedActionButtonModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _material_material_module__WEBPACK_IMPORTED_MODULE_3__["MaterialModule"]
            ],
            declarations: [
                _suggested_action_button_suggested_action_button_component__WEBPACK_IMPORTED_MODULE_2__["SuggestedActionButtonComponent"]
            ],
            entryComponents: [
                _suggested_action_button_suggested_action_button_component__WEBPACK_IMPORTED_MODULE_2__["SuggestedActionButtonComponent"]
            ],
            exports: [
                _suggested_action_button_suggested_action_button_component__WEBPACK_IMPORTED_MODULE_2__["SuggestedActionButtonComponent"]
            ]
        })
    ], SuggestedActionButtonModule);
    return SuggestedActionButtonModule;
}());



/***/ }),

/***/ "./src/app/ui/suggested-action-button/suggested-action-button/suggested-action-button.component.html":
/*!***********************************************************************************************************!*\
  !*** ./src/app/ui/suggested-action-button/suggested-action-button/suggested-action-button.component.html ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<button mat-button class=\"container\" [disableRipple]=\"true\" (click)=\"onButtonClicked()\">\r\n  <button mat-fab class=\"fab\"\r\n          [style.backgroundColor]=backgroundColor>\r\n    <mat-icon [svgIcon]=icon [style.fill]=iconColor></mat-icon>\r\n  </button>\r\n  <span *ngIf=\"label != null\" class=\"label\">{{ label }}</span>\r\n</button>\r\n"

/***/ }),

/***/ "./src/app/ui/suggested-action-button/suggested-action-button/suggested-action-button.component.scss":
/*!***********************************************************************************************************!*\
  !*** ./src/app/ui/suggested-action-button/suggested-action-button/suggested-action-button.component.scss ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n.container {\n  padding: 5px 5px;\n  width: 100px;\n  overflow: hidden;\n  text-align: center;\n  text-overflow: ellipsis;\n  white-space: nowrap; }\n.fab {\n  display: block;\n  margin: 0 auto 15px; }\n.label {\n  color: #616161;\n  overflow: hidden;\n  text-align: start;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  width: 100px; }\n"

/***/ }),

/***/ "./src/app/ui/suggested-action-button/suggested-action-button/suggested-action-button.component.ts":
/*!*********************************************************************************************************!*\
  !*** ./src/app/ui/suggested-action-button/suggested-action-button/suggested-action-button.component.ts ***!
  \*********************************************************************************************************/
/*! exports provided: SuggestedActionButtonComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SuggestedActionButtonComponent", function() { return SuggestedActionButtonComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
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
 * Displays round action button
 */
var SuggestedActionButtonComponent = /** @class */ (function () {
    function SuggestedActionButtonComponent() {
        /** Event emitter indicating changes in date */
        this.buttonClickedEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    //
    // Actions
    //
    /**
     * Handles click on button
     */
    SuggestedActionButtonComponent.prototype.onButtonClicked = function () {
        this.buttonClickedEmitter.emit();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], SuggestedActionButtonComponent.prototype, "backgroundColor", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], SuggestedActionButtonComponent.prototype, "iconColor", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], SuggestedActionButtonComponent.prototype, "icon", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], SuggestedActionButtonComponent.prototype, "label", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], SuggestedActionButtonComponent.prototype, "buttonClickedEmitter", void 0);
    SuggestedActionButtonComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-suggested-action-button',
            template: __webpack_require__(/*! ./suggested-action-button.component.html */ "./src/app/ui/suggested-action-button/suggested-action-button/suggested-action-button.component.html"),
            styles: [__webpack_require__(/*! ./suggested-action-button.component.scss */ "./src/app/ui/suggested-action-button/suggested-action-button/suggested-action-button.component.scss")]
        })
    ], SuggestedActionButtonComponent);
    return SuggestedActionButtonComponent;
}());



/***/ })

}]);
//# sourceMappingURL=common.js.map