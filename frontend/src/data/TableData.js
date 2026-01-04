class TableData {

    constructor() {

        // number row and cols
        this.numRows = 0;
        this.numCols = 0;

        // header of columns
        this.headers = [];

        // type of data per row
        this.dataTypes = [];

        // 2D array content data 
        this.rowsData = [];

        // width config percent width of cell on row 
        this.widths = [];

        // min height for table that dose not have any content
        this.minHeight = 0;
    }

}

export default TableData;