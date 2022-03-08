import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {base64ToFile, Dimensions, ImageCroppedEvent} from "ngx-image-cropper";

@Component({
    selector: 'app-profile-pic-picker',
    templateUrl: './profile-pic-picker.component.html',
    styleUrls: ['./profile-pic-picker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ProfilePicPickerComponent,
            multi: true
        }
    ]
})
export class ProfilePicPickerComponent implements ControlValueAccessor, OnInit {
    @Input() progress;
    onChange: Function;
    private file: File | null = null;
    imageChangedEvent: any;
    croppedImage: any = '';
    showCropper: boolean = true;

    @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
        const file = event && event.item(0);
        // if (this.onChange !== null && this.onChange !== undefined)
        this.onChange(file);
        this.file = file;
    }

    constructor(private host: ElementRef<HTMLInputElement>) {
    }


    ngOnInit(): void {
    }

    writeValue(value: null) {
        // clear file input
        this.host.nativeElement.value = '';
        this.file = null;
    }

    registerOnChange(fn: Function) {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function) {
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        console.log(event, base64ToFile(event.base64));
    }

    imageLoaded() {
        this.showCropper = true;
        console.log('Image loaded');
    }

    cropperReady(sourceImageDimensions: Dimensions) {
        console.log('Cropper ready', sourceImageDimensions);
    }

    loadImageFailed() {
        console.log('Load failed');
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
}
