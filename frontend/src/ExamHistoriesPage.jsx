import { useState, useEffect } from 'react';
import TableData from './data/TableData';
import AppConst from './services/AppConst';
import appService from './services/AppService';
import './ExamHistoriesPage.css';
import EmptyTableData from './EmptyTableData';
import TableContent from './TableContent';
import AppUtils from './services/AppUtils';
import LoadingData from './data/LoadingData';
import DialogData from './data/DialogData';

const ExamHistoriesPage = ({ useLoading, useDialog, closeDialog }) => {
  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    const loadingData = useLoading(
      LoadingData.makeLoading('Wait to loading your exam history!')
    );

    const listener = (subscribeType) => {
      switch (subscribeType) {
        case AppConst.SUBSCRIBE_TYPE.RELOAD_USER_EXAM_HISTORY: {
          const examsData = appService.getUserExams();
          if (examsData === null) {
            appService.requestExams();
            break;
          }
          const examHistoriesData = appService.getHistoriesData();
          const tableData = makeTableExamHistoriesData(examHistoriesData);
          setTableData(tableData);
          useLoading(LoadingData.makeNone(loadingData));
          break;
        }
        case AppConst.SUBSCRIBE_TYPE.RELOAD_USER_EXAMS: {
          const examHistoriesData = appService.getHistoriesData();
          const tableData = makeTableExamHistoriesData(examHistoriesData);
          setTableData(tableData);
          useLoading(LoadingData.makeNone(loadingData));
          break;
        }
        default: {
          break;
        }
      }
    };

    appService.subscribe(listener);
    const historiesData = appService.getHistoriesData();
    console.log('historiesData', historiesData);
    if (historiesData === null) {
      appService.requestHistoriesData();
    } else {
      setTableData(makeTableExamHistoriesData(historiesData));
      useLoading(LoadingData.makeNone(loadingData));
    }

    return () => {
      appService.unsubscribe(listener);
    };
  }, []);

  const makeTableExamHistoriesData = (examHistoriesData) => {
    let tableData = new TableData();
    tableData.numCols = 8;
    tableData.headers = [
      'Exam name',
      'Doing date',
      'Doing time',
      'Number questions',
      'Correct answers',
      'Point',
      'View detail',
      'Delete history'
    ];
    tableData.dataTypes = [
      AppConst.TABLE_CONTENT_TYPE.TEXT,
      AppConst.TABLE_CONTENT_TYPE.TEXT,
      AppConst.TABLE_CONTENT_TYPE.TEXT,
      AppConst.TABLE_CONTENT_TYPE.TEXT,
      AppConst.TABLE_CONTENT_TYPE.TEXT,
      AppConst.TABLE_CONTENT_TYPE.TEXT,
      AppConst.TABLE_CONTENT_TYPE.ICON,
      AppConst.TABLE_CONTENT_TYPE.ICON
    ];
    tableData.widths = ['20%', '20%', '10%', '10%', '10%', '10%', '10%', '10%'];
    tableData.rowsData = [];
    for (const historyData of examHistoriesData) {
      const examData = appService.getExamBy(historyData.examId);
      const examName = examData ? examData.name : 'Unknown exam';
      const numberQuestion = examData ? examData.numberQuestion : 0;
      tableData.rowsData.push([
        examName,
        AppUtils.getDateFrom(historyData.examStartTime),
        AppUtils.convertMiliToTimeString(historyData.examDoingTime),
        numberQuestion,
        historyData.correctAnswer,
        AppUtils.getFloatPoint(historyData.examPoint),
        AppConst.ICON_TYPE.WATCH,
        AppConst.ICON_TYPE.DELETE
      ]);
    }
    tableData.minHeight = 300;
    tableData.numRows = tableData.rowsData.length;

    return tableData;
  };

  const onCellClick = (rowIndex, colIndex) => {
    const historiesData = appService.getHistoriesData();

    if (colIndex === 6) {
      const loadingData = useLoading(
        LoadingData.makeLoading('Wait to loading exam history detail!')
      );
      const historyData = historiesData[rowIndex];
      appService.requestExamHistoryDetail(
        historyData.id,
        (examDetail, historyData) => {
          useLoading(LoadingData.makeNone(loadingData));
          useDialog(DialogData.makeViewHistoryDetail(historyData, examDetail));
        }
      );
    }
    // 7 is column delete
    if (colIndex === 7) {
      const historyData = historiesData[rowIndex];
      const examData = appService.getExamBy(historyData.examId);
      const examName = examData ? examData.name : 'Unknown exam';
      const msg = `Do you want to remove history exam ${examName}`;
      useDialog(
        DialogData.makeConfirmNotify(msg, () => {
          const loadingData = useLoading(
            LoadingData.makeLoading('Wait to remove exam history')
          );

          console.log('historyData', historyData);
          appService.removeHistoryExam(historyData.id, () => {
            useDialog(DialogData.makeConfirmNotify('Delete history success!'));
            useLoading(LoadingData.makeNone(loadingData));
          });
        })
      );
    }
  };

  return (
    <div className="exam-histories-page-container base-page-container">
      <h1 className="exam-history-page-title">Exam histories</h1>
      {tableData !== null && (
        <TableContent tableData={tableData} onCellClick={onCellClick}>
          <EmptyTableData
            text={"You don't have any exam history, please try one"}
            onClick={() => {}}
          />
        </TableContent>
      )}
    </div>
  );
};

export default ExamHistoriesPage;
