import { Injectable } from '@angular/core';
import { MenuItemViewModel } from '../models/menu.models';

@Injectable({
  providedIn: 'root'
})
export class MenuStorageService {
  private readonly storageKey = 'pizza-menu-state';

  load(): MenuItemViewModel[] | null {
    try {
      const storedState = localStorage.getItem(this.storageKey);

      if (!storedState) {
        return null;
      }
      return JSON.parse(storedState) as MenuItemViewModel[];
    } catch {
      return null;
    }
  }

  save(menuItems: MenuItemViewModel[]): void {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(menuItems)
      );
    } catch {}
  }
}