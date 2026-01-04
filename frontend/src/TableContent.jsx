import React from 'react';
import AppConst from './services/AppConst';
import './TableContent.css';
import {FaFileMedicalAlt, FaTrashAlt, FaRegAddressBook} from 'react-icons/fa'

const TableContent = ({tableData, onCellClick, children}) => {

    const getBorderStyles = (colIndex, rowIndex, numCols, numRows, minHeight) => {
        let stypes = {};

        rowIndex <= -1 && (stypes['borderTop'] = '0px');
        rowIndex <= -1 && colIndex <= 0 && (stypes['borderTopLeftRadius'] = '10px');
        rowIndex <= -1 && colIndex >= numCols - 1 && (stypes['borderTopRightRadius'] = '10px');
        
        rowIndex >= numRows - 1 && (stypes['borderBottom'] = '0px');
        colIndex <= 0 && (stypes['borderLeft'] = '0px');
        colIndex >= numCols - 1 && (stypes['borderRight'] = '0px');

        rowIndex >= numRows - 1 && numRows > 0 && colIndex <= 0 && (stypes['borderBottomLeftRadius'] = '11px');
        rowIndex >= numRows - 1 && numRows > 0 &&colIndex >= numCols - 1 && (stypes['borderBottomRightRadius'] = '11px');

        // Fix excase when table data does not have any data
        if (numRows <= 0 && minHeight <= 0) {
            // and table don't have min height to extend element noti empty
            rowIndex <= -1 && colIndex <= 0 && (stypes['borderBottomLeftRadius'] = '10px');
            rowIndex <= -1 && colIndex >= numCols - 1 && (stypes['borderBottomRightRadius'] = '10px');
        }

        return stypes;
    }

    const getBackgroundStyles = (colIndex) => {
        let stypes = {};
        stypes['backgroundColor'] = colIndex % 2 == 0 ? "#FFFFFF" : "#4F4F4F30";
        return stypes;
    }

    const getTableContaierStyles = (minHeight, numRows) => {
        let styles = {};
        if (minHeight > 0 && numRows <= 0) {
            styles['minHeight'] = minHeight + 'px';
        }
        return styles;
    }

    return (
        <>
            <div 
                className='table-content-container'
                style={{
                    ...getTableContaierStyles(tableData.minHeight, tableData.numRows)
                }}
            >
                <div className='table-content-header'>
                    {tableData.headers.map((header, index) => (
                        index < tableData.numCols && (<div 
                            key={index} 
                            className='header-cell table-cell'
                            style={{
                                ...getBorderStyles(
                                    index, -1, tableData.numCols, tableData.numRows, tableData.minHeight 
                                ),
                                width: tableData.widths[index]
                            }}
                        >
                            {header}
                        </div>)
                    ))}
                </div>
                <div className='table-content-data'>
                    {tableData.rowsData.map((rowData, rowIndex) => (
                        rowIndex < tableData.numRows && (
                            <div 
                                className='table-row-data'
                                key={rowIndex} 
                            >
                                {rowData.map((cellData, colIndex) => (
                                    <React.Fragment key={colIndex}>
                                        {colIndex < tableData.numCols && tableData.dataTypes[colIndex] === AppConst.TABLE_CONTENT_TYPE.TEXT && (
                                            <div 
                                                className='table-data-text table-cell'
                                                style={{
                                                    ...getBackgroundStyles(colIndex),
                                                    ...getBorderStyles(colIndex, rowIndex, tableData.numCols, tableData.numRows, tableData.minHeight),
                                                    width: tableData.widths[colIndex] 
                                                }}
                                            >
                                                {cellData}
                                            </div>)
                                        }
                                        {colIndex < tableData.numCols && tableData.dataTypes[colIndex] === AppConst.TABLE_CONTENT_TYPE.ICON && (
                                            <div 
                                                className='table-data-icon table-cell'
                                                style={{
                                                    ...getBackgroundStyles(colIndex),
                                                    ...getBorderStyles(colIndex, rowIndex, tableData.numCols, tableData.numRows, tableData.minHeight),
                                                    width: tableData.widths[colIndex]
                                                }}
                                                onClick={() => {onCellClick && onCellClick(rowIndex, colIndex)}}
                                            >
                                                {cellData === AppConst.TABLE_ICON_TYPE.WATCH && (
                                                    <FaFileMedicalAlt
                                                        className='table-icon'
                                                    />
                                                )}
                                                {cellData === AppConst.TABLE_ICON_TYPE.DELETE && (
                                                    <FaTrashAlt
                                                        className='table-icon'
                                                    />
                                                )}
                                                {cellData === AppConst.TABLE_ICON_TYPE.MAKE_EXAM && (
                                                    <FaRegAddressBook
                                                        className='table-icon'
                                                    />
                                                )}
                                            </div>)
                                        }
                                    </React.Fragment>
                                ))}
                            </div>
                        )
                    ))}
                    {tableData.numRows <= 0 && tableData.minHeight > 0 && children && (
                        (children)
                    )}
                </div>
            </div>
        </>
     );
}

export default TableContent;