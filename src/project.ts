import { Builder, Parser } from 'xml2js';
import { Properties } from './properties';
import { PageSetup } from './page-setup';
import { imageFileOptions, projectFileOptions } from './file-options';
import { ChangeTracker } from './change-tracker';

export class Project extends EventTarget {
    private _fileHandle: any;
    private _local: boolean;

    public title: string;
    /**
     * The media source.
     */
    public source: string;
    /**
     * Properties that affects the state of the project.
     */
    public properties: Properties;
    /**
     * Configurations for the working page or area.
     */
    public pageSetup: PageSetup;
    
    public changeTracker: ChangeTracker;
    public saved: boolean;

    constructor() {
        super();

        this.pageSetup = PageSetup.default;
        this.changeTracker = new ChangeTracker();

        this.addEventListeners();
    }

    public async open(type: string) {
        const options = type === 'project' ? projectFileOptions : imageFileOptions;

        [this._fileHandle] = await window.showOpenFilePicker(options);
        const ext = this._fileHandle.name.split('.').pop();

        if(ext == 'studio4')
            this.parseSaveFile();
        else
            this.parseImage();
    }

    public async save() {
        const options = {rootName:'project'};
        const builder = new Builder(options);
        const content = {
            title: this.title,
            source: this.source,
            properties: this.properties,
            pageSetup: this.pageSetup
        };

        if (!this._local)
            this._fileHandle = await window.showSaveFilePicker(projectFileOptions);

        const writable = await this._fileHandle.createWritable();
        const xml = builder.buildObject(content);
        const file = new Blob([xml], {type: 'text/xml;charset=utf-8'});

        await writable.write(file)
        await writable.close();
        
        this._local = true;
        this.saved = true;
        this.changeTracker.notify('save_state');
    }

    public export() {
        // Not implemented!
    }

    private addEventListeners() {
        this.changeTracker.subscribe(prop => {
            if (prop === 'save_state')
                return;

            this.saved = false;
            this.changeTracker.notify('save_state');
        });
    }

    private async parseSaveFile() {
        const file = await this._fileHandle.getFile();
        const xml = await file.text();
        const parser = new Parser({
            explicitArray: false,
            explicitRoot: false,
        });

        parser.parseString(xml, (err, result) => {
            if (err) {
                console.error(err);
                return;
            }

            const properties = result.properties;
            const pageSetup = result.pageSetup;

            this.title = result.title;
            this.source = result.source;
            this.properties = {
                imageWidth: parseFloat(properties.imageWidth),
                imageHeight: parseFloat(properties.imageHeight),
                minSpacing: parseFloat(properties.minSpacing),
                showCutBorder: properties.showCutBorder,
            };
            this.pageSetup = new PageSetup(pageSetup.size);
            this.pageSetup.orientation = pageSetup.orientation;
            this.pageSetup.pixelPerInch = pageSetup.pixelPerInch;

            this._local = true;
            this.saved = true;
            this.changeTracker.notify('save_state');
            this.loaded();
        });
    }

    private async parseImage() {
        const file = await this._fileHandle.getFile();
        const reader = new FileReader();

        reader.onload = () => {
            this.title = this._fileHandle.name.split('.')[0];
            this.source = reader.result.toString();
            this.properties = {
                imageWidth: 1,
                imageHeight: 1,
                minSpacing: 0.1,
                showCutBorder: true
            };

            this._local = false;
            this.saved = false;
            this.changeTracker.notify('save_state');
            this.loaded();
        }
        
        reader.readAsDataURL(file);
    }

    private loaded() {
        const event = new Event('load');
        this.dispatchEvent(event);
    }
}

// TODO: Remove if official support comes.
declare const window: Window &
typeof globalThis & {
    showOpenFilePicker: any,
    showSaveFilePicker: any,
}