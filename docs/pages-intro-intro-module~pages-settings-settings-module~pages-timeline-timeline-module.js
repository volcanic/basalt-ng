(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-intro-intro-module~pages-settings-settings-module~pages-timeline-timeline-module"],{

/***/ "./src/app/core/settings/model/setting.model.ts":
/*!******************************************************!*\
  !*** ./src/app/core/settings/model/setting.model.ts ***!
  \******************************************************/
/*! exports provided: Setting */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Setting", function() { return Setting; });
/**
 * Represents a key-value pair of a persisted setting
 */
var Setting = /** @class */ (function () {
    /**
     * Constructor
     * @param {string} id key of the setting
     * @param {any} value value of the setting
     */
    function Setting(id, value) {
        /** Key */
        this.id = '';
        this.id = id;
        this.value = value;
    }
    return Setting;
}());



/***/ }),

/***/ "./src/app/core/ui/services/material-icon.service.ts":
/*!***********************************************************!*\
  !*** ./src/app/core/ui/services/material-icon.service.ts ***!
  \***********************************************************/
/*! exports provided: MaterialIconService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaterialIconService", function() { return MaterialIconService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/**
 * Represents icon topic subdirectory
 */
var IconTopic;
(function (IconTopic) {
    IconTopic["ACTION"] = "action";
    IconTopic["ALERT"] = "alert";
    IconTopic["AV"] = "av";
    IconTopic["CONTENT"] = "content";
    IconTopic["COMMUNICATION"] = "communication";
    IconTopic["DEVICE"] = "device";
    IconTopic["EDITOR"] = "editor";
    IconTopic["FILE"] = "file";
    IconTopic["HARDWARE"] = "hardware";
    IconTopic["IMAGE"] = "image";
    IconTopic["MAPS"] = "maps";
    IconTopic["NAVIGATION"] = "navigation";
    IconTopic["SOCIAL"] = "social";
})(IconTopic || (IconTopic = {}));
/**
 * Represents a material design icon
 */
var Icon = /** @class */ (function () {
    /**
     * Constructor
     * @param {IconTopic} topic
     * @param {string} name
     * @param {string} file
     */
    function Icon(topic, name, file) {
        this.topic = topic;
        this.name = name;
        this.file = file;
    }
    return Icon;
}());
/**
 * Handles Material icons
 */
var MaterialIconService = /** @class */ (function () {
    function MaterialIconService() {
        /** Root directory of material design icons */
        this.ICON_ROOT_DIR = './assets/material-design-icons';
        /** Icon variant */
        this.VARIANT = 'production';
    }
    /**
     * Initializes icons
     *
     * @param iconRegistry icon registry
     * @param sanitizer sanitizer
     */
    MaterialIconService.prototype.initializeIcons = function (iconRegistry, sanitizer) {
        var _this = this;
        var icons = [];
        icons.push(new Icon(IconTopic.ACTION, 'agenda', 'ic_view_agenda_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'android', 'ic_android_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'bug_report', 'ic_bug_report_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'check_circle', 'ic_check_circle_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'code', 'ic_code_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'gavel', 'ic_gavel_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'info', 'ic_info_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'help_outline', 'ic_help_outline_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'label_outline', 'ic_label_outline_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'lightbulb_outline', 'ic_lightbulb_outline_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'receipt', 'ic_receipt_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'search', 'ic_search_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'settings', 'ic_settings_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'today', 'ic_today_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'turned_in', 'ic_turned_in_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'turned_in_not', 'ic_turned_in_not_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'work', 'ic_work_24px.svg'));
        icons.push(new Icon(IconTopic.ALERT, 'warning', 'ic_warning_24px.svg'));
        icons.push(new Icon(IconTopic.AV, 'loop', 'ic_loop_24px.svg'));
        icons.push(new Icon(IconTopic.AV, 'play_circle_filled', 'ic_play_circle_filled_24px.svg'));
        icons.push(new Icon(IconTopic.AV, 'replay', 'ic_replay_24px.svg'));
        icons.push(new Icon(IconTopic.COMMUNICATION, 'business', 'ic_business_24px.svg'));
        icons.push(new Icon(IconTopic.COMMUNICATION, 'call', 'ic_call_24px.svg'));
        icons.push(new Icon(IconTopic.COMMUNICATION, 'chat', 'ic_chat_24px.svg'));
        icons.push(new Icon(IconTopic.COMMUNICATION, 'comment', 'ic_comment_24px.svg'));
        icons.push(new Icon(IconTopic.COMMUNICATION, 'email', 'ic_email_24px.svg'));
        icons.push(new Icon(IconTopic.COMMUNICATION, 'forum', 'ic_forum_24px.svg'));
        icons.push(new Icon(IconTopic.COMMUNICATION, 'phone', 'ic_phone_24px.svg'));
        icons.push(new Icon(IconTopic.CONTENT, 'add', 'ic_add_24px.svg'));
        icons.push(new Icon(IconTopic.CONTENT, 'filter_list', 'ic_filter_list_24px.svg'));
        icons.push(new Icon(IconTopic.CONTENT, 'flag', 'ic_flag_24px.svg'));
        icons.push(new Icon(IconTopic.CONTENT, 'mail', 'ic_mail_24px.svg'));
        icons.push(new Icon(IconTopic.CONTENT, 'people_18', 'ic_people_18px.svg'));
        icons.push(new Icon(IconTopic.CONTENT, 'reply', 'ic_reply_24px.svg'));
        icons.push(new Icon(IconTopic.DEVICE, 'brightness_low', 'ic_brightness_low_24px.svg'));
        icons.push(new Icon(IconTopic.EDITOR, 'delete', 'ic_delete_24px.svg'));
        icons.push(new Icon(IconTopic.EDITOR, 'mode_edit', 'ic_mode_edit_24px.svg'));
        icons.push(new Icon(IconTopic.EDITOR, 'mode_edit_18', 'ic_mode_edit_18px.svg'));
        icons.push(new Icon(IconTopic.EDITOR, 'short_text', 'ic_short_text_24px.svg'));
        icons.push(new Icon(IconTopic.FILE, 'file_download', 'ic_file_download_24px.svg'));
        icons.push(new Icon(IconTopic.FILE, 'file_upload', 'ic_file_upload_24px.svg'));
        icons.push(new Icon(IconTopic.HARDWARE, 'keyboard_arrow_up', 'ic_keyboard_arrow_up_24px.svg'));
        icons.push(new Icon(IconTopic.IMAGE, 'timer', 'ic_timer_24px.svg'));
        icons.push(new Icon(IconTopic.IMAGE, 'brightness_3', 'ic_brightness_3_24px.svg'));
        icons.push(new Icon(IconTopic.IMAGE, 'nature', 'ic_nature_24px.svg'));
        icons.push(new Icon(IconTopic.MAPS, 'directions_bike', 'ic_directions_bike_24px.svg'));
        icons.push(new Icon(IconTopic.MAPS, 'directions_run', 'ic_directions_run_24px.svg'));
        icons.push(new Icon(IconTopic.MAPS, 'flight', 'ic_flight_24px.svg'));
        icons.push(new Icon(IconTopic.MAPS, 'layers_clear', 'ic_layers_clear_24px.svg'));
        icons.push(new Icon(IconTopic.MAPS, 'local_cafe', 'ic_local_cafe_24px.svg'));
        icons.push(new Icon(IconTopic.MAPS, 'local_dining', 'ic_local_dining_24px.svg'));
        icons.push(new Icon(IconTopic.MAPS, 'train', 'ic_train_24px.svg'));
        icons.push(new Icon(IconTopic.NAVIGATION, 'arrow_back', 'ic_arrow_back_24px.svg'));
        icons.push(new Icon(IconTopic.NAVIGATION, 'check', 'ic_check_24px.svg'));
        icons.push(new Icon(IconTopic.NAVIGATION, 'chevron_right', 'ic_chevron_right_24px.svg'));
        icons.push(new Icon(IconTopic.NAVIGATION, 'close_18', 'ic_close_18px.svg'));
        icons.push(new Icon(IconTopic.NAVIGATION, 'expand_more', 'ic_expand_more_24px.svg'));
        icons.push(new Icon(IconTopic.NAVIGATION, 'menu', 'ic_menu_24px.svg'));
        icons.push(new Icon(IconTopic.NAVIGATION, 'more_horiz_36', 'ic_more_horiz_36px.svg'));
        icons.push(new Icon(IconTopic.NAVIGATION, 'more_vert', 'ic_more_vert_24px.svg'));
        icons.push(new Icon(IconTopic.NAVIGATION, 'refresh', 'ic_refresh_24px.svg'));
        icons.push(new Icon(IconTopic.SOCIAL, 'person', 'ic_person_24px.svg'));
        icons.push(new Icon(IconTopic.SOCIAL, 'people', 'ic_people_24px.svg'));
        // Aliases
        icons.push(new Icon(IconTopic.ACTION, 'alias_task', 'ic_turned_in_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'alias_task_unassigned', 'ic_turned_in_not_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'alias_project', 'ic_view_agenda_24px.svg'));
        icons.push(new Icon(IconTopic.ACTION, 'alias_tag', 'ic_label_outline_24px.svg'));
        icons.push(new Icon(IconTopic.SOCIAL, 'alias_person', 'ic_person_24px.svg'));
        icons.forEach(function (icon) {
            iconRegistry.addSvgIcon(icon.name, sanitizer.bypassSecurityTrustResourceUrl(_this.ICON_ROOT_DIR + '/' + icon.topic + '/svg/' + _this.VARIANT + '/' + icon.file));
        });
        iconRegistry.addSvgIcon('blank', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_blank_24px.svg'));
        iconRegistry.addSvgIcon('scrum', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_scrum_black_24px.svg'));
        iconRegistry.addSvgIcon('code_braces', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_code_braces_24px.svg'));
        iconRegistry.addSvgIcon('outlined_flag', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-outlined_flag_24px.svg'));
        iconRegistry.addSvgIcon('test_tube', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_test_tube_24px.svg'));
        iconRegistry.addSvgIcon('code_tags_check', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_code_tags_check_24px.svg'));
        iconRegistry.addSvgIcon('file_document_outline', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_file_document_outline_24px.svg'));
        iconRegistry.addSvgIcon('clock_end', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_clock_end_24px.svg'));
        iconRegistry.addSvgIcon('clock_start', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_clock_start_24px.svg'));
        iconRegistry.addSvgIcon('help', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_help_24px.svg'));
        iconRegistry.addSvgIcon('circle_slice_1', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_circle_slice_1_24px.svg'));
        iconRegistry.addSvgIcon('circle_slice_3', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_circle_slice_3_24px.svg'));
        iconRegistry.addSvgIcon('text', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_text_24px.svg'));
        iconRegistry.addSvgIcon('markdown', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_markdown_24px.svg'));
        iconRegistry.addSvgIcon('hexagon_multiple', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_hexagon_multiple_24px.svg'));
    };
    MaterialIconService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        })
    ], MaterialIconService);
    return MaterialIconService;
}());



/***/ })

}]);
//# sourceMappingURL=pages-intro-intro-module~pages-settings-settings-module~pages-timeline-timeline-module.js.map