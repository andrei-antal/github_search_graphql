import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';
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
  firstRun = true;

  ngOnChanges(changes) {
    if (changes.results && changes.results.currentValue) {
      this.firstRun = false;
    }
  }
}
