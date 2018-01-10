import {Component, OnInit} from '@angular/core';
import {SnackbarService} from './services/snackbar.service';
import {PouchDBService} from './services/pouchdb.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [require('./app.component.scss')],
})
export class AppComponent implements OnInit {
  title = 'Basalt';

  constructor(private snackbarService: SnackbarService,
              private pouchDBService: PouchDBService,
              public snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
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
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
