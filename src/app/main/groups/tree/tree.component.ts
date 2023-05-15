import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';


export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
  id: number;
  parentId: number;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  id: number;
  parentId: number;

}

/**
 * The Json object for to-do list data.
 */

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit, OnChanges {
  @Output('treeValue') treeValue = new EventEmitter<any>();
  @Output('action') action = new EventEmitter<any>();
  @Input('data') data = null;
  @Input('selected') selected = [];
  @Input('selectable') selectable = false;
  @Input('editable') editable = false;
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  constructor() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';
  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.id = node.id;
    flatNode.parentId = node.parentId;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);

    return flatNode;
  };

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
    this.sendTreeValue();
  }

  changeLeafNode(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    console.log(node);
    this.sendTreeValue();
  }

  addNewItem(node) {
    const parentNode = this.flatNodeMap.get(node);
    const newNode = new TodoItemNode();
    newNode.item = '';
    newNode.parentId = node.id;
    newNode.children = [];
    if (parentNode) {
      parentNode.children = [];
    }
    parentNode.children.push(newNode);
    this.refreshTree();
    this.treeControl.expand(node);
  }

  saveNode(node: TodoItemFlatNode, itemValue: string) {
    if (node) {
      const nestedNode = this.flatNodeMap.get(node);
      this.action.emit({
        action: 'insert',
        data: {
          name: itemValue,
          parentId: nestedNode.parentId
        }
      });
    } else {
      this.action.emit({
        action: 'insert',
        data: {
          name: itemValue,
          parentId: null
        }
      });
    }

  }

  ngOnInit(): void {
    this.loadTree();
    if (this.selected && this.selected.length) {
      // const selectedIds = this.selected.map(t => t._id);
      setTimeout(() => {
        this.selected.forEach(id => {
          const selected = this.data.find(t => t.id === id);
          if (selected) {
            const transformed = this.transformer(selected, this.findLevel(selected) + 1);
            this.changeLeafNode(transformed);
          }
        });

      }, 1);

    }
  }

  loadTree() {
    const cloned = this.data; //.map(x => Object.assign({}, x))
    this.dataSource.data = this.unflatten(cloned);
    setTimeout(() => {
      this.treeControl.expandAll();
    });
  }

  unflatten(arr) {
    let arrElem,
      mappedElem;

    const tree = [],
      mappedArr = {};

    // First map the nodes of the array to an object -> create a hash table.
    for (let i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.id] = arrElem;
      // mappedArr[arrElem.id]['children'] = [];
    }


    for (const id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.parentId && mappedArr[mappedElem['parentId']]) {
          if (!mappedArr[mappedElem['parentId']]['children']) {
            mappedArr[mappedElem['parentId']]['children'] = [];
          }
          mappedArr[mappedElem['parentId']]['children'].push(mappedElem);
        } else { // If the element is at the root level, add it to first level elements array.
          tree.push(mappedElem);
        }
      }
    }
    return tree;
  }

  sendTreeValue() {
    this.action.emit({
      action: 'select',
      data: this.checklistSelection.selected
    });
  }

  refreshTree() {
    const _data = this.dataSource.data;
    this.dataSource.data = [];
    this.dataSource.data = _data;
  }

  delete(node) {
    this.action.emit({
      action: 'delete',
      data: node
    });
  }

  findLevel(node) {
    let parent = this.data.find(t => t.id === node.parentId),
      count = 0;
    while (parent['parentId']) {
      parent = this.data.find(t => t.id === parent.parentId);
      count++;
    }
    return count;
  }

  hastGrandChild(node) {
    const nodeT = this.flatNodeMap.get(node);
    if (nodeT.children && nodeT.children.length) {
      nodeT.children.forEach(c => {
        if (c.children && c.children.length) {
          return true;
        }
      });
    }

    return false;
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.data && !changes.data.firstChange) {
      this.data = changes.data.currentValue;
      this.loadTree();
      /* const current = changes.data.currentValue.map(r => r.id),
         prev = changes.data.previousValue.map(r => r.id),
         difference = current.find(f => !prev.includes(f)),
         newItem = changes.data.currentValue.find(t => t.id === difference),
         parentOfNewItem = changes.data.currentValue.find(f => f.id === newItem.parentId);
       setTimeout(() => {
         const parentNode = new TodoItemFlatNode();
         parentNode.id = parentOfNewItem.id;
         parentNode.item = parentOfNewItem.item;
         parentNode.expandable = true;
         parentNode.parentId = parentOfNewItem.parentId;
         parentNode.level = this.findLevel(newItem);
         console.log(parentNode);
         let tmp: TodoItemFlatNode = {
           expandable:
             true,
           id:
             '5ba343c3352cb537584a4551',
           item:
             '2123123',
           level:
             2,
           parentId:
             '5ba34388352cb537584a4550'
         };
         this.refreshTree();
         this.treeControl.expand(tmp);
       }, 2000);*/
    }
  }
}
