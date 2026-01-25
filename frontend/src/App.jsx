import { useState, useEffect, useCallback, use } from 'react';

import appService from './services/AppService';
import AppConst from './services/AppConst';
import DialogData from './data/DialogData';

import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Dialog from './Dialog';
import CreateAccount from './CreateAccount';
import CreateExamPage from './CreateExamPage';

import './App.css';
import './Base.css';
import AddDocument from './AddDocument';
import Loading from './Loading';
import LoadingData from './data/LoadingData';
import ViewDocument from './ViewDocument';
import ConfirmNotify from './ConfirmNotify';
import AddExam from './AddExam';
import ViewExamPage from './ViewExamPage';
import ExamingPage from './ExamingPage';
import AppUtils from './services/AppUtils';
import ExamHistoriesPage from './ExamHistoriesPage';
import ExamHistoryDetail from './ExamHistoryDetail';

function App() {
  const [dialogData, setDialogData] = useState(DialogData.makeNone());
  const [loadingData, setLoadingData] = useState(LoadingData.makeNone());
  const [examingData, setExamingData] = useState(null);

  const [page, setPage] = useState('');

  const useLoading = (loadingData) => {
    setLoadingData(loadingData);
    return loadingData;
  };

  const useDialog = (dialogData) => {
    console.log('useDialog dialogData', dialogData);
    setDialogData(dialogData);
    return dialogData;
  };

  const closeDialog = () => {
    console.log('closeDialog dialogData', dialogData);
    setDialogData(DialogData.makeNone(dialogData));
  };

  useEffect(() => {
    appService.login(() => {
      let appData = appService.getAppData();
      switch (appData.getAppState()) {
        case AppConst.APP_STATE.NO_LOGIN: {
          setDialogData(DialogData.makeCreateAccount());
          onPageSelected('create_exam');
          break;
        }
        case AppConst.APP_STATE.EXEMING: {
          setExamingData(appService.getExamingData());
          onPageSelected('examing');
          break;
        }
        default: {
          if (AppConst.DEV_MODE) {
            // TODO: test here
            // setDialogData(DialogData.makeAddExam());
          }
          onPageSelected('create_exam');
          break;
        }
      }
    });

    const intervalPing = setInterval(() => {
      appService.sendPing();
    }, 3000);

    return () => {
      clearInterval(intervalPing);
    };
  }, []);

  const onPageSelected = useCallback((page) => {
    setPage(page);
  });

  const onDialogResize = useCallback((width, height) => {
    setDialogData((prev) => {
      if (prev.width === width && prev.height === height) return prev;
      return prev.copyWithSize(width, height);
    });
  }, []);

  const onDoExam = (examId) => {
    (async () => {
      const loadingData = useLoading(
        LoadingData.makeLoading('Wait to make your exam')
      );
      appService.requestDoExam(examId, () => {
        setExamingData(appService.getExamingData());
        useLoading(LoadingData.makeNone(loadingData));
        onPageSelected('examing');
      });
    })();
  };

  const openDialogExamPoint = (examId, examPoint) => {
    let examName = '';
    const examData = appService.getExamBy(examId);
    if (examData) {
      examName = examData.name;
    }
    const examPointStr = AppUtils.getFloatPoint(examPoint);
    useDialog(
      DialogData.makeConfirmNotify(
        `You are finish exam ${examName} with ${examPointStr} points!`
      )
    );
  };

  const onFinishExam = () => {
    appService.submitExam((examHistory) => {
      setExamingData(null);

      const loadingData = useLoading(
        LoadingData.makeLoading('Wait to loading your exam result!')
      );
      const exams = appService.getUserExams();
      if (!exams) {
        const listener = (subscribeType) => {
          switch (subscribeType) {
            case AppConst.SUBSCRIBE_TYPE.RELOAD_USER_EXAMS: {
              appService.unsubscribe(listener);
              openDialogExamPoint(examHistory.examId, examHistory.examPoint);
              onPageSelected('exam_history');
              useLoading(LoadingData.makeNone(loadingData));
              break;
            }
            default: {
              break;
            }
          }
          appService.subscribe(listener);
          appService.requestExams();
        };
      } else {
        openDialogExamPoint(examHistory.examId, examHistory.examPoint);
        onPageSelected('exam_history');
        useLoading(LoadingData.makeNone(loadingData));
      }
    });
  };

  return (
    <>
      <Loading loadingData={loadingData} />

      <Dialog
        dialogData={dialogData}
        onClose={() => {
          closeDialog();
        }}
      >
        {dialogData.isUsageAt(AppConst.DIALOG_USAGE.CREATE_EXAM) && (
          <>
            <p>
              You are about to start the <b>Civil Law Quiz</b>. You have 30
              minutes.
            </p>
            <button className="confirm-btn">Go!</button>
          </>
        )}
        {dialogData.isUsageAt(AppConst.DIALOG_USAGE.CREATE_ACCOUNT) && (
          <CreateAccount
            onResize={onDialogResize}
            onSuccess={() => setDialogData(DialogData.makeNone())}
          />
        )}
        {dialogData.isUsageAt(AppConst.DIALOG_USAGE.ADD_DOCUMENT) && (
          <AddDocument
            useDialog={useDialog}
            closeDialog={closeDialog}
            useLoading={useLoading}
          />
        )}
        {dialogData.isUsageAt(AppConst.DIALOG_USAGE.VIEW_DOCUMENT) &&
          dialogData.extraData !== null && (
            <ViewDocument docPath={dialogData.extraData.link} />
          )}
        {dialogData.isUsageAt(AppConst.DIALOG_USAGE.CONFIRM_NOTIFY) &&
          dialogData.extraData !== null && (
            <ConfirmNotify dialogData={dialogData} closeDialog={closeDialog} />
          )}
        {dialogData.isUsageAt(AppConst.DIALOG_USAGE.ADD_EXAM) &&
          dialogData.extraData !== null && (
            <AddExam
              defaultDocIds={dialogData.extraData}
              useLoading={useLoading}
              useDialog={useDialog}
              closeDialog={closeDialog}
            />
          )}
        {dialogData.isUsageAt(AppConst.DIALOG_USAGE.VIEW_HISTORY_DETAIL) &&
          dialogData.extraData !== null && (
            <ExamHistoryDetail
              historyData={dialogData.extraData.historyData}
              examDetail={dialogData.extraData.examDetailData}
            />
          )}
      </Dialog>

      <Header />
      <div className="main-pages">
        <Sidebar
          onSelect={onPageSelected}
          currentId={page}
          useDialog={useDialog}
        />
        {appService.getAppData().getAppState() === AppConst.APP_STATE.IDLE &&
          page === 'create_exam' && (
            <CreateExamPage useLoading={useLoading} useDialog={useDialog} />
          )}
        {appService.getAppData().getAppState() === AppConst.APP_STATE.IDLE &&
          page === 'view_exam' && (
            <ViewExamPage
              useDialog={useDialog}
              useLoading={useLoading}
              changePage={onPageSelected}
              doExam={onDoExam}
            />
          )}
        {appService.getAppData().getAppState() === AppConst.APP_STATE.IDLE &&
          page === 'exam_history' && (
            <ExamHistoriesPage
              useDialog={useDialog}
              useLoading={useLoading}
              closeDialog={closeDialog}
            />
          )}
        {appService.getAppData().getAppState() === AppConst.APP_STATE.EXEMING &&
          examingData && (
            <ExamingPage
              iExamingData={examingData}
              useDialog={useDialog}
              closeDialog={closeDialog}
              onFinishExam={() => {
                onFinishExam();
              }}
            />
          )}
      </div>
      <Footer />
    </>
  );
}

export default App;
