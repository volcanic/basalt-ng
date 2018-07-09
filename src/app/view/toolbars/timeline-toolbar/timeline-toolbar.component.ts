import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

  constructor(private taskletService: TaskletService) {
  }

  ngOnInit() {
    this.searchOptions = this.taskletService.searchItems;

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
    this.searchOptions = this.taskletService.searchItems.reverse();
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
