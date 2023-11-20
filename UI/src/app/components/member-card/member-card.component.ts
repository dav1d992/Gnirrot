import { Component, Input, OnInit } from '@angular/core';
import { Member } from '@models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss'],
})
export class MemberCardComponent implements OnInit {
  @Input() public member!: Member;

  user = {
    picture: 'https://via.placeholder.com/200', // replace with user's picture URL
    name: 'John Doe',
    nickname: 'JD',
    age: 30,
  };

  constructor() {}

  ngOnInit() {}
}
