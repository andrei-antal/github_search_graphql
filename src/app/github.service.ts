import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { User, SearchResult } from './user-search.model';
import { GithubApiService } from './github-api.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private currentPage: number; // keep track of current page of results (we're using cursor based pagination, so we need this variable)
  private currentSearchText: string;

  private results$ = new Subject<{users: User[], pageInfo: any} >(); // used to emit search results and pagination data
  private error$ = new Subject<string>(); // used to emit errors
  private graphQlQuery = new Subject<Observable<SearchResult>>(); // used internally to avoid race conditions on successive calls

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
      switchMap(obs => obs), // cancel ongoing request upon new one
      catchError(err => of('Something went wrong.')) // naïve error handling
    ).subscribe((result) => {
      console.log(result);
      if (typeof result === 'string') {
        this.error$.next('Something went wrong.'); // emit error
      } else {
        // emit new results
        this.results$.next({
          ...result,
          pageInfo: {
            ...result.pageInfo,
            currentPage: this.currentPage
          }
        });
      }
    });
  }

  public searchForGithubUsers(searchText: string) {
    this.currentSearchText = searchText; // store new search text
    this.currentPage = 1; // reset page count
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
