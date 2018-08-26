import {Component, Input, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Observable, of as observableOf} from 'rxjs';
import {ColorService} from '../../../../services/ui/color.service';
import {DailyDigest} from '../../../../model/entities/digest/daily-digest.model';
import {DateService} from '../../../../services/util/date.service';

/**
 * Represents a tree node
 */
export class EffortNode {
  /** Array of child nodes */
  children: EffortNode[];
  /** Topic of the node */
  topic: string;
  /** Effort of the node */
  effort: number;
  /** Background color */
  color = 'transparent';
}

/**
 * Represents a flat tree node
 */
export class EffortFlatNode {
  /** Array of child nodes */
  // children: EffortNode[];
  /** Topic of the node */
  topic: string;
  /** Effort of the node */
  effort: number;
  /** Background color */
  color = 'transparent';
  /** Level of the node */
  level: number;
  /** Whether the node is expandable */
  expandable: boolean;
}

/**
 * Displays daily effort tree
 */
@Component({
  selector: 'app-daily-effort-tree',
  templateUrl: './daily-effort-tree.component.html',
  styleUrls: ['./daily-effort-tree.component.scss']
})
export class DailyEffortTreeComponent implements OnInit {

  /** Daily digest to be displayed */
  @Input() dailyDigest: DailyDigest;

  /** Tree control */
  treeControl: FlatTreeControl<EffortFlatNode>;
  /** Tree flattener */
  treeFlattener: MatTreeFlattener<EffortNode, EffortFlatNode>;
  /** Data source */
  dataSource: MatTreeFlatDataSource<EffortNode, EffortFlatNode>;

  /**
   * Constructor
   * @param {ColorService} colorService
   */
  constructor(private colorService: ColorService) {
  }

  /**
   * Transforms an effort node into a effort flat node
   * @param {EffortNode} node effort node
   * @param {number} level level of the node
   * @returns {EffortFlatNode} effort flat node
   */
  static transformer(node: EffortNode, level: number) {
    const flatNode = new EffortFlatNode();
    flatNode.topic = node.topic;
    flatNode.effort = node.effort;
    flatNode.color = node.color;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    return flatNode;
  }

  /**
   * Retrieves a node's children
   * @param {EffortNode} node node
   * @returns {Observable<EffortNode[]>} children
   */
  static getChildren(node: EffortNode): Observable<EffortNode[]> {
    return observableOf(node.children);
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeTree();
    this.initializeTreeData();
  }

  //
  // Initialization
  //

  /**
   * Initializes tree
   */
  private initializeTree() {
    this.treeFlattener = new MatTreeFlattener(DailyEffortTreeComponent.transformer, this.getLevel,
      this.isExpandable, DailyEffortTreeComponent.getChildren);
    this.treeControl = new FlatTreeControl<EffortFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  /**
   * Initializes tree data
   */
  private initializeTreeData() {
    this.dataSource.data = this.buildTree();
  }

  //
  // Helpers
  //

  /**
   * Assembles all node of the tree
   * @returns {EffortNode[]} array of effort nodes
   */
  private buildTree(): EffortNode[] {
    const data: any[] = [];

    const day = new EffortNode();
    day.topic = `${DateService.getWeekDayString(new Date(this.dailyDigest.start).getDay())}
    [ ${DateService.getTimeString(this.dailyDigest.start)} - ${DateService.getTimeString(this.dailyDigest.end)} ]`;
    day.effort = this.dailyDigest.getProjectEffortSum();
    day.children = [];

    this.dailyDigest.getProjectEfforts().forEach(pe => {
      const taskNodes = [];

      pe.getTaskEfforts().forEach(te => {
        const taskEffortNode = new EffortNode();
        taskEffortNode.topic = te.task.name;
        taskEffortNode.effort = te.effort;
        taskNodes.push(taskEffortNode);
      });

      const projectEffortNode = new EffortNode();
      projectEffortNode.topic = pe.project.name;
      projectEffortNode.effort = pe.effort;
      projectEffortNode.color = this.colorService.getProjectColor(pe.project);
      projectEffortNode.children = taskNodes;

      day.children.push(projectEffortNode);
    });

    data.push(day);

    return data;
  }

  /**
   * Retrieves a node's level
   * @param {EffortFlatNode} node node
   * @returns {number} level
   */
  private getLevel = (node: EffortFlatNode) => node.level;

  /**
   * Retrieves if a node is expandable
   * @param {EffortFlatNode} node node
   * @returns {boolean} true if expandable
   */
  private isExpandable = (node: EffortFlatNode) => node.expandable;

  /**
   * Determines whether a node has children
   * @param {number} _
   * @param {EffortFlatNode} _nodeData node dat
   * @returns {boolean} true if node has children
   */
  hasChild = (_: number, _nodeData: EffortFlatNode) => _nodeData.expandable;
}
