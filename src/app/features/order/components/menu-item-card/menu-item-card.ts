import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItemViewModel, PriceChange, SizeSelectionChange } from '../../models/menu.models';

@Component({
    selector: 'app-menu-item-card',
    standalone: true,
    imports: [],
    templateUrl: './menu-item-card.html',
    styleUrl: './menu-item-card.scss'
})
export class MenuItemCardComponent {
    // Data της συγκεκριμένης πίτσας
    @Input({ required: true }) item!: MenuItemViewModel;
    // Αν η κάρτελα πρέπει να είναι ανοιχτή
    @Input() expanded = false;
    // Aν η πιτσα εχει αλλαγες, χρηση για Undo
    @Input() hasChanges = false;
    // Button καρτέλας
    @Output() toggled = new EventEmitter<number>();
    // Αλλαγη σε checkbox
    @Output() sizeSelectionChanged = new EventEmitter<SizeSelectionChange>();
    // Αλλαγή τιμής
    @Output() priceChanged = new EventEmitter<PriceChange>();
    // Ενημερωνει το parent για Undo
    @Output() undoRequested = new EventEmitter<number>();

    // Ανοιγει η κλεινει η καρτέλα
    protected toggleItem(): void {
        this.toggled.emit(this.item.itemId);
    }

    // Καλείται οταν ο χρηστης αλλαξει ενα checkbox
    protected onSizeSelectionChange(sizeId: number, event: Event): void {
        const checkbox = event.target as HTMLInputElement;

        this.sizeSelectionChanged.emit({
            itemId: this.item.itemId,
            sizeId,
            selected: checkbox.checked
        });
    }

    // Οταν αλλαγη τιμής
    protected onPriceChange(sizeId: number, currentPrice: number, event: Event): void {
        const input = event.target as HTMLInputElement;

        // Αν ο χρηστης σβησει την τιμη τη μετατρεπει σε μηδεν
        if (input.value.trim() === '') {
            input.value = '0.00';
            this.priceChanged.emit({
                itemId: this.item.itemId,
                sizeId,
                price: 0
            });
            return;
        }
        const price = Number(input.value);

        // Αν η τιμη δεν ειναι εγκυρη κραταει την προηγουμενη τιμη
        if (!Number.isFinite(price) || price < 0) {
            input.value = currentPrice.toFixed(2);
            return;
        }
        // Κραταει την τιμη μεχρι δυο δεκαδικα
        const normalizedPrice = Number(price.toFixed(2));
        input.value = normalizedPrice.toFixed(2);

        this.priceChanged.emit({
            itemId: this.item.itemId,
            sizeId,
            price: normalizedPrice
        });
    }

    protected undoChanges(): void {
        this.undoRequested.emit(this.item.itemId);
    }

    // Ελεγχει το value του input οσο εχει νεα τιμή
    // Κραταει μονο εγκυρους αριθμους και μεχρι δυο δεκαδικα
    protected onPriceInput(event: Event): void {
        const input = event.target as HTMLInputElement;

        let sanitizedValue = input.value
            .replace(',', '.')
            .replace(/[^0-9.]/g, '');

        const decimalPointIndex = sanitizedValue.indexOf('.');

        if (decimalPointIndex !== -1) {
            const integerPart =
                sanitizedValue.slice(0, decimalPointIndex) || '0';

            const decimalPart = sanitizedValue
                .slice(decimalPointIndex + 1)
                .replace(/\./g, '')
                .slice(0, 2);

            sanitizedValue = `${integerPart}.${decimalPart}`;
        }
        input.value = sanitizedValue;
    }
}