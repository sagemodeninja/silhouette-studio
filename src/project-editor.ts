import {
    NumberField, 
    Select,
    fluentNumberField, 
    fluentOption, 
    fluentSelect, 
    provideFluentDesignSystem
} from '@fluentui/web-components';
import { Project } from './project';
import { ListboxOption } from '@microsoft/fast-foundation';

provideFluentDesignSystem()
    .register(
        fluentNumberField(),
        fluentSelect(),
        fluentOption(),
    );

export class ProjectEditor extends EventTarget {
    private _project: Project;
    private _loaded: boolean;
    private _imageWidthInput: NumberField;
    private _imageHeightInput: NumberField;
    private _pageSizeSelect: Select;

    constructor(project: Project) {
        super();

        this._project = project;
        this._imageWidthInput = document.getElementById('width_input') as NumberField;
        this._imageHeightInput = document.getElementById('height_input') as NumberField;
        this._pageSizeSelect = document.getElementById('page_size_select') as Select;

        this.setup();
        this.addEventListeners();
    }

    private setup() {
        const option = document.createElement('fluent-option') as ListboxOption;
        option.value = 'a4';
        option.innerHTML = 'A4 (wxh)';

        this._pageSizeSelect.appendChild(option);
    }

    private addEventListeners() {
        this._project.addEventListener('load', () => this.loadProject());
        this._imageWidthInput.addEventListener('input', () => this.onImageSizeInput());
        this._imageHeightInput.addEventListener('input', () => this.onImageSizeInput());
    }

    private loadProject() {
        const properties = this._project.properties;

        this._loaded = false;
        this._imageWidthInput.valueAsNumber = properties.imageWidth;
        this._imageHeightInput.valueAsNumber = properties.imageHeight;
        this._loaded = true;
    }

    private onImageSizeInput() {
        if (!this._loaded) return;
        
        this._project.properties.imageWidth = this._imageWidthInput.valueAsNumber;
        this._project.properties.imageHeight = this._imageHeightInput.valueAsNumber;

        const changeEvent = new Event('change');
        this.dispatchEvent(changeEvent);
    }
}