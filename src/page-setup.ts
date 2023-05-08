import { Paper, papers } from './paper';

export enum PageOrientation {
    Portrait,
    Landscape
}

export class PageSetup {
    /**
     * Identifier of page size used in the setup.
     * 
     * @example
     * ISO 216 page sizes such as A4 or A5.
     */
    size: string;

    /**
     * The orientation of the page.
     * 
     * @defaultValue `PageOrientation.Portrait`
     */
    orientation: PageOrientation = PageOrientation.Portrait;

    /**
     * Resolution of the canvas.
     * 
     * @defaultValue `300`
     */
    pixelPerInch: number = 300;

    /**
     * Gets a deafult setup.
     * 
     * @remarks
     * The default setup uses the first paper defined in the configuration.
     */
    static get default(): PageSetup {
        return new PageSetup(papers[0].id);
    }

    /**
     * Gets the paper definition of setup.
     */
    public get paper(): Paper {
        return Array.from(papers).find(p => p.id === this.size);
    }

    /**
     * Creates an instance of PageSetup.
     * 
     * @param size Identifier of page size used in the setup.
     */
    constructor(size: string) {
        this.size = size;
    }
}