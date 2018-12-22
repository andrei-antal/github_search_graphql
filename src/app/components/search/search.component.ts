import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, pluck } from 'rxjs/operators';
import { GithubService } from 'src/app/github.service';

@Component({
  selector: 'ghs-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Output() search = new EventEmitter<string>();
  @ViewChild('searchInput') searchInput;

  ngOnInit() {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        debounceTime(500),
        pluck('target', 'value')
      )
      .subscribe((searchText: string) => {
        if (searchText) {
          this.search.emit(searchText);
        }
      });
  }
}
