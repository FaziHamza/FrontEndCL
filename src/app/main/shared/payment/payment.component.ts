import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import Stepper from "bs-stepper";
import {PaymentService} from "./payment.service";

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {class: 'ecommerce-application'}
})
export class PaymentComponent implements OnInit {
    // Public
    public contentHeader: object;
    public products;
    public cartLists;
    public wishlist;

    public address = {
        fullNameVar: '',
        numberVar: '',
        flatVar: '',
        landmarkVar: '',
        cityVar: '',
        pincodeVar: '',
        stateVar: ''
    };

    // Private
    private checkoutStepper: Stepper;

    /**
     *  Constructor
     *
     * @param {PaymentService} paymentService
     */
    constructor(private paymentService: PaymentService) {
    }

    // Public Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Stepper Next
     */
    nextStep() {
        this.checkoutStepper.next();
    }

    /**
     * Stepper Previous
     */
    previousStep() {
        this.checkoutStepper.previous();
    }

    /**
     * Validate Next Step
     *
     * @param addressForm
     */
    validateNextStep(addressForm) {
        if (addressForm.valid) {
            this.nextStep();
        }
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to ProductList change
        this.paymentService.onProductListChange.subscribe(res => {
            this.products = res;

            this.products.isInWishlist = false;
        });

        // Subscribe to Cartlist change
        this.paymentService.onCartListChange.subscribe(res => (this.cartLists = res));

        // Subscribe to Wishlist change
        this.paymentService.onWishlistChange.subscribe(res => (this.wishlist = res));

        // update product is in Wishlist & is in CartList : Boolean
        this.products.forEach(product => {
            product.isInWishlist = this.wishlist.findIndex(p => p.productId === product.id) > -1;
            product.isInCart = this.cartLists.findIndex(p => p.productId === product.id) > -1;
        });

        this.checkoutStepper = new Stepper(document.querySelector('#checkoutStepper'), {
            linear: false,
            animation: true
        });

        // content header
        this.contentHeader = {
            headerTitle: 'Checkout',
            actionButton: true,
            breadcrumb: {
                type: '',
                links: [
                    {
                        name: 'Home',
                        isLink: true,
                        link: '/'
                    },
                    {
                        name: 'eCommerce',
                        isLink: true,
                        link: '/'
                    },
                    {
                        name: 'Checkout',
                        isLink: false
                    }
                ]
            }
        };
    }
}
