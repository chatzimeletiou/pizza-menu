import { Component } from '@angular/core';
import { MenuItemCardComponent } from '../../components/menu-item-card/menu-item-card';
import { buildMenuItems } from '../../data/menu.mapper';
import { MenuItemViewModel, PriceChange, SizeSelectionChange } from '../../models/menu.models';
import { MenuStorageService } from '../../services/menu-storage.service';

@Component({
    selector: 'app-pizza-menu-page',
    standalone: true,
    imports: [MenuItemCardComponent],
    templateUrl: './pizza-menu-page.html',
    styleUrl: './pizza-menu-page.scss'
})
export class PizzaMenuPageComponent {
    protected menuItems: MenuItemViewModel[];
    private readonly initialMenuItems: MenuItemViewModel[];
    protected expandedItemId: number | null;

    constructor(
        private readonly menuStorageService: MenuStorageService
    ) {
        const loadedMenuItems = this.menuStorageService.load() ?? buildMenuItems();
        this.menuItems = structuredClone(loadedMenuItems);
        this.initialMenuItems = structuredClone(loadedMenuItems);
        this.expandedItemId = this.menuItems[0]?.itemId ?? null;
    }

    protected toggleItem(itemId: number): void {
        this.expandedItemId = this.expandedItemId === itemId ? null : itemId;
    }

    protected isItemExpanded(itemId: number): boolean {
        return this.expandedItemId === itemId;
    }

    protected onSizeSelectionChange(change: SizeSelectionChange): void {
        this.menuItems = this.menuItems.map(item => {
            if (item.itemId !== change.itemId) {
                return item;
            }

            return {
                ...item,
                sizes: item.sizes.map(size => {
                    if (size.sizeId !== change.sizeId) {
                        return size;
                    }
                    return {
                        ...size,
                        selected: change.selected,
                        price: change.selected ? size.price : 0
                    };
                })
            };
        });
        this.saveMenuItems();
    }

    protected onPriceChange(change: PriceChange): void {
        this.menuItems = this.menuItems.map(item => {
            if (item.itemId !== change.itemId) {
                return item;
            }
            return {
                ...item,
                sizes: item.sizes.map(size =>
                    size.sizeId === change.sizeId
                        ? { ...size, price: change.price }
                        : size
                )
            };
        });
        this.saveMenuItems();
    }

    protected hasItemChanges(itemId: number): boolean {
        const currentItem = this.menuItems.find(
            item => item.itemId === itemId
        );

        const initialItem = this.initialMenuItems.find(
            item => item.itemId === itemId
        );

        if (!currentItem || !initialItem) {
            return false;
        }
        return JSON.stringify(currentItem) !== JSON.stringify(initialItem);
    }

    protected undoItem(itemId: number): void {
        const initialItem = this.initialMenuItems.find(
            item => item.itemId === itemId
        );
        if (!initialItem) {
            return;
        }
        this.menuItems = this.menuItems.map(item =>
            item.itemId === itemId
                ? structuredClone(initialItem)
                : item
        );
        this.saveMenuItems();
    }

    private saveMenuItems(): void {
        this.menuStorageService.save(this.menuItems);
    }
}