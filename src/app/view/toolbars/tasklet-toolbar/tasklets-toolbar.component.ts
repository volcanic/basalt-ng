import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';
import {TaskletsService} from '../../../services/tasklets.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-tasklets-toolbar',
  templateUrl: './tasklets-toolbar.component.html',
  styles: [require('./tasklets-toolbar.component.scss')]
})
export class TaskletsToolbarComponent  implements OnInit {
  @Input() title;
  @Output() onSearchItemChanged = new EventEmitter<string>();
  @Output() onMenuItemClicked = new EventEmitter<string>();

  searchItem = '';
  searchOptions = [];
  filteredSearchOptions: Observable<string[]>;

  debouncer = new Subject();

  formControl: FormControl = new FormControl();

  constructor(private taskletsService: TaskletsService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('menu', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_menu_white_24px.svg'));
    iconRegistry.addSvgIcon('label_white', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_label_outline_white_24px.svg'));
    iconRegistry.addSvgIcon('timer_white', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_timer_white_24px.svg'));
  }

  ngOnInit() {
    this.searchItem = this.taskletsService.searchItem;
    this.searchOptions = this.taskletsService.searchItems;

    this.filteredSearchOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterSearchItems(value))
      );

    this.debouncer
      .debounceTime(300)
      .subscribe((value) => this.onSearchItemChanged.emit(value.toString()));
  }

  onClickMenuItem(menuItem: string): void {
    this.onMenuItemClicked.emit(menuItem);
  }

  onClickInput() {
    this.searchOptions = this.taskletsService.searchItems;
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
