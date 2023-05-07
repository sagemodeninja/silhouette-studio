enum PageOrientation {
    Portrait,
    Landscape
}

export class PageSetup {
    /**
     * Identifier of page size used in the setup.
     * 
     * @defaultValue `A4`
     * @example
     * ISO 216 page sizes such as A4 or A5.
     */
    size: string = 'A4';

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
}