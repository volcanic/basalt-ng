import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, map, startWith, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {SuggestionService} from '../../../services/suggestion.service';

@Component({
  selector: 'app-timeline-toolbar',
  templateUrl: './timeline-toolbar.component.html',
  styles: [require('./timeline-toolbar.component.scss')]
})
export class TimelineToolbarComponent implements OnInit {
  @Input() title;
  @Output() searchItemChangedEmitter = new EventEmitter<string>();
  @Output() menuItemClickedEmitter = new EventEmitter<string>();

  private searchOptionsUnsubscribeSubject = new Subject();
  debouncer = new Subject();

  searchItem = '';

  searchOptions = [];
  searchOptionsFiltered: Observable<string[]>;
  formControl: FormControl = new FormControl();

  constructor(private suggestionService: SuggestionService) {
  }

  ngOnInit() {
    // Subscribe search option changes
    this.suggestionService.searchOptionsSubject.pipe(
      takeUntil(this.searchOptionsUnsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.searchOptions = (value as string[]).reverse();
        this.formControl.setValue(this.formControl.value);
      }
    });

    this.searchOptions = Array.from(this.suggestionService.searchOptions.values()).reverse();
    this.searchOptionsFiltered = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterSearchItems(value))
      );

    this.debouncer.pipe(
      debounceTime(500)
    ).subscribe((value) => this.searchItemChangedEmitter.emit(value.toString()));
  }

  onClickMenuItem(menuItem: string): void {
    this.menuItemClickedEmitter.emit(menuItem);
  }

  onKeyUp(event: any) {
    this.notifySearchItemChanged();
  }

  onOptionSelected(event: any) {
    this.notifySearchItemChanged();
  }

  onClearButtonClicked() {
    this.searchItem = '';
    this.notifySearchItemChanged();
  }

  filterSearchItems(val: string): string[] {
    return this.searchOptions.filter(option =>
      option.toLowerCase().includes(val.toLowerCase())
    );
  }

  notifySearchItemChanged() {
    this.debouncer.next(this.searchItem);
  }
}
