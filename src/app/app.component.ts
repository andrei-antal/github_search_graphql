import { Component } from '@angular/core';
import { GithubService } from './github.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ghs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private querySubscription: Subscription;
  results;
  constructor(private ghService: GithubService) { }

  searchHandler(searchText: string) {
    this.querySubscription = this.ghService.searchForGithubUsers(searchText)
      .subscribe((res) => {
        this.results = res;
      });
  }
}
