import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Rx';
import {Project} from '../../../model/entities/project.model';
import {map, startWith} from 'rxjs/internal/operators';
import {ProjectService} from '../../../services/entities/project.service';

@Component({
  selector: 'app-project-autocomplete-fragment',
  templateUrl: './project-autocomplete-fragment.component.html',
  styleUrls: ['./project-autocomplete-fragment.component.scss']
})
export class ProjectAutocompleteFragmentComponent implements OnInit {

  @Input() project: Project;
  @Output() onProjectChangedEmitter = new EventEmitter<Project>();

  value = '';

  options = [];
  filteredOptions: Observable<string[]>;
  formControl: FormControl = new FormControl();

  constructor(private projectService: ProjectService) {
  }

  ngOnInit() {
    if (this.project == null) {
      this.project = new Project('', true);
    }

    // Cut ties with existing entity
    this.project = JSON.parse(JSON.stringify(this.project));

    this.options = Array.from(this.projectService.projects.values()).map(tag => {
      return tag.name;
    });

    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterSearchItems(value))
      );
  }

  onKeyUp(event: any) {
    this.notify();
  }

  onOptionSelected(event: any) {
    this.notify();
  }

  filterSearchItems(value: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
  }

  notify() {
    this.onProjectChangedEmitter.emit(this.project);
  }

}
