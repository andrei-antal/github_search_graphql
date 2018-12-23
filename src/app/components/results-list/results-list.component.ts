import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { User } from 'src/app/user-search.model';

@Component({
  selector: 'ghs-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss']
})
export class ResultsListComponent implements OnChanges {
  @Input() results: User[];
  @Input() loading: boolean;
  @Input() error: string;
  @Output() reloadSearch = new EventEmitter();
  public firstRun = true; // used to hide messages before any results are first retrieved

  ngOnChanges(changes: SimpleChanges) {
    if (changes.results && changes.results.currentValue) {
      this.firstRun = false;
    }
  }
}
