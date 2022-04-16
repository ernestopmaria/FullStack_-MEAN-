import { Component } from '@angular/core';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'default',
  styleUrls: ['default.component.scss'],
  templateUrl: './default.component.html',
})
export class DefaultComponent {
  constructor(private userService:UserService) {
    this.userService.list().subscribe((users) => {
      console.log('users', users);
    });
    console.log('teste');
  }
}
