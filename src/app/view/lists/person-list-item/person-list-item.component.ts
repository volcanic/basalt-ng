import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {PersonService} from '../../../services/entities/person.service';
import {Person} from '../../../model/entities/person.model';
import {DialogMode} from '../../../model/ui/dialog-mode.enum';
import {PersonDialogComponent} from '../../dialogs/entities/person-dialog/person-dialog.component';

/**
 * Displays person list item
 */
@Component({
  selector: 'app-person-list-item',
  templateUrl: './person-list-item.component.html',
  styleUrls: ['./person-list-item.component.scss']
})
export class PersonListItemComponent {

  /** Person to be displayed */
  @Input() person: Person;

  /** Animation state */
  state = 'inactive';

  /**
   * Constructor
   * @param {PersonService} personService
   * @param {FilterService} filterService
   * @param {ChangeDetectorRef} changeDetector
   * @param {MatDialog} dialog dialog
   */
  constructor(private personService: PersonService,
              private filterService: FilterService,
              private changeDetector: ChangeDetectorRef,
              public dialog: MatDialog) {
  }

  //
  // Actions
  //

  /**
   * Handles hover over container
   * @param {boolean} hovered whether there is currently a hover event
   */
  onHoverContainer(hovered: boolean) {
    this.state = hovered ? 'active' : 'inactive';
  }

  /**
   * Handles click on update button
   */
  updatePerson() {
    const dialogRef = this.dialog.open(PersonDialogComponent, {
      disableClose: false,
      data: {
        mode: DialogMode.UPDATE,
        dialogTitle: 'Update person',
        person: this.person
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const person = result as Person;

        this.personService.updatePerson(person, true).then(() => {
          this.changeDetector.markForCheck();
        });
        this.filterService.updatePersonsList([person], true);
      }
    });
  }
}
