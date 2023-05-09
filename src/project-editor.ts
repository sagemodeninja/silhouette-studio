import {
    NumberField, 
    Select,
    fluentAccordion,
    fluentAccordionItem,
    fluentCheckbox,
    fluentDivider,
    fluentNumberField, 
    fluentOption, 
    fluentSelect, 
    provideFluentDesignSystem
} from '@fluentui/web-components';
import { Project } from './project';
import { Checkbox, ListboxOption } from '@microsoft/fast-foundation';
import { papers } from './paper';

provideFluentDesignSystem()
    .register(
        fluentDivider(),
        fluentAccordion(),
        fluentAccordionItem(),
        fluentNumberField(),
        fluentSelect(),
        fluentOption(),
        fluentCheckbox()
    );

export class ProjectEditor {
    private _project: Project;
    private _loaded: boolean;

    private _imageWidthInput: NumberField;
    private _imageHeightInput: NumberField;
    private _minSpaceInput: NumberField;
    private _pageSizeSelect: Select;
    private _pageOrientationSelect: Select;
    private _resolutionInput: NumberField;
    private _showCutBorderCheck: Checkbox;

    constructor() {
        this._imageWidthInput = document.getElementById('width_input') as NumberField;
        this._imageHeightInput = document.getElementById('height_input') as NumberField;
        this._minSpaceInput = document.getElementById('min_space_input') as NumberField;
        this._pageSizeSelect = document.getElementById('page_size_select') as Select;
        this._pageOrientationSelect = document.getElementById('page_orientation_select') as Select;
        this._resolutionInput = document.getElementById('resolution_input') as NumberField;
        this._showCutBorderCheck = document.getElementById('cut_border_check') as Checkbox;

        this.setup();
        this.addEventListeners();
    }

    public register(project: Project) {
        const properties = project.properties;
        const pageSetup = project.pageSetup;

        this._loaded = false;

        this._project = project;
        this._imageWidthInput.valueAsNumber = properties.imageWidth;
        this._imageHeightInput.valueAsNumber = properties.imageHeight;
        this._minSpaceInput.valueAsNumber = properties.minSpacing;
        this._pageSizeSelect.value = pageSetup.size;
        this._pageOrientationSelect.value = pageSetup.orientation.toString();
        this._resolutionInput.valueAsNumber = pageSetup.pixelPerInch;
        this._showCutBorderCheck.checked = properties.showCutBorder;
        
        this._loaded = true;
    }

    private setup() {
        papers.forEach(paper => {
            const text = `${paper.id} (${paper.imperial.width} x ${paper.imperial.height} in)`;
            const option = new ListboxOption(text, paper.id);

            this._pageSizeSelect.appendChild(option);
        });
    }

    private addEventListeners() {
        this._imageWidthInput.addEventListener('input', () => this.update('properties'));
        this._imageHeightInput.addEventListener('input', () => this.update('properties'));
        this._minSpaceInput.addEventListener('input', () => this.update('properties'));
        this._pageSizeSelect.addEventListener('change', () => this.update('page_setup'));
        this._pageOrientationSelect.addEventListener('change', () => this.update('page_setup'));
        this._resolutionInput.addEventListener('input', () => this.update('page_setup'));
        this._showCutBorderCheck.addEventListener('change', () => this.update('page_setup'));
    }

    private update(property: string) {
        if (!this._loaded)
            return;
        
        this._project.properties.imageWidth = this._imageWidthInput.valueAsNumber;
        this._project.properties.imageHeight = this._imageHeightInput.valueAsNumber;
        this._project.properties.minSpacing = this._minSpaceInput.valueAsNumber;
        this._project.properties.showCutBorder = this._showCutBorderCheck.checked;
        this._project.pageSetup.size = this._pageSizeSelect.value;
        this._project.pageSetup.orientation = parseInt(this._pageOrientationSelect.value);
        this._project.pageSetup.pixelPerInch = this._resolutionInput.valueAsNumber;

        this._project.changeTracker.notify(property);
    }
}