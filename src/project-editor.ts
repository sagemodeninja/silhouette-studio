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
import * as papers from './data/papers.json';

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
        const options = Array.from(papers).reduce((options, paper) => {
            const text = `${paper.id} (${paper.in.width} x ${paper.in.height} in)`;
            
            options.push(new ListboxOption(text, paper.id));
            return options;
        }, []);

        this._pageSizeSelect.append(...options);
    }

    private addEventListeners() {
        this._project.addEventListener('load', () => this.loadProject());
        this._imageWidthInput.addEventListener('input', () => this.onChange());
        this._imageHeightInput.addEventListener('input', () => this.onChange());
        this._pageSizeSelect.addEventListener('change', () => this.onChange());
    }

    private loadProject() {
        const properties = this._project.properties;
        const pageSetup = this._project.pageSetup;

        this._loaded = false;

        this._imageWidthInput.valueAsNumber = properties.imageWidth;
        this._imageHeightInput.valueAsNumber = properties.imageHeight;
        this._pageSizeSelect.value = pageSetup.size;
        
        this._loaded = true;
    }

    private onChange() {
        if (!this._loaded) return;
        
        this._project.properties.imageWidth = this._imageWidthInput.valueAsNumber;
        this._project.properties.imageHeight = this._imageHeightInput.valueAsNumber;
        this._project.pageSetup.size = this._pageSizeSelect.value;

        const changeEvent = new Event('change');
        this.dispatchEvent(changeEvent);
    }
}