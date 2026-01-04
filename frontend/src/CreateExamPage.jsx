import {useState, useEffect, useCallback} from 'react'
import {FaFolderPlus} from 'react-icons/fa'

import AppConst from './services/AppConst';
import TableData from './data/TableData';
import appService from './services/AppService';

import TableContent from './TableContent';
import './CreateExamPage.css';

import DialogData from './data/DialogData';
import DocumentData from './data/DocumentData';
import AppUtils from './services/AppUtils';
import LoadingData from './data/LoadingData';

const CreateExamPage = ({useLoading, useDialog}) => {

    const [tableData, setTableData] = useState(null);

    const onCellClick = useCallback((rowIndex, colIndex) => {
        // Column 4 is View Document
        if (colIndex === 4) {
            const docs = appService.getUserDocs();
            if (rowIndex >= 0 && rowIndex < docs.length) {
                const doc = docs[rowIndex];
                let dialogData = DialogData.makeViewDocument(doc);
                useDialog(dialogData);
            }
        }

        // Column 6 is Delete Document
        if (colIndex === 6) {
            const docs = appService.getUserDocs();
            if (rowIndex >= 0 && rowIndex < docs.length) {
                const doc = docs[rowIndex];
                useDialog(DialogData.makeConfirmNotify(
                    "Do you want to remove document: " + doc.name + "!",
                    () => {
                        const loadingData = useLoading(LoadingData.makeLoading("Wait to delete your document!"));
                        appService.removeDoc(
                            doc.id,
                            () => {useLoading(LoadingData.makeNone(loadingData))}
                        );
                    }
                ));
            }
        }

    }, []);

    const onAddDocs = () => {
        useDialog(DialogData.makeAddDocument());
    }

    /**
     * 
     * @param {[DocumentData]} listDocData 
     * @returns 
     */
    const createTableDataFrom = (listDocData) => {
        let tableData = new TableData();

        tableData.numCols = 7; // 4 field show of doc and 2 process (delete, view) doc
        tableData.numRows = listDocData.length;
        tableData.headers = [
            "Document Id",
            "Document Name",
            "Created Time",
            "Document Tag",
            "View Document",
            "Make Exam",
            "Delete Document"
        ];
        tableData.widths = [
            "15%",
            "20%",
            "20%",
            "15%",
            "10%",
            "10%",
            "10%"
        ];
        tableData.dataTypes = [
            AppConst.TABLE_CONTENT_TYPE.TEXT,
            AppConst.TABLE_CONTENT_TYPE.TEXT,
            AppConst.TABLE_CONTENT_TYPE.TEXT,
            AppConst.TABLE_CONTENT_TYPE.TEXT,
            AppConst.TABLE_CONTENT_TYPE.ICON,
            AppConst.TABLE_CONTENT_TYPE.ICON,
            AppConst.TABLE_CONTENT_TYPE.ICON
        ];
        tableData.minHeight = 300;

        for (const docData of listDocData) {
            tableData.rowsData.push(
                [
                    docData.id,
                    docData.name,
                    AppUtils.getDateFrom(docData.createTime),
                    AppUtils.getDocumentTagNameBy(docData.tag),
                    AppConst.TABLE_ICON_TYPE.WATCH,
                    AppConst.TABLE_ICON_TYPE.MAKE_EXAM,
                    AppConst.TABLE_ICON_TYPE.DELETE
                ]
            );
        }

        return tableData;
    } 

    useEffect(() => {

        const listener = (subscribeType) => {
            switch (subscribeType) {
                case AppConst.SUBSCRIBE_TYPE.RELOAD_USER_DOCUMMENTS: {
                    const listDocData = appService.getUserDocs();
                    const tableData = createTableDataFrom(listDocData);
                    setTableData(tableData);
                    break;
                }
            }
        }

        appService.subscribe(listener);

        return () => {
            appService.unsubscribe(listener);
        }

    }, []);

    useEffect(() => {

        if (appService.getAppData().getAppState() !== AppConst.APP_STATE.IDLE) {
            return;
        }

        const loadingData = useLoading(LoadingData.makeLoading("Wait to loading your documents!"));

        (async () => {

            const listDocData = await appService.requestUserDocs();
            const tableData = createTableDataFrom(listDocData);
            setTableData(tableData);

            useLoading(LoadingData.makeNone(loadingData));

        })();

    }, []);

    return (
        <>
            <div className='create-exam-container'>
                <div
                    className="create-exam-header"
                >
                    <h1>
                        All documents
                    </h1>
                </div>
                {tableData !== null && (
                    <div
                        className='docs-exams-container'
                    >
                        <TableContent 
                            className='create-exam table-content'
                            tableData={tableData}
                            onCellClick={onCellClick}   
                        >
                            <div 
                                className='empty-docs'
                            >
                                <FaFolderPlus
                                    className='button-add-docs'
                                    onClick={() => {onAddDocs()}}
                                />
                                <label
                                    className='label-add-docs'
                                >
                                    You don't have any documents. please, add once!
                                </label>
                            </div>
                        </TableContent>
                    </div>
                )}
                {tableData && tableData.numRows > 0 && (
                    <div
                        className='create-exam-add-document-container'
                        onClick={() => {onAddDocs()}}
                    >
                        <FaFolderPlus 
                            className='button-add-docs-small'
                        />
                        <label
                            className='label-add-docs-small'
                        >
                            Add more document
                        </label>
                    </div>
                )}
            </div>
        </>
    )
}

export default CreateExamPage;