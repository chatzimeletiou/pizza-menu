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
    @Input({ required: true }) item!: MenuItemViewModel;
    @Input() expanded = false;
    @Input() hasChanges = false;
    @Output() toggled = new EventEmitter<number>();
    @Output() sizeSelectionChanged = new EventEmitter<SizeSelectionChange>();
    @Output() priceChanged = new EventEmitter<PriceChange>();
    @Output() undoRequested = new EventEmitter<number>();

    protected toggleItem(): void {
        this.toggled.emit(this.item.itemId);
    }

    protected onSizeSelectionChange(sizeId: number, event: Event): void {
        const checkbox = event.target as HTMLInputElement;

        this.sizeSelectionChanged.emit({
            itemId: this.item.itemId,
            sizeId,
            selected: checkbox.checked
        });
    }

    protected onPriceChange(sizeId: number, currentPrice: number, event: Event): void {
        const input = event.target as HTMLInputElement;

        if (input.value.trim() === '') {
            input.value = currentPrice.toFixed(2);
            return;
        }
        const price = Number(input.value);

        if (!Number.isFinite(price) || price < 0) {
            input.value = currentPrice.toFixed(2);
            return;
        }
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