import { NumberField, fluentNumberField, provideFluentDesignSystem } from "@fluentui/web-components";
import { Properties } from "./properties";

provideFluentDesignSystem()
    .register(fluentNumberField());

export class PropertiesEditor {
    private _properties: Properties;
    private _callback: (properties: Properties) => void;
    
    private _fileInput: HTMLInputElement;
    private _imageWidthInput: NumberField;
    private _imageHeightInput: NumberField;

    constructor() {
        this._properties = {
            imageWidth: 1,
            imageHeight: 1
        };

        this._fileInput = document.getElementById('file_input') as HTMLInputElement;
        this._imageWidthInput = document.getElementById('width_input') as NumberField;
        this._imageHeightInput = document.getElementById('height_input') as NumberField;

        this.addEventListeners();
    }

    public subscribeNotifications(callback: (properties: Properties) => void) {
        this._callback = callback;
    }

    private addEventListeners() {
        this._fileInput.addEventListener('change', () => this.onImageChanged());
        this._imageWidthInput.addEventListener('input', () => this.onImageSizeInput());
        this._imageHeightInput.addEventListener('input', () => this.onImageSizeInput());
    }

    private onImageChanged() {
        const file = this._fileInput.files[0];

        this._properties.image = URL.createObjectURL(file);
        this._callback(this._properties);
    }

    private onImageSizeInput() {
        this._properties.imageWidth = this._imageWidthInput.valueAsNumber;
        this._properties.imageHeight = this._imageHeightInput.valueAsNumber;

        this._callback(this._properties);
    }
}