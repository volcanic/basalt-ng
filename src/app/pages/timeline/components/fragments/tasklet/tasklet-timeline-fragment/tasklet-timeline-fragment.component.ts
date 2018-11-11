import {Component, Input, OnInit} from '@angular/core';
import {Tasklet} from '../../../../../../core/entity/model/tasklet.model';
import {TaskletService} from '../../../../../../core/entity/services/tasklet.service';
import {Media} from '../../../../../../core/ui/model/media.enum';

/**
 * Displays timeline fraction for a specific tasklet
 */
@Component({
  selector: 'app-tasklet-timeline-fragment',
  templateUrl: './tasklet-timeline-fragment.component.html',
  styleUrls: ['./tasklet-timeline-fragment.component.scss']
})
export class TaskletTimelineFragmentComponent implements OnInit {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;
  /** Background color to be used for mini fab */
  @Input() backgroundColor: string;
  /** Icon color to be used for mini fab */
  @Input() iconColor: string;
  /** Current media */
  @Input() media: Media = Media.UNDEFINED;

  /** Icon to be used for mini fab */
  icon: string;

  /** Enum of media types */
  public mediaType = Media;

  /**
   * Constructor
   * @param taskletService tasklet service
   */
  constructor(private taskletService: TaskletService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeIcon();
  }

  /**
   * Initializes icon
   */
  private initializeIcon() {
    this.icon = this.taskletService.getIconByTaskletType(this.tasklet.type);
  }
}
