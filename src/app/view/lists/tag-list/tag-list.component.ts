import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {takeUntil} from 'rxjs/internal/operators';
import {MatchService} from '../../../services/entities/filter/match.service';
import {Tag} from '../../../model/entities/tag.model';
import {TagService} from '../../../services/entities/tag.service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit, OnDestroy {

  @Output() menuItemClickedEmitter = new EventEmitter<string>();

  tags = [];
  tagsAll = [];

  private unsubscribeSubject = new Subject();

  constructor(private tagService: TagService,
              private matchService: MatchService,
              private filterService: FilterService,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {

    this.initializeTagSubscription();
    this.initializeFilterSubscription();
  }

  /**
   * Subscribes tag changes
   */
  private initializeTagSubscription() {

    this.tagsAll = Array.from(this.tagService.tags.values());
    this.update();

    this.tagService.tagsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.tagsAll = value as Tag[];
        this.update();
      }
    });
  }

  /**
   * Subscribes filter changes
   */
  private initializeFilterSubscription() {

    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.update();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  /**
   * Handles click on menu items
   * @param menuItem
   */
  onMenuItemClicked(menuItem: string) {
    this.menuItemClickedEmitter.emit(menuItem);
  }

  /**
   * Filters original values
   */
  private update() {
    this.tags = this.tagsAll.sort((t1: Tag, t2: Tag) => {
      return t2 > t1 ? 1 : -1;
    });

    this.changeDetector.markForCheck();
  }

}
