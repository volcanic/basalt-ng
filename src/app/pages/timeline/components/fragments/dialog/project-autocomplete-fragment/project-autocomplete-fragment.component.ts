import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Project} from 'app/core/entity/model/project.model';
import {CloneService} from 'app/core/entity/services/clone.service';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

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
  debouncer = new Subject();
  /** Array of options filtered by currently typed value */
  optionsFiltered: string[];

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeProject();
    this.initializeOptions();
    this.initializeDebouncer();
  }

  //
  // Initialization
  //

  /**
   * Initializes project
   */
  private initializeProject() {
    if (this.project == null) {
      this.project = new Project('');
    }

    this.project = CloneService.cloneProject(this.project);
  }

  /**
   * Initialize auto-complete options
   */
  private initializeOptions() {
    this.optionsFiltered = this.projectOptions;
  }

  /**
   * Initializes debouncer
   */
  private initializeDebouncer() {
    this.debouncer.pipe(
      debounceTime(500)
    ).subscribe((value: Project) => this.projectChangedEmitter.emit(value));
  }

  //
  // Actions
  //

  /**
   * Handles project name changes
   * @param projectName project name
   */
  onProjectNameChanged(projectName: string) {
    this.project.name = projectName;
    this.optionsFiltered = this.filterOptions(this.project.name);
    this.debouncer.next(this.project);
  }

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
    this.debouncer.next(this.project);
  }
}
