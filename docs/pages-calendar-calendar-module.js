(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-calendar-calendar-module"],{

/***/ "./src/app/core/entity/model/quarterhour.model.ts":
/*!********************************************************!*\
  !*** ./src/app/core/entity/model/quarterhour.model.ts ***!
  \********************************************************/
/*! exports provided: QuarterHour */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuarterHour", function() { return QuarterHour; });
/**
 * Represents fifteen minutes display in the calendar
 */
var QuarterHour = /** @class */ (function () {
    /**
     * Constructor
     */
    function QuarterHour() {
    }
    return QuarterHour;
}());



/***/ }),

/***/ "./src/app/pages/calendar/calendar-routing.module.ts":
/*!***********************************************************!*\
  !*** ./src/app/pages/calendar/calendar-routing.module.ts ***!
  \***********************************************************/
/*! exports provided: CalendarRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CalendarRoutingModule", function() { return CalendarRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _pages_calendar_calendar_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/calendar/calendar.component */ "./src/app/pages/calendar/pages/calendar/calendar.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var routes = [
    {
        path: '',
        component: _pages_calendar_calendar_component__WEBPACK_IMPORTED_MODULE_2__["CalendarComponent"],
    }
];
var CalendarRoutingModule = /** @class */ (function () {
    function CalendarRoutingModule() {
    }
    CalendarRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], CalendarRoutingModule);
    return CalendarRoutingModule;
}());



/***/ }),

/***/ "./src/app/pages/calendar/calendar.module.ts":
/*!***************************************************!*\
  !*** ./src/app/pages/calendar/calendar.module.ts ***!
  \***************************************************/
/*! exports provided: CalendarModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CalendarModule", function() { return CalendarModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _pages_calendar_calendar_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/calendar/calendar.component */ "./src/app/pages/calendar/pages/calendar/calendar.component.ts");
/* harmony import */ var _components_calendar_grid_calendar_grid_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/calendar-grid/calendar-grid.component */ "./src/app/pages/calendar/components/calendar-grid/calendar-grid.component.ts");
/* harmony import */ var _components_calendar_grid_day_calendar_grid_day_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/calendar-grid-day/calendar-grid-day.component */ "./src/app/pages/calendar/components/calendar-grid-day/calendar-grid-day.component.ts");
/* harmony import */ var _components_calendar_grid_quarter_hour_calendar_grid_quarter_hour_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/calendar-grid-quarter-hour/calendar-grid-quarter-hour.component */ "./src/app/pages/calendar/components/calendar-grid-quarter-hour/calendar-grid-quarter-hour.component.ts");
/* harmony import */ var _components_calendar_item_calendar_item_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/calendar-item/calendar-item.component */ "./src/app/pages/calendar/components/calendar-item/calendar-item.component.ts");
/* harmony import */ var _ui_material_material_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../ui/material/material.module */ "./src/app/ui/material/material.module.ts");
/* harmony import */ var _calendar_routing_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./calendar-routing.module */ "./src/app/pages/calendar/calendar-routing.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var CalendarModule = /** @class */ (function () {
    /**
     * Contains calendar page
     */
    function CalendarModule() {
    }
    CalendarModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _ui_material_material_module__WEBPACK_IMPORTED_MODULE_7__["MaterialModule"],
                _calendar_routing_module__WEBPACK_IMPORTED_MODULE_8__["CalendarRoutingModule"]
            ],
            declarations: [
                _pages_calendar_calendar_component__WEBPACK_IMPORTED_MODULE_2__["CalendarComponent"],
                _components_calendar_grid_calendar_grid_component__WEBPACK_IMPORTED_MODULE_3__["CalendarGridComponent"],
                _components_calendar_grid_day_calendar_grid_day_component__WEBPACK_IMPORTED_MODULE_4__["CalendarGridDayComponent"],
                _components_calendar_grid_quarter_hour_calendar_grid_quarter_hour_component__WEBPACK_IMPORTED_MODULE_5__["CalendarGridQuarterHourComponent"],
                _components_calendar_item_calendar_item_component__WEBPACK_IMPORTED_MODULE_6__["CalendarItemComponent"],
            ], exports: [
                _pages_calendar_calendar_component__WEBPACK_IMPORTED_MODULE_2__["CalendarComponent"]
            ]
        })
        /**
         * Contains calendar page
         */
    ], CalendarModule);
    return CalendarModule;
}());



/***/ }),

/***/ "./src/app/pages/calendar/components/calendar-grid-day/calendar-grid-day.component.html":
/*!**********************************************************************************************!*\
  !*** ./src/app/pages/calendar/components/calendar-grid-day/calendar-grid-day.component.html ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"day-header\">\r\n  <span class=\"weekDay\">{{ weekDay }}</span>\r\n  <h1 class=\"date\">{{ date }}</h1>\r\n</div>\r\n\r\n<div>\r\n  <div class=\"underlay\">\r\n    <app-calendar-grid-quarter-hour *ngFor=\"let qh of quarterHours\" [quarterHour]=\"qh\">\r\n\r\n    </app-calendar-grid-quarter-hour>\r\n  </div>\r\n  <div class=\"overlay\">\r\n    <app-calendar-item *ngFor=\"let tasklet of tasklets\" [tasklet]=\"tasklet\"></app-calendar-item>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/pages/calendar/components/calendar-grid-day/calendar-grid-day.component.scss":
/*!**********************************************************************************************!*\
  !*** ./src/app/pages/calendar/components/calendar-grid-day/calendar-grid-day.component.scss ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n.day-header {\n  border: #e0e0e0 1px solid;\n  color: #009688; }\n.underlay {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: 1; }\n.time-step {\n  height: 20px; }\n.overlay {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: 2; }\n"

/***/ }),

/***/ "./src/app/pages/calendar/components/calendar-grid-day/calendar-grid-day.component.ts":
/*!********************************************************************************************!*\
  !*** ./src/app/pages/calendar/components/calendar-grid-day/calendar-grid-day.component.ts ***!
  \********************************************************************************************/
/*! exports provided: CalendarGridDayComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CalendarGridDayComponent", function() { return CalendarGridDayComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core_entity_model_quarterhour_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/entity/model/quarterhour.model */ "./src/app/core/entity/model/quarterhour.model.ts");
/* harmony import */ var _core_entity_services_date_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../core/entity/services/date.service */ "./src/app/core/entity/services/date.service.ts");
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
 * Displays calendar grid for a day
 */
var CalendarGridDayComponent = /** @class */ (function () {
    function CalendarGridDayComponent() {
        /** Focus day to be displayed */
        this.focusDay = new Date();
        /** Array of tasklet */
        this.tasklets = [];
        /** Weekday */
        this.weekDay = '';
        /** Date */
        this.date = '';
        /** Array of quarterhours */
        this.quarterHours = [];
    }
    //
    // Lifecycle hooks
    //
    /**
     * Handles on-init lifecycle phase
     */
    CalendarGridDayComponent.prototype.ngOnInit = function () {
        this.initializeDate();
    };
    //
    // Initialization
    //
    /**
     * Initializes date
     */
    CalendarGridDayComponent.prototype.initializeDate = function () {
        this.weekDay = _core_entity_services_date_service__WEBPACK_IMPORTED_MODULE_2__["DateService"].getWeekDayString(this.focusDay.getDay());
        this.date = this.focusDay.getDate().toString();
        var dayStart = new Date(this.focusDay).setHours(0, 0, 0, 0);
        var counter = 0;
        while (counter < (24 * 4)) {
            var start = new Date(new Date(dayStart).getTime() + (counter * 15 * 60000));
            var end = new Date(new Date(dayStart).getTime() + ((counter + 1) * 15 * 60000));
            var quaterHour = new _core_entity_model_quarterhour_model__WEBPACK_IMPORTED_MODULE_1__["QuarterHour"]();
            quaterHour.start = start;
            quaterHour.end = end;
            this.quarterHours.push(quaterHour);
            counter++;
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], CalendarGridDayComponent.prototype, "focusDay", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], CalendarGridDayComponent.prototype, "tasklets", void 0);
    CalendarGridDayComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-calendar-grid-day',
            template: __webpack_require__(/*! ./calendar-grid-day.component.html */ "./src/app/pages/calendar/components/calendar-grid-day/calendar-grid-day.component.html"),
            styles: [__webpack_require__(/*! ./calendar-grid-day.component.scss */ "./src/app/pages/calendar/components/calendar-grid-day/calendar-grid-day.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        })
    ], CalendarGridDayComponent);
    return CalendarGridDayComponent;
}());



/***/ }),

/***/ "./src/app/pages/calendar/components/calendar-grid-quarter-hour/calendar-grid-quarter-hour.component.html":
/*!****************************************************************************************************************!*\
  !*** ./src/app/pages/calendar/components/calendar-grid-quarter-hour/calendar-grid-quarter-hour.component.html ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"quarter-hour time-step\">\r\n  <span *ngIf=\"quarterHour.start.getMinutes() === 0\">{{ startTime }}</span>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/pages/calendar/components/calendar-grid-quarter-hour/calendar-grid-quarter-hour.component.scss":
/*!****************************************************************************************************************!*\
  !*** ./src/app/pages/calendar/components/calendar-grid-quarter-hour/calendar-grid-quarter-hour.component.scss ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n.quarter-hour {\n  border: #e0e0e0 1px solid; }\n.time-step {\n  height: 20px; }\n"

/***/ }),

/***/ "./src/app/pages/calendar/components/calendar-grid-quarter-hour/calendar-grid-quarter-hour.component.ts":
/*!**************************************************************************************************************!*\
  !*** ./src/app/pages/calendar/components/calendar-grid-quarter-hour/calendar-grid-quarter-hour.component.ts ***!
  \**************************************************************************************************************/
/*! exports provided: CalendarGridQuarterHourComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CalendarGridQuarterHourComponent", function() { return CalendarGridQuarterHourComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core_entity_services_date_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/entity/services/date.service */ "./src/app/core/entity/services/date.service.ts");
/* harmony import */ var _core_entity_model_quarterhour_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../core/entity/model/quarterhour.model */ "./src/app/core/entity/model/quarterhour.model.ts");
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
 * Displays calendar grid element for a quarter hour
 */
var CalendarGridQuarterHourComponent = /** @class */ (function () {
    function CalendarGridQuarterHourComponent() {
        /** Start time */
        this.startTime = '';
    }
    //
    // Lifecycle hooks
    //
    /**
     * Handles on-init lifecycle phase
     */
    CalendarGridQuarterHourComponent.prototype.ngOnInit = function () {
        this.initializeStartTime();
    };
    //
    // Initialization
    //
    /**
     * Initializes start time
     */
    CalendarGridQuarterHourComponent.prototype.initializeStartTime = function () {
        if (this.quarterHour.start.getMinutes() === 0) {
            this.startTime = _core_entity_services_date_service__WEBPACK_IMPORTED_MODULE_1__["DateService"].getTimeString(this.quarterHour.start);
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _core_entity_model_quarterhour_model__WEBPACK_IMPORTED_MODULE_2__["QuarterHour"])
    ], CalendarGridQuarterHourComponent.prototype, "quarterHour", void 0);
    CalendarGridQuarterHourComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-calendar-grid-quarter-hour',
            template: __webpack_require__(/*! ./calendar-grid-quarter-hour.component.html */ "./src/app/pages/calendar/components/calendar-grid-quarter-hour/calendar-grid-quarter-hour.component.html"),
            styles: [__webpack_require__(/*! ./calendar-grid-quarter-hour.component.scss */ "./src/app/pages/calendar/components/calendar-grid-quarter-hour/calendar-grid-quarter-hour.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        })
    ], CalendarGridQuarterHourComponent);
    return CalendarGridQuarterHourComponent;
}());



/***/ }),

/***/ "./src/app/pages/calendar/components/calendar-grid/calendar-grid.component.html":
/*!**************************************************************************************!*\
  !*** ./src/app/pages/calendar/components/calendar-grid/calendar-grid.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<app-calendar-grid-day [focusDay]=\"focusDay\" [tasklets]=\"filteredTasklets\"></app-calendar-grid-day>\r\n"

/***/ }),

/***/ "./src/app/pages/calendar/components/calendar-grid/calendar-grid.component.scss":
/*!**************************************************************************************!*\
  !*** ./src/app/pages/calendar/components/calendar-grid/calendar-grid.component.scss ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/calendar/components/calendar-grid/calendar-grid.component.ts":
/*!************************************************************************************!*\
  !*** ./src/app/pages/calendar/components/calendar-grid/calendar-grid.component.ts ***!
  \************************************************************************************/
/*! exports provided: CalendarGridComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CalendarGridComponent", function() { return CalendarGridComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core_entity_services_match_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/entity/services/match.service */ "./src/app/core/entity/services/match.service.ts");
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
 * Displays calender grid
 */
var CalendarGridComponent = /** @class */ (function () {
    function CalendarGridComponent() {
        /** Focus day to be displayed */
        this.focusDay = new Date();
        /** Array of tasklets */
        this.tasklets = [];
        /** Tasklets that match focus day */
        this.filteredTasklets = [];
    }
    //
    // Lifecycle hooks
    //
    /**
     * Handles on-changes lifecycle phase
     */
    CalendarGridComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        this.filteredTasklets = this.tasklets.filter(function (tasklet) {
            _core_entity_services_match_service__WEBPACK_IMPORTED_MODULE_1__["MatchService"].taskletMatchesDate(tasklet, new Date(_this.focusDay));
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], CalendarGridComponent.prototype, "focusDay", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], CalendarGridComponent.prototype, "tasklets", void 0);
    CalendarGridComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-calendar-grid',
            template: __webpack_require__(/*! ./calendar-grid.component.html */ "./src/app/pages/calendar/components/calendar-grid/calendar-grid.component.html"),
            styles: [__webpack_require__(/*! ./calendar-grid.component.scss */ "./src/app/pages/calendar/components/calendar-grid/calendar-grid.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        })
    ], CalendarGridComponent);
    return CalendarGridComponent;
}());



/***/ }),

/***/ "./src/app/pages/calendar/components/calendar-item/calendar-item.component.html":
/*!**************************************************************************************!*\
  !*** ./src/app/pages/calendar/components/calendar-item/calendar-item.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\r\n  calendar-item works!\r\n</p>\r\n"

/***/ }),

/***/ "./src/app/pages/calendar/components/calendar-item/calendar-item.component.scss":
/*!**************************************************************************************!*\
  !*** ./src/app/pages/calendar/components/calendar-item/calendar-item.component.scss ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/calendar/components/calendar-item/calendar-item.component.ts":
/*!************************************************************************************!*\
  !*** ./src/app/pages/calendar/components/calendar-item/calendar-item.component.ts ***!
  \************************************************************************************/
/*! exports provided: CalendarItemComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CalendarItemComponent", function() { return CalendarItemComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core_entity_model_tasklet_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/entity/model/tasklet.model */ "./src/app/core/entity/model/tasklet.model.ts");
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
 * Displays calendar item
 */
var CalendarItemComponent = /** @class */ (function () {
    function CalendarItemComponent() {
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _core_entity_model_tasklet_model__WEBPACK_IMPORTED_MODULE_1__["Tasklet"])
    ], CalendarItemComponent.prototype, "tasklet", void 0);
    CalendarItemComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-calendar-item',
            template: __webpack_require__(/*! ./calendar-item.component.html */ "./src/app/pages/calendar/components/calendar-item/calendar-item.component.html"),
            styles: [__webpack_require__(/*! ./calendar-item.component.scss */ "./src/app/pages/calendar/components/calendar-item/calendar-item.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        })
    ], CalendarItemComponent);
    return CalendarItemComponent;
}());



/***/ }),

/***/ "./src/app/pages/calendar/pages/calendar/calendar.component.html":
/*!***********************************************************************!*\
  !*** ./src/app/pages/calendar/pages/calendar/calendar.component.html ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<app-calendar-grid [focusDay]=\"focusDay\" [tasklets]=\"tasklets\"></app-calendar-grid>\r\n"

/***/ }),

/***/ "./src/app/pages/calendar/pages/calendar/calendar.component.scss":
/*!***********************************************************************!*\
  !*** ./src/app/pages/calendar/pages/calendar/calendar.component.scss ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/calendar/pages/calendar/calendar.component.ts":
/*!*********************************************************************!*\
  !*** ./src/app/pages/calendar/pages/calendar/calendar.component.ts ***!
  \*********************************************************************/
/*! exports provided: CalendarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CalendarComponent", function() { return CalendarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_internal_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/internal/operators */ "./node_modules/rxjs/internal/operators/index.js");
/* harmony import */ var rxjs_internal_operators__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(rxjs_internal_operators__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_entity_services_tasklet_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../core/entity/services/tasklet.service */ "./src/app/core/entity/services/tasklet.service.ts");
/* harmony import */ var _core_entity_services_filter_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../core/entity/services/filter.service */ "./src/app/core/entity/services/filter.service.ts");
/* harmony import */ var _core_entity_services_match_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../core/entity/services/match.service */ "./src/app/core/entity/services/match.service.ts");
/* harmony import */ var rxjs_Subject__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/Subject */ "./node_modules/rxjs-compat/_esm5/Subject.js");
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
 * Displays calendar page
 */
var CalendarComponent = /** @class */ (function () {
    /**
     * Constructor
     * @param {TaskletService} taskletService tasklet service
     * @param {MatchService} matchService match service
     * @param {FilterService} filterService filter service
     */
    function CalendarComponent(taskletService, matchService, filterService) {
        this.taskletService = taskletService;
        this.matchService = matchService;
        this.filterService = filterService;
        /** Array of tasklets */
        this.tasklets = [];
        /** Focus day to be displayed */
        this.focusDay = new Date();
        /** Helper subject used to finish other subscriptions */
        this.unsubscribeSubject = new rxjs_Subject__WEBPACK_IMPORTED_MODULE_5__["Subject"]();
    }
    //
    // Lifecycle hooks
    //
    /**
     * Handles on-init lifecycle phase
     */
    CalendarComponent.prototype.ngOnInit = function () {
        this.initializeTaskletSubscription();
    };
    /**
     * Handles on-destroy lifecycle phase
     */
    CalendarComponent.prototype.ngOnDestroy = function () {
        this.unsubscribeSubject.next();
        this.unsubscribeSubject.complete();
    };
    //
    // Initialization
    //
    /**
     * Initializes tasklet subscription
     */
    CalendarComponent.prototype.initializeTaskletSubscription = function () {
        var _this = this;
        this.tasklets = Array.from(this.taskletService.tasklets.values());
        this.taskletService.taskletsSubject.pipe(Object(rxjs_internal_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.unsubscribeSubject)).subscribe(function (value) {
            if (value != null) {
                _this.tasklets = value.filter(function (tasklet) {
                    var matchesSearchItem = _this.matchService.taskletMatchesEveryItem(tasklet, _this.filterService.searchItem);
                    var matchesProjects = _this.matchService.taskletMatchesProjects(tasklet, Array.from(_this.filterService.projects.values()), _this.filterService.projectsNone);
                    return matchesSearchItem && matchesProjects;
                });
            }
        });
    };
    CalendarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-calendar',
            template: __webpack_require__(/*! ./calendar.component.html */ "./src/app/pages/calendar/pages/calendar/calendar.component.html"),
            styles: [__webpack_require__(/*! ./calendar.component.scss */ "./src/app/pages/calendar/pages/calendar/calendar.component.scss")]
        }),
        __metadata("design:paramtypes", [_core_entity_services_tasklet_service__WEBPACK_IMPORTED_MODULE_2__["TaskletService"],
            _core_entity_services_match_service__WEBPACK_IMPORTED_MODULE_4__["MatchService"],
            _core_entity_services_filter_service__WEBPACK_IMPORTED_MODULE_3__["FilterService"]])
    ], CalendarComponent);
    return CalendarComponent;
}());



/***/ })

}]);
//# sourceMappingURL=pages-calendar-calendar-module.js.map