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
    //το state του menu
    protected menuItems: MenuItemViewModel[];
    // αρχικο state για το Undo
    private readonly initialMenuItems: MenuItemViewModel[];
    //id του item που ειναι ανοιχτο
    protected expandedItemId: number | null;

    constructor(
        private readonly menuStorageService: MenuStorageService
    ) {
        // φορτωνει state απο το localStorage και φτιαχνει 2 αντίγραφα
        const loadedMenuItems = this.menuStorageService.load() ?? buildMenuItems();
        this.menuItems = structuredClone(loadedMenuItems);
        this.initialMenuItems = structuredClone(loadedMenuItems);
        this.expandedItemId = this.menuItems[0]?.itemId ?? null;
    }

    // ανοιγει/κλεινει το item & Οταν ανοιγει το άλλο κλεινει
    protected toggleItem(itemId: number): void {
        this.expandedItemId = this.expandedItemId === itemId ? null : itemId;
    }

    // Ελεγχει αν το συγκεκριμενο item ειναι ανοιχτο
    protected isItemExpanded(itemId: number): boolean {
        return this.expandedItemId === itemId;
    }

    // ενημερωνει το state οταν αλλαζει ενα checkbox 
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
                        // Οταν το size γινει disabled η τιμη γινεται μηδεν
                        price: change.selected ? size.price : 0
                    };
                })
            };
        });
        this.saveMenuItems();
    }

    // Καλείται όταν αλλάζει η τιμή μιας πιτσας
    // Ενημερώνει το σωστό item και αποθηκευει το νέο state 
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

    // Αποφασίζει αν το Undo πρέπει να φαίνεται 
    // Καλείται απο το template για καθε item 
    // Συγκρινει το current state με το initial state
    // Αν υπαρχουν αλλαγες επιστρεφει true και εμφανιζει το Undo
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

    // Καλείται οταν το child component οταν πατηθει undo
    // Κανει Undo μονο στη συγκεκριμενη πιτσα
    // Και αποθηκευει το νεο state
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