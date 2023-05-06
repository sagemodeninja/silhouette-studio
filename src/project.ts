import { Builder, Parser } from 'xml2js';
import { saveAs } from 'file-saver';
import { Properties } from './properties';

export class Project extends EventTarget {
    public title: string;
    public source: string;
    public properties: Properties;

    constructor() {
        super();
    }

    public open(file: File) {
        const ext = file.name.split('.').pop();

        if(ext != 'studio4')
        {
            this.parseImage(file);
            return;
        }

        this.parseSaveFile(file);
    }

    private parseSaveFile(file: File) {
        const parser = new Parser({explicitArray: false});
        const reader = new FileReader();

        reader.onload = () => {
            const xml = reader.result;

            parser.parseString(xml, (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }

                const root = result.root;

                this.title = root.title;
                this.source = root.source;
                this.properties = {
                    imageWidth: parseFloat(root.properties.imageWidth),
                    imageHeight: parseFloat(root.properties.imageHeight),
                    exportResolution: parseFloat(root.properties.exportResolution),
                }

                this.loaded();
            });
        }

        reader.readAsText(file);
    }

    private parseImage(file: File) {
        const reader = new FileReader();

        reader.onload = () => {
            this.title = file.name.split('.')[0];
            this.source = reader.result.toString();
            this.properties = {
                imageWidth: 1,
                imageHeight: 1,
                exportResolution: 300
            };

            this.loaded();
        }

        reader.readAsDataURL(file);
    }

    private loaded() {
        const event = new Event('load');
        this.dispatchEvent(event);
    }

    public save() {
        const builder = new Builder();
        const xml = builder.buildObject(this);

        const file = new Blob([xml], {type: 'text/xml;charset=utf-8'});
        saveAs(file, `${this.title}.studio4`);
    }
}