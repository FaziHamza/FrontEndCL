import {Component, Input, OnInit} from '@angular/core';
import {PaymentService} from "../payment.service";

@Component({
    selector: 'app-payment-item',
    templateUrl: './payment-item.component.html',
    styleUrls: ['./payment-item.component.scss']
})
export class PaymentItemComponent implements OnInit {
    // Input Decorator
    @Input() product;

    /**
     * Constructor
     *
     * @param {PaymentService} paymentService
     */
    constructor(private paymentService: PaymentService) {
    }

    /**
     * Remove From Cart
     *
     * @param product
     */
    removeFromCart(product) {
        if (product.isInCart === true) {
            this.paymentService.removeFromCart(product.id).then(res => {
                product.isInCart = false;
            });
        }
    }

    /**
     * Toggle Wishlist
     *
     * @param product
     */
    toggleWishlist(product) {
        if (product.isInWishlist === true) {
            this.paymentService.removeFromWishlist(product.id).then(res => {
                product.isInWishlist = false;
            });
        } else {
            this.paymentService.addToWishlist(product.id).then(res => {
                product.isInWishlist = true;
            });
        }
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------
    ngOnInit(): void {
    }
}
