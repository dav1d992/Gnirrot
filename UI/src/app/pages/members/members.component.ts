import { Component, OnInit, inject } from '@angular/core';
import { Member } from '@models/member';
import { MembersService } from '@services/members.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  private readonly memberService = inject(MembersService);
  members: Member[] = [];

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: (members) => {
        this.members = members;
      },
    });
  }
}
