import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, pluck, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'ghs-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter<string>();
  @ViewChild('searchInput') searchInput;
  private inputStream$: Subscription; // input stream form search field, used to emit search values to parent

  ngOnInit() {
    this.inputStream$ = fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        debounceTime(250),
        pluck<UIEvent, string>('target', 'value'),
        filter(value => value.length >= 3)
      )
      .subscribe(searchText => {
        if (searchText) {
          this.search.emit(searchText);
        }
      });
  }

  ngOnDestroy() {
    this.inputStream$.unsubscribe();
  }
}
