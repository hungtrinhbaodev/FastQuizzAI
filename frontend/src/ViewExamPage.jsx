import {useState, useEffect, use} from 'react'
import appService from './services/AppService';
import TableContent from './TableContent';
import ExamData from './data/ExamData';
import TableData from './data/TableData';
import AppConst from './services/AppConst';
import './ViewExamPage.css';
import AppUtils from './services/AppUtils';
import LoadingData from './data/LoadingData';
import EmptyTableData from './EmptyTableData';
import DialogData from './data/DialogData';
import ButtonWithIcon from './ButtonWithIcon';


const ViewExamPage = ({useLoading, useDialog, changePage}) => {

    const [tableData, setTableData] = useState(null);

    /**
     * 
     * @param {[ExamData]} examsData 
     * @return {TableData}
     */
    const makeTableExamData = (examsData) => {

        let tableData = new TableData();
        
        tableData.numCols = 6;
        tableData.numRows = examsData.length;

        tableData.dataTypes = [
            AppConst.TABLE_CONTENT_TYPE.TEXT,
            AppConst.TABLE_CONTENT_TYPE.TEXT,
            AppConst.TABLE_CONTENT_TYPE.TEXT,
            AppConst.TABLE_CONTENT_TYPE.MULIT_TEXT,
            AppConst.TABLE_CONTENT_TYPE.ICON,
            AppConst.TABLE_CONTENT_TYPE.ICON,
        ];

        tableData.headers = [
            "Exam name",
            "Number question",
            "Exam duration",
            "Documents used",
            "Do exam",
            "Delete exam"
        ];


        tableData.widths = [
            "20%",
            "10%",
            "15%",
            "25%",
            "15%",
            "15%"
        ];

        tableData.minHeight = 300;

        tableData.rowsData = examsData.map((examData) => {
            return [
                examData.name,
                examData.numberQuestion,
                AppUtils.convertMiliInToMinutes(examData.duration) + " minutes",
                examData.docIds.map((docId) => {
                    const docData = appService.getDocBy(docId);
                    let docName = docData ? docData.name : "Unknown document";
                    return AppUtils.clipText(docName, 30);
                }),
                AppConst.ICON_TYPE.WATCH,
                AppConst.ICON_TYPE.DELETE
            ];
        });

        return tableData;
    }

    const onNotifyAddDocumentFirst = () => {
        useDialog(DialogData.makeConfirmNotify(
            "You don't have any document, please add once first!",
            () => {
                changePage("create_exam");
                useDialog(DialogData.makeAddDocument());
            }
        ));
    }

    const addExam = () => {
        const userDocs = appService.getUserDocs();
        if (userDocs === null) {
            const loadingData = useLoading(LoadingData.makeLoading("Wait to process your request!"));
            (() => {
                userDocs = appService.requestUserDocs();
                useLoading(LoadingData.makeNone(loadingData));

                if (userDocs.length <= 0) {
                    onNotifyAddDocumentFirst();
                }
                else {
                    useDialog(DialogData.makeAddExam());
                }
            })();
            return;
        }
        else {
            if (userDocs.length <= 0) {
                onNotifyAddDocumentFirst();
            }
            else{
                useDialog(DialogData.makeAddExam());
            }
        }
    }


    const onCellClick = (rowIndex, colIndex) => {
        if (colIndex === 5) {
            const examsData = appService.getUserExams();
            const examData = examsData[rowIndex];

            useDialog(DialogData.makeConfirmNotify(
                "Do you want to remove exam: " + examData.name + "!",
                () => {
                    const loadingData = useLoading(LoadingData.makeLoading("Wait to delete your exam!"));
                    appService.removeExam(
                        examData.id,
                        () => {useLoading(LoadingData.makeNone(loadingData))}
                    );
                }
            ));
        }
    }

    useEffect(() => {

        const listener = (subscribeType) => {
            switch (subscribeType) {
                case AppConst.SUBSCRIBE_TYPE.RELOAD_USER_EXAMS: {
                    setTableData(makeTableExamData(appService.getUserExams()));
                    break;
                }
                default: {
                    break;
                }
            }
        };

        appService.subscribe(listener);

        return () => {
            appService.unsubscribe(AppConst.SUBSCRIBE_TYPE.RELOAD_EXAMS);
        }

    }, []);

    useEffect(() => {
        
        const loadingData = useLoading(LoadingData.makeLoading("Wait to create your exams!"));

        (async () => {

            const examsData = await appService.requestExams();
            setTableData(makeTableExamData(examsData));

            useLoading(LoadingData.makeNone(loadingData));

        })();

    }, []);


    return (
        <div
            className='view-exam-page-container base-page-container'
        >
            <h1
                className='view-exam-page-title'
            >
                All exams
            </h1>
            <div
                className='view-exam-page-table-exams-container'
            >
                {tableData && (
                    <TableContent
                        tableData={tableData}
                        onCellClick={onCellClick}
                    > 
                        <EmptyTableData
                            onClick={addExam}
                            text={"You don't have any exams. please, create once!"}
                        />
                    </TableContent>
                )}
            </div>
            {tableData && tableData.numRows > 0 && (
                <ButtonWithIcon
                    iconType={AppConst.ICON_TYPE.ADD_FOLDER}
                    text={"Add exams"}
                    onClick={addExam}
                />
            )}
        </div>
    );

}

export default ViewExamPage;