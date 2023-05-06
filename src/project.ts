import { SourceImage } from './source-image';
import { Builder, Parser } from 'xml2js';
import { saveAs } from 'file-saver';

export class Project {
    public source: SourceImage;

    constructor(file: File) {
        this.openFile(file);

        this.source = new SourceImage();
        this.source.data = 'sample';
        this.source.width = 1.5;
        this.source.height = 1;
    }

    private openFile(file: File) {
        const ext = file.name.split('.').pop();
        if (ext === 'studio4')
        {
            const parser = new Parser({explicitArray: false});
            const reader = new FileReader();

            reader.onload = (event) => {
                const xml = event.target.result;

                parser.parseString(xml, (err, result) => {
                    if (err) {
                        console.error(err);
                    } else {
                        const json = JSON.stringify(result);
                        console.log(result);
                        console.log(json);
                    }
                });
            }

            reader.readAsText(file);
            return;
        }
    }

    public save() {
        const builder = new Builder();
        const xml = builder.buildObject(this);

        const file = new Blob([xml], {type: 'text/xml;charset=utf-8'});
        saveAs(file, 'myFile.xml');
    }
}