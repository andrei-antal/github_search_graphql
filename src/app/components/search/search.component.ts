import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, pluck } from 'rxjs/operators';

@Component({
  selector: 'ghs-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter<string>();
  @ViewChild('searchInput') searchInput;
  private inputStream$: Subscription;

  ngOnInit() {
    this.inputStream$ = fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        debounceTime(300),
        pluck('target', 'value')
      )
      .subscribe((searchText: string) => {
        if (searchText) {
          this.search.emit(searchText);
        }
      });
  }

  ngOnDestroy() {
    this.inputStream$.unsubscribe();
  }
}
