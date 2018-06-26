import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {debounceTime} from 'rxjs/internal/operators';

@Component({
  selector: 'app-timeline-toolbar',
  templateUrl: './timeline-toolbar.component.html',
  styles: [require('./timeline-toolbar.component.scss')]
})
export class TimelineToolbarComponent implements OnInit {
  @Input() title;
  @Output() onSearchItemChangedEmitter = new EventEmitter<string>();
  @Output() onMenuItemClickedEmitter = new EventEmitter<string>();

  searchOptions = [];
  filteredSearchOptions: Observable<string[]>;

  debouncer = new Subject();

  formControl: FormControl = new FormControl();

  constructor(private taskletService: TaskletService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('menu', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_menu_white_24px.svg'));
    iconRegistry.addSvgIcon('label_white', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_label_outline_white_24px.svg'));
    iconRegistry.addSvgIcon('agenda_white', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_view_agenda_white_24px.svg'));
    iconRegistry.addSvgIcon('download_white', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_file_download_white_24px.svg'));
    iconRegistry.addSvgIcon('download_black', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_file_download_black_24px.svg'));
    iconRegistry.addSvgIcon('upload_black', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_file_upload_black_24px.svg'));
    iconRegistry.addSvgIcon('timer_white', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_timer_white_24px.svg'));
    iconRegistry.addSvgIcon('more_white', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_more_vert_white_24px.svg'));
    iconRegistry.addSvgIcon('blank', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_blank_24px.svg'));
  }

  ngOnInit() {
    this.searchOptions = this.taskletService.suggestedSearchItems;

    this.filteredSearchOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterSearchItems(value))
      );

    this.debouncer.pipe(
      debounceTime(300)
    ).subscribe((value) => this.onSearchItemChangedEmitter.emit(value.toString()));
  }

  onClickMenuItem(menuItem: string): void {
    this.onMenuItemClickedEmitter.emit(menuItem);
  }

  onClickInput() {
    this.searchOptions = this.taskletService.suggestedSearchItems;
  }

  onChangeSearchItem(searchItem: string): void {
    this.debouncer.next(searchItem);
  }

  filterSearchItems(val: string): string[] {
    return this.searchOptions.filter(option =>
      option.toLowerCase().includes(val.toLowerCase())
    );
  }
}