import {Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';

/**
 * Represents a material design icon
 */
class Icon {
  /** Topic */
  topic: string;
  /** Name */
  name: string;
  /** File */
  file: string;

  /**
   * Constructor
   * @param {string} topic
   * @param {string} name
   * @param {string} file
   */
  constructor(topic: string, name: string, file: string) {
    this.topic = topic;
    this.name = name;
    this.file = file;
  }
}

/**
 * Handles Material icons
 */
@Injectable({
  providedIn: 'root'
})
export class MaterialIconService {

  /** Root directory of material design icons */
  private ICON_ROOT_DIR = '../assets/material-design-icons';
  /** Icon variant */
  private VARIANT = 'production';

  private ACTION = 'action';
  private ALERT = 'alert';
  private AV = 'av';
  private CONTENT = 'content';
  private COMMUNICATION = 'communication';
  private DEVICE = 'device';
  private EDITOR = 'editor';
  private FILE = 'file';
  private IMAGE = 'image';
  private MAPS = 'maps';
  private NAVIGATION = 'navigation';
  private SOCIAL = 'social';

  /**
   * Initializes icons
   */
  public initializeIcons(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    const icons: Icon[] = [];
    icons.push(new Icon(this.ACTION, 'agenda', 'ic_view_agenda_24px.svg'));
    icons.push(new Icon(this.ACTION, 'android', 'ic_android_24px.svg'));
    icons.push(new Icon(this.ACTION, 'bug_report', 'ic_bug_report_24px.svg'));
    icons.push(new Icon(this.ACTION, 'check_circle', 'ic_check_circle_24px.svg'));
    icons.push(new Icon(this.ACTION, 'code', 'ic_code_24px.svg'));
    icons.push(new Icon(this.ACTION, 'gavel', 'ic_gavel_24px.svg'));
    icons.push(new Icon(this.ACTION, 'info', 'ic_info_24px.svg'));
    icons.push(new Icon(this.ACTION, 'label_outline', 'ic_label_outline_24px.svg'));
    icons.push(new Icon(this.ACTION, 'lightbulb_outline', 'ic_lightbulb_outline_24px.svg'));
    icons.push(new Icon(this.ACTION, 'receipt', 'ic_receipt_24px.svg'));
    icons.push(new Icon(this.ACTION, 'search', 'ic_search_24px.svg'));
    icons.push(new Icon(this.ACTION, 'today', 'ic_today_24px.svg'));
    icons.push(new Icon(this.ACTION, 'turned_in', 'ic_turned_in_24px.svg'));
    icons.push(new Icon(this.ACTION, 'turned_in_not', 'ic_turned_in_not_24px.svg'));
    icons.push(new Icon(this.ACTION, 'work', 'ic_work_24px.svg'));
    icons.push(new Icon(this.ALERT, 'warning', 'ic_warning_24px.svg'));
    icons.push(new Icon(this.AV, 'loop', 'ic_loop_24px.svg'));
    icons.push(new Icon(this.AV, 'play_circle_filled', 'ic_play_circle_filled_24px.svg'));
    icons.push(new Icon(this.AV, 'replay', 'ic_replay_24px.svg'));
    icons.push(new Icon(this.COMMUNICATION, 'business', 'ic_business_24px.svg'));
    icons.push(new Icon(this.COMMUNICATION, 'call', 'ic_call_24px.svg'));
    icons.push(new Icon(this.COMMUNICATION, 'chat', 'ic_chat_24px.svg'));
    icons.push(new Icon(this.COMMUNICATION, 'email', 'ic_email_24px.svg'));
    icons.push(new Icon(this.COMMUNICATION, 'phone', 'ic_phone_24px.svg'));
    icons.push(new Icon(this.CONTENT, 'add', 'ic_add_24px.svg'));
    icons.push(new Icon(this.CONTENT, 'flag', 'ic_flag_24px.svg'));
    icons.push(new Icon(this.CONTENT, 'filter_list', 'ic_filter_list_24px.svg'));
    icons.push(new Icon(this.CONTENT, 'mail', 'ic_mail_24px.svg'));
    icons.push(new Icon(this.CONTENT, 'people_18', 'ic_people_18px.svg'));
    icons.push(new Icon(this.CONTENT, 'reply', 'ic_reply_24px.svg'));
    icons.push(new Icon(this.DEVICE, 'brightness_low', 'ic_brightness_low_24px.svg'));
    icons.push(new Icon(this.EDITOR, 'delete', 'ic_delete_24px.svg'));
    icons.push(new Icon(this.EDITOR, 'mode_edit', 'ic_mode_edit_24px.svg'));
    icons.push(new Icon(this.EDITOR, 'mode_edit_18', 'ic_mode_edit_18px.svg'));
    icons.push(new Icon(this.EDITOR, 'short_text', 'ic_short_text_24px.svg'));
    icons.push(new Icon(this.FILE, 'file_download', 'ic_file_download_24px.svg'));
    icons.push(new Icon(this.FILE, 'file_upload', 'ic_file_upload_24px.svg'));
    icons.push(new Icon(this.IMAGE, 'timer', 'ic_timer_24px.svg'));
    icons.push(new Icon(this.IMAGE, 'brightness_3', 'ic_brightness_3_24px.svg'));
    icons.push(new Icon(this.IMAGE, 'nature', 'ic_nature_24px.svg'));
    icons.push(new Icon(this.MAPS, 'directions_run', 'ic_directions_run_24px.svg'));
    icons.push(new Icon(this.MAPS, 'local_dining', 'ic_local_dining_24px.svg'));
    icons.push(new Icon(this.MAPS, 'layers_clear', 'ic_layers_clear_24px.svg'));
    icons.push(new Icon(this.NAVIGATION, 'check', 'ic_check_24px.svg'));
    icons.push(new Icon(this.NAVIGATION, 'chevron_right', 'ic_chevron_right_24px.svg'));
    icons.push(new Icon(this.NAVIGATION, 'close_18', 'ic_close_18px.svg'));
    icons.push(new Icon(this.NAVIGATION, 'expand_more', 'ic_expand_more_24px.svg'));
    icons.push(new Icon(this.NAVIGATION, 'menu', 'ic_menu_24px.svg'));
    icons.push(new Icon(this.NAVIGATION, 'more_vert', 'ic_more_vert_24px.svg'));
    icons.push(new Icon(this.NAVIGATION, 'refresh', 'ic_refresh_24px.svg'));
    icons.push(new Icon(this.SOCIAL, 'person', 'ic_person_24px.svg'));
    icons.push(new Icon(this.SOCIAL, 'people', 'ic_people_24px.svg'));

    icons.forEach(icon => {
      iconRegistry.addSvgIcon(icon.name,
        sanitizer.bypassSecurityTrustResourceUrl(this.ICON_ROOT_DIR + '/' + icon.topic + '/svg/' + this.VARIANT + '/' + icon.file));
    });

    iconRegistry.addSvgIcon('blank', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_blank_24px.svg'));
    iconRegistry.addSvgIcon('scrum',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_scrum_black_24px.svg'));
    iconRegistry.addSvgIcon('outlined_flag',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-outlined_flag-24px.svg'));
  }
}
