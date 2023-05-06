import { NumberField, fluentNumberField, provideFluentDesignSystem } from "@fluentui/web-components";
import { Properties } from "./properties";

provideFluentDesignSystem()
    .register(fluentNumberField());

export class PropertiesEditor {
    private _properties: Properties;
    private _callback: (properties: Properties) => void;
    
    private _loaded: boolean;
    private _imageWidthInput: NumberField;
    private _imageHeightInput: NumberField;

    constructor() {
        this._imageWidthInput = document.getElementById('width_input') as NumberField;
        this._imageHeightInput = document.getElementById('height_input') as NumberField;

        this.addEventListeners();
    }

    public open(properties: Properties) {
        this._properties = properties;

        this._loaded = false;
        this._imageWidthInput.valueAsNumber = properties.imageWidth;
        this._imageHeightInput.valueAsNumber = properties.imageHeight;
        this._loaded = true;
    }

    public subscribeNotifications(callback: (properties: Properties) => void) {
        this._callback = callback;
    }

    private addEventListeners() {
        this._imageWidthInput.addEventListener('input', () => this.onImageSizeInput());
        this._imageHeightInput.addEventListener('input', () => this.onImageSizeInput());
    }

    private onImageSizeInput() {
        if (!this._loaded) return;
        
        this._properties.imageWidth = this._imageWidthInput.valueAsNumber;
        this._properties.imageHeight = this._imageHeightInput.valueAsNumber;

        this._callback(this._properties);
    }
}