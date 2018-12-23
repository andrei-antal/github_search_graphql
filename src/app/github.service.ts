import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User, SearchResult } from './user-search.model';
import { GithubApiService } from './github-api.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private currentPage: number;
  private currentSearchText: string;

  private results$ = new Subject<{users: User[], pageInfo: any} >();
  private error$ = new Subject<string>();
  private graphQlQuery = new Subject<Observable<SearchResult>>();

  get pageSize() {
    return this.githubApi.pageSize;
  }

  get results() {
    return this.results$.asObservable();
  }

  get error() {
    return this.error$.asObservable();
  }

  constructor(private githubApi: GithubApiService) {
    this.graphQlQuery.pipe(
      switchMap(obs => obs) // avoid race conditions, cancel ongoing request upon new one
    ).subscribe((result) => {
      this.results$.next({
        ...result,
        pageInfo: {
          ...result.pageInfo,
          currentPage: this.currentPage
        }
      });
    }, () => {
      this.error$.next('Something went wrong.'); // naïve error handling
    });
  }

  public searchForGithubUsers(searchText: string) {
    this.currentSearchText = searchText;
    this.currentPage = 1;
    this.graphQlQuery.next(this.githubApi.doSearch(this.currentSearchText, null, null));
  }

  public getNextPage(cursor: string) {
    this.currentPage += 1;
    this.graphQlQuery.next(this.githubApi.doSearch(this.currentSearchText, null, cursor));
  }

  public getPrevPage(cursor: string) {
    this.currentPage -= 1;
    this.graphQlQuery.next(this.githubApi.doSearch(this.currentSearchText, cursor, null));
  }

  public reload() {
    this.graphQlQuery.next(this.githubApi.doSearch(this.currentSearchText, null, null));
  }
}
