export type RepeatOptions = {
    clientWidth: number;
    clientHeight: number;
    width: number;
    height: number;
    minumumSpace: number;
}

export class RepeatUtility {
    public calculate(options: RepeatOptions) {
        const minumumSpace = options.minumumSpace;
        const columnCount = options.clientWidth / (options.width + minumumSpace);
        const rowCount = options.clientHeight / (options.height + minumumSpace);
        
        const availableWidth = options.clientWidth - (options.width * columnCount);
        const availableHeight = options.clientHeight - (options.height * rowCount);

        const horizontalSpace = availableWidth / (columnCount + 1);
        const verticalSpace = availableHeight / (rowCount + 1);
    }
}