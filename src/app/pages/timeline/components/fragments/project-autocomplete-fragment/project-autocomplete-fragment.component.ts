import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Project} from 'app/core/entity/model/project.model';
import {map, startWith} from 'rxjs/internal/operators';
import {ProjectService} from 'app/core/entity/services/project.service';
import {CloneService} from 'app/core/entity/services/clone.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';
import {SuggestionService} from 'app/core/entity/services/suggestion.service';

/**
 * Displays project auto-complete fragment
 */
@Component({
  selector: 'app-project-autocomplete-fragment',
  templateUrl: './project-autocomplete-fragment.component.html',
  styleUrls: ['./project-autocomplete-fragment.component.scss']
})
export class ProjectAutocompleteFragmentComponent implements OnInit {

  /** Project to be displayed */
  @Input() project: Project;
  /** Readonly dialog if true */
  @Input() readonly: false;
  /** Array of project options */
  @Input() projectOptions: string[] = [];

  /** Event emitter indicating changes in project */
  @Output() projectChangedEmitter = new EventEmitter<Project>();

  /** Debouncer for input field */
  inputFieldDebouncer = new Subject();
  /** Current inputFieldValue of input field */
  inputFieldValue = '';

  /** Array of options filtered by currently typed inputFieldValue */
  filteredOptions: Observable<string[]>;

  /** Form control */
  formControl: FormControl = new FormControl();

  /**
   * Constructor
   * @param {ProjectService} projectService
   * @param {CloneService} cloneService
   * @param {SuggestionService} suggestionService
   */
  constructor(private projectService: ProjectService,
              private cloneService: CloneService,
              private suggestionService: SuggestionService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeProject();
    this.initializeProjectOptions();
  }

  //
  // Initialization
  //

  /**
   * Initializes project
   */
  private initializeProject() {
    if (this.project == null) {
      this.project = new Project('', true);
    }

    this.project = CloneService.cloneProject(this.project);
  }

  /**
   * Initializes project options
   */
  private initializeProjectOptions() {
    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterOptions(value))
      );

    this.inputFieldDebouncer.pipe(
      debounceTime(500)
    ).subscribe((value: Project) => this.projectChangedEmitter.emit(value));
  }

  //
  // Actions
  //

  /**
   * Handles key up event
   */
  onKeyUp() {
    if (!this.readonly) {
      this.notify();
    }
  }

  /**
   * Handles selected option
   */
  onOptionSelected() {
    if (!this.readonly) {
      this.notify();
    }
  }

  //
  // Helpers
  //

  /**
   * Filters options according to current value of input field
   * @param {string} value input field value
   * @returns {string[]} array of filtered options
   */
  private filterOptions(value: string): string[] {
    return this.projectOptions.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
  }

  //
  // Notification
  //

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    this.inputFieldDebouncer.next(this.project);
  }
}
