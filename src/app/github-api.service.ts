import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck, first } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { parseUsers, SearchResult } from './user-search.model';

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {
  public readonly pageSize = 9;

  constructor(private apollo: Apollo) {
  }

  public doSearch(searchText: string, firstCursor: string, lastCursor: string): Observable<SearchResult> {
    const initialSearch = (!firstCursor && !lastCursor) ? `first: ${this.pageSize}` : '';
    const firstCursorText = firstCursor ? `last: ${this.pageSize}, before: "${firstCursor}"` : '';
    const lastCursorText = lastCursor ? `first: ${this.pageSize}, after: "${lastCursor}"` : '';

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
        text: searchText,
        pageSize: this.pageSize
      },
    })
    .valueChanges
    .pipe(
      pluck('data', 'search'),
      map(({edges, pageInfo, codeCount}) => ({
        users: parseUsers(edges),
        pageInfo: {
          ...pageInfo,
          total: codeCount,
        }
      })),
      first()
    );
  }
}
