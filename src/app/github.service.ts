import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, pluck, first } from 'rxjs/operators';

import { parseUsers } from './user-search.model';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private currentPage: number;
  private currentSearchText: string;

  public readonly pageSize = 10;

  private results$ = new Subject();

  get results() {
    return this.results$.asObservable();
  }

  constructor(private apollo: Apollo) { }

  searchForGithubUsers(searchText: string) {
    this.currentSearchText = searchText;
    this.currentPage = 1;
    return this.doSearch(null, null);
  }

  getNextPage(cursor) {
    this.currentPage += 1;
    this.doSearch(null, cursor);
  }

  getPrevPage(cursor) {
    this.currentPage -= 1;
    this.doSearch(cursor, null);
  }

  doSearch(firstCursor, lastCursor) {
    const initialSearch = (!firstCursor && !lastCursor) ? `first: ${this.pageSize}` : '';
    const firstCursorText = firstCursor ? `last: ${this.pageSize}, before: ${firstCursor}` : '';
    const lastCursorText = lastCursor ? `first: ${this.pageSize}, after: ${lastCursor}` : '';
    const githubUsersSearchQuery = gql`
      query searchUsers($text: String!){
        search(query: $text, type: USER, ${initialSearch}${firstCursorText}${lastCursorText}) {
          codeCount
          pageInfo {
            endCursor
            startCursor
            hasPreviousPage
            hasNextPage
          }
          edges {
            cursor
            node {
              ... on User {
                name
                avatarUrl
                email
                createdAt
                location
                bio
                url
                pullRequests(last: 1, orderBy: {field: CREATED_AT, direction: ASC},states: OPEN) {
                  nodes {
                    url
                  }
                }
                starredRepositories {
                  totalCount
                }
                followers {
                  totalCount
                }
                repositories {
                  totalCount
                }
                watching {
                  totalCount
                }
              }
            }
          }
        }
      }
    `;

    return this.apollo.watchQuery<any>({
      query: githubUsersSearchQuery,
      variables: {
        text: this.currentSearchText,
        pageSize: this.pageSize
      }
    })
    .valueChanges
    .pipe(
      pluck('data', 'search'),
      map((res: any) => ({
        users: parseUsers(res.edges),
        pageInfo: {
          ...res.pageInfo,
          total: res.codeCount,
          currentPage: this.currentPage
        }
      }),
      first()
    )).subscribe(result => {
      this.results$.next(result);
    });
  }
}
