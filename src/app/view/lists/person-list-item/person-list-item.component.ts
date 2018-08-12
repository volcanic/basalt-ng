import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {PersonService} from '../../../services/entities/person.service';
import {Person} from '../../../model/entities/person.model';

@Component({
  selector: 'app-person-list-item',
  templateUrl: './person-list-item.component.html',
  styleUrls: ['./person-list-item.component.scss']
})
export class PersonListItemComponent implements OnInit {
  @Input() person: Person;

  state = 'inactive';

  constructor(private personService: PersonService,
              private filterService: FilterService,
              public dialog: MatDialog,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  onHoverContainer(hovered: boolean) {
    this.state = hovered ? 'active' : 'inactive';
  }

  updatePerson() {
    /*
    const dialogRef = this.dialog.open(PersonDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.UPDATE,
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
    */
  }
}
