import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tag} from '../../../model/entities/tag.model';
import {Observable} from 'rxjs/Observable';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {SuggestionService} from '../../../services/entities/filter/suggestion.service';
import {TagService} from '../../../services/entities/tag.service';

@Component({
  selector: 'app-tag-chips-fragment',
  templateUrl: './tag-chips-fragment.component.html',
  styleUrls: ['./tag-chips-fragment.component.scss']
})
export class TagChipsFragmentComponent implements OnInit {

  @Input() tags: Tag[] = [];
  @Input() disabled = false;
  @Output() tagsChangedEmitter = new EventEmitter<Tag[]>();

  debouncer = new Subject();

  value = '';

  options = [];
  filteredOptions: Observable<string[]>;
  formControl: FormControl = new FormControl();

  constructor(private tagService: TagService,
              private filterService: FilterService,
              private suggestionService: SuggestionService) {
  }

  ngOnInit() {

    this.options = Array.from(this.suggestionService.tagOptions.values());

    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterSearchItems(value))
      );

    this.debouncer.pipe(
      debounceTime(500)
    ).subscribe((value: Tag[]) => this.tagsChangedEmitter.emit(value));
  }

  onDeleteTag(value: Tag) {
    if (!this.disabled) {
      this.tags = this.tags.filter(tag => {
        return tag.name !== value.name;
      });

      this.notify();
    }
  }

  onKeyUp(event: any) {
    if (!this.disabled) {
      const KEY_CODE_ENTER = 13;
      const KEY_CODE_COMMA = 188;

      if (this.value !== '' && this.value !== ',' && (event.keyCode === KEY_CODE_ENTER || event.keyCode === KEY_CODE_COMMA)) {
        this.tags.push(new Tag(this.value.replace(/,/, ''), true));
        this.value = '';
        this.notify();
      }
    }
  }

  onKeyDown(event: any) {
    this.value = this.value.replace(/,/, '');

  }

  onOptionSelected(event: any) {
    if (!this.disabled) {
      this.tags.push(new Tag(this.value.replace(/,/, ''), true));
      this.value = '';
      this.notify();
    }
  }

  filterSearchItems(value: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
  }

  notify() {
    this.debouncer.next(this.tags);
  }
}
