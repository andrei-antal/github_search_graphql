import { Component, OnInit, OnDestroy } from '@angular/core';
import { GithubService } from './github.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from './user-search.model';

@Component({
  selector: 'ghs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject(); // used to stop subscription on component destroy

  results: User[];
  pageInfo;
  isLoading = false;
  error: string;

  constructor(public ghService: GithubService) { }

  ngOnInit() {
    this.ghService.results
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.results = res.users;
        this.pageInfo = res.pageInfo;
        this.isLoading = false;
        this.error = null;
      });
    this.ghService.error
      .pipe(takeUntil(this.destroy$))
      .subscribe(err => {
        this.isLoading = false;
        this.error = err;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchHandler(searchText: string) {
    this.resetLoadingState();
    this.ghService.searchForGithubUsers(searchText);
  }

  nextHandler() {
    this.resetLoadingState();
    this.ghService.getNextPage(this.pageInfo.endCursor);
  }

  prevHandler() {
    this.resetLoadingState();
    this.ghService.getPrevPage(this.pageInfo.startCursor);
  }

  reloadHandler() {
    this.resetLoadingState();
    this.ghService.reload();
  }

  private resetLoadingState() {
    this.isLoading = true;
    this.error = null;
  }
}
