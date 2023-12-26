import { Component, Input } from '@angular/core';
import { Material } from '@models/material';

@Component({
  selector: 'app-material-card',
  templateUrl: './material-card.component.html',
  styleUrls: ['./material-card.component.scss'],
})
export class MaterialCardComponent {
  @Input() public material?: Material;
  @Input() public amountNeededInProducts: number = 0;
}
