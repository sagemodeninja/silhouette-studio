import { Builder, Parser } from 'xml2js';
import { Properties } from './properties';
import { PageSetup } from './page-setup';

export class Project extends EventTarget {
    private _fileHandle: any;
    private _local: boolean;

    public title: string;
    public source: string;
    public properties: Properties;

    /**
     * Configurations for the working page or area.
     */
    public pageSetup: PageSetup = new PageSetup();

    constructor() {
        super();
    }

    public open(handle: any) {
        const ext = handle[0].name.split('.').pop();
        this._fileHandle = handle[0];

        if(ext == 'studio4')
            this.parseSaveFile();
        else
            this.parseImage();
    }

    private async parseSaveFile() {
        const file = await this._fileHandle.getFile();
        const xml = await file.text();

        const parser = new Parser({explicitArray: false});
        parser.parseString(xml, (err, result) => {
            if (err) {
                console.error(err);
                return;
            }

            const root = result.root;
            const properties = root.properties;
            const pageSetup = root.pageSetup;

            this.title = root.title;
            this.source = root.source;
            this.properties = {
                imageWidth: parseFloat(properties.imageWidth),
                imageHeight: parseFloat(properties.imageHeight),
                exportResolution: parseFloat(properties.exportResolution),
                showCutBorder: properties.showCutBorder
            };
            this.pageSetup = {
                size: pageSetup.size,
                orientation: parseInt(pageSetup.orientation),
                pixelPerInch: parseInt(pageSetup.pixelPerInch)
            };

            this._local = true;
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
                exportResolution: 300,
                showCutBorder: true
            };

            this._local = false;
            this.loaded();
        }
        
        reader.readAsDataURL(file);
    }

    private loaded() {
        const event = new Event('load');
        this.dispatchEvent(event);
    }

    public async save() {
        const builder = new Builder();
        const xml = builder.buildObject(this);

        if (!this._local)
        {
            const options = {
                types: [
                    {
                        description: 'Silhouette Studio Tool Project',
                        accept: {
                            'application/octet-stream': ['.studio4']
                        }
                    },
                ],
            };
            this._fileHandle = await window.showSaveFilePicker(options);
        }

        const writable = await this._fileHandle.createWritable();
        const file = new Blob([xml], {type: 'text/xml;charset=utf-8'});

        await writable.write(file)
        await writable.close();
        
        this._local = true;
    }
}

declare const window: Window &
typeof globalThis & {
    showSaveFilePicker: any
}