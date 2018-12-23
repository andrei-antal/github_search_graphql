import { Component, OnInit } from '@angular/core';
import { GithubService } from './github.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ghs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  private querySubscription: Subscription;
  results;
  pageInfo;
  constructor(public ghService: GithubService) { }

  ngOnInit() {
    this.querySubscription = this.ghService.results
      .subscribe((res: any) => {
        this.results = res.users;
        this.pageInfo = res.pageInfo;
        console.log(this.pageInfo);
      });
  }

  searchHandler(searchText: string) {
    this.ghService.searchForGithubUsers(searchText);
  }

  nextHandler() {
    this.ghService.getNextPage(this.pageInfo.endCursor);
  }

  prevHandler() {
    this.ghService.getPrevPage(this.pageInfo.startCursor);
  }
}
