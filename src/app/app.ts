import { Component } from '@angular/core';
import { PizzaMenuPageComponent } from './features/order/pages/pizza-menu-page/pizza-menu-page';

@Component({
  selector: 'app-root',
  imports: [PizzaMenuPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
