import {Component, Input, OnInit} from '@angular/core';
import {MatIconRegistry, MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Observable, of as observableOf} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {ColorService} from '../../../../services/color.service';
import {WeeklyDigest} from '../../../../model/weekly-digest.model';
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
  selector: 'app-weekly-effort-tree',
  templateUrl: './weekly-effort-tree.component.html',
  styleUrls: ['./weekly-effort-tree.component.scss']
})
export class ProjectEffortTreeComponent implements OnInit {
  @Input() weeklyDigest: WeeklyDigest;

  treeControl: FlatTreeControl<EffortFlatNode>;
  treeFlattener: MatTreeFlattener<EffortNode, EffortFlatNode>;
  dataSource: MatTreeFlatDataSource<EffortNode, EffortFlatNode>;

  constructor(private colorService: ColorService,
              private dateService: DateService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('expand_more', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-expand_more-24px.svg'));
    iconRegistry.addSvgIcon('chevron_right', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-chevron_right-24px.svg'));

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

    const week = new EffortNode();
    week.topic = `Week [ ${this.dateService.getDate(this.weeklyDigest.start).replace(/[0-9]{4}/, '').trim()} - ${this.dateService.getDate(this.weeklyDigest.end)} ]`;
    week.effort = this.weeklyDigest.getProjectEffortSum();
    week.children = [];

    this.weeklyDigest.getProjectEfforts().forEach(pe => {
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
      projectEffortNode.color = this.colorService.getProjectColor(pe.project.name);
      projectEffortNode.children = taskNodes;

      week.children.push(projectEffortNode);
    });

    data.push(week);

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
