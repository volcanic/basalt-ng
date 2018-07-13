import {Component, Input, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Observable, of as observableOf} from 'rxjs';
import {ColorService} from '../../../../services/color.service';
import {DailyDigest} from '../../../../model/daily-digest.model';
import {DateService} from '../../../../services/date.service';

export class EffortNode {
  children: EffortNode[];
  topic: string;
  effort: number;
  color = 'transparent';
}

export class EffortFlatNode {
  topic: string;
  effort: number;
  color: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'app-daily-effort-tree',
  templateUrl: './daily-effort-tree.component.html',
  styleUrls: ['./daily-effort-tree.component.scss']
})
export class DailyEffortTreeComponent implements OnInit {
  @Input() dailyDigest: DailyDigest;

  treeControl: FlatTreeControl<EffortFlatNode>;
  treeFlattener: MatTreeFlattener<EffortNode, EffortFlatNode>;
  dataSource: MatTreeFlatDataSource<EffortNode, EffortFlatNode>;

  constructor(private colorService: ColorService,
              private dateService: DateService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<EffortFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit() {
    this.dataSource.data = this.buildFileTree();
  }

  buildFileTree(): EffortNode[] {
    const data: any[] = [];

    const day = new EffortNode();
    day.topic = `${this.dateService.getWeekDayString(new Date(this.dailyDigest.start).getDay())}
    [ ${this.dateService.getTime(this.dailyDigest.start)} - ${this.dateService.getTime(this.dailyDigest.end)} ]`;
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

  transformer = (node: EffortNode, level: number) => {
    const flatNode = new EffortFlatNode();
    flatNode.topic = node.topic;
    flatNode.effort = node.effort;
    flatNode.color = node.color;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    return flatNode;
  }

  private getLevel = (node: EffortFlatNode) => node.level;

  private isExpandable = (node: EffortFlatNode) => node.expandable;

  private getChildren = (node: EffortNode): Observable<EffortNode[]> => {
    return observableOf(node.children);
  }

  hasChild = (_: number, _nodeData: EffortFlatNode) => _nodeData.expandable;
}
