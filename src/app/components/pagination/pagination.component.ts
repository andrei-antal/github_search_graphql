import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'ghs-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() totalResults: number;
  @Input() currentPage: number;
  @Input() pageSize: number;
  @Input() isLastPage: boolean;
  @Input() isFirstPage: boolean;
  @Output() previous = new EventEmitter();
  @Output() next = new EventEmitter();

  public resultsText: string;

  constructor() { }

  ngOnChanges() {
    this.setResultIndexes();
  }

  private setResultIndexes() {
    const startIndex = this.pageSize * (this.currentPage - 1) + 1;
    const endIndex = startIndex + this.pageSize - 1;
    this.resultsText = `${this.totalResults} results. Showing ${startIndex} - ${endIndex}.`;
  }
}
