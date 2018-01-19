import {Component, OnInit} from '@angular/core';
import {SnackbarService} from './services/snackbar.service';
import {PouchDBService} from './services/pouchdb.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {TaskletsService} from './services/tasklets.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [require('./app.component.scss')],
})
export class AppComponent implements OnInit {
  title = 'Basalt';

  constructor(private taskletsService: TaskletsService,
              private snackbarService: SnackbarService,
              private pouchDBService: PouchDBService,
              public snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.taskletsService.fetch();
    this.snackbarService.messageSubject.subscribe(
      (snack) => {
        this.openSnackBar(snack[0], snack[1]);
      }
    );

    this.pouchDBService.sync('http://localhost:5984/basalt');
  }

  /**
   * Handles messages that shall be displayed in a snack bar
   * @param message
   * @param action
   */
  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, <MatSnackBarConfig>{
      duration: 5000,
    });
  }
}
