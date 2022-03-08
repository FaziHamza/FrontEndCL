import {ChangeDetectorRef, Directive, ElementRef, Inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Directive({
    selector: '[appGeneralValidation]'
})
export class GeneralValidationDirective implements OnChanges {


    private _nativeElement: HTMLElement;
    private _isValid: boolean;

    @Input('formInQuestion') form!: FormGroup;
    @Input() formControlName!: string;

    constructor(@Inject(ElementRef) private _elementRef: ElementRef,
                @Inject(ChangeDetectorRef) private _changeDetector: ChangeDetectorRef) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this._nativeElement = this._elementRef.nativeElement;
        console.log(changes);
        if (this.form.controls[this.formControlName].touched && this.form.controls[this.formControlName].errors)
            this._nativeElement.classList.add('is-invalid');
        else
            this._nativeElement.classList.remove('is-invalid');

        if (this.form.controls[this.formControlName].touched && this.form.controls[this.formControlName].valid)
            this._nativeElement.classList.add('is-valid');
        else
            this._nativeElement.classList.remove('is-valid');

    }
}
