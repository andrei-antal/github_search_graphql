import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { parseUsers } from './user-search.model';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private apollo: Apollo) {}

  searchForGithubUsers(searchText) {
    const githubUsersSearchQuery = gql`
      query searchUsers($text: String!){
        search(query: $text, type: USER, first: 10) {
          codeCount
          pageInfo {
            endCursor
            startCursor
          }
          edges {
            node {
              ... on User {
                name
                avatarUrl
                email
                createdAt
                url
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
          text: searchText
        }
      })
      .valueChanges
      .pipe(
        map((res: any) => parseUsers(res))
      );
  }
}
