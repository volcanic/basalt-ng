import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tag} from '../../../model/tag.model';
import {Observable} from 'rxjs/Rx';
import {FormControl} from '@angular/forms';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {map, startWith} from 'rxjs/internal/operators';

@Component({
  selector: 'app-tag-chips-fragment',
  templateUrl: './tag-chips-fragment.component.html',
  styleUrls: ['./tag-chips-fragment.component.scss']
})
export class TagChipsFragmentComponent implements OnInit {

  @Input() tags: Tag[] = [];
  @Output() onTagChangedEmitter = new EventEmitter<Tag[]>();

  value = '';

  options = [];
  filteredOptions: Observable<string[]>;
  formControl: FormControl = new FormControl();

  constructor(private taskletService: TaskletService) {
  }

  ngOnInit() {
    this.taskletService.updateTags();
    this.options = Array.from(this.taskletService.tags.values()).map(tag => {
      return tag.name;
    });

    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterSearchItems(value))
      );
  }

  onDeleteTag(value: Tag) {
    this.tags = this.tags.filter(tag => {
      return tag.name !== value.name;
    });

    this.notify();
  }

  onKeyUp(event: any) {
    const KEY_CODE_ENTER = 13;
    const KEY_CODE_COMMA = 188;

    if (this.value !== '' && this.value !== ',' && (event.keyCode == KEY_CODE_ENTER || event.keyCode == KEY_CODE_COMMA)) {
      this.tags.push(new Tag(this.value.replace(/,/, ''), true));
      this.value = '';
      this.notify();
    }
  }

  onKeyDown(event: any) {
    this.value = this.value.replace(/,/, '');
  }

  filterSearchItems(value: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
  }

  notify() {
    this.onTagChangedEmitter.emit(this.tags);
  }
}
