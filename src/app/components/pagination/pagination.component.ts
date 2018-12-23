import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'ghs-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Output() previous = new EventEmitter();
  @Output() next = new EventEmitter();
  @Input() totalResults: number;
  @Input() currentPage: number;
  @Input() pageSize: number;
  @Input() isLastPage: boolean;
  @Input() isFirstPage: boolean;

  startIndex: number;
  endIndex: number;

  constructor() { }

  ngOnInit() {
    this.setResultIndexes();
  }

  ngOnChanges() {
    this.setResultIndexes();
  }

  setResultIndexes() {
    this.startIndex = this.pageSize * (this.currentPage - 1) + 1;
    this.endIndex = this.startIndex + this.pageSize - 1;
  }

  prevHandler() {
    this.previous.emit();
  }

  nextHandler() {
    this.next.emit();
  }

}
