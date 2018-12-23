import { Component, Input } from '@angular/core';
import { User } from 'src/app/user-search.model';

@Component({
  selector: 'ghs-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() user: User;
}
