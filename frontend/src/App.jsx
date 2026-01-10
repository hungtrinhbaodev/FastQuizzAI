import { useState, useEffect, useCallback } from 'react';

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

function App() {

  const [dialogData, setDialogData] = useState(DialogData.makeNone());
  const [loadingData, setLoadingData] = useState(LoadingData.makeNone());
  const [page, setPage] = useState("");

  const useLoading = (loadingData) => {
    setLoadingData(loadingData);
    return loadingData;
  }

  const useDialog = (dialogData) => {
      setDialogData(dialogData);
      return dialogData;
  };

  const closeDialog = () => {
    setDialogData(DialogData.makeNone(dialogData));
  }

  useEffect(() => {
    appService.login(() => {
      let appData = appService.getAppData();
      switch (appData.getAppState()) {
        case AppConst.APP_STATE.NO_LOGIN: {
          setDialogData(DialogData.makeCreateAccount());
          onPageSelected("create_exam");
          break;
        }
        default: {
          if (AppConst.DEV_MODE) {
            // TODO: test here
            setDialogData(DialogData.makeAddExam());
          }
          onPageSelected("create_exam");
          break;
        }
      }
    });
  }, []);

  const onPageSelected = useCallback((page) => {
    setPage(page);
  });

  const onDialogResize = useCallback((width, height) => {
    setDialogData(prev => {
      if (prev.width === width && prev.height === height) return prev;
      return prev.copyWithSize(width, height);
    });
  }, []);

  return (
    <>

    <Loading 
      loadingData={loadingData}
    />

    <Dialog 
        dialogData={dialogData}
        onClose={() => {closeDialog()}}
    >
      {dialogData.isUsageAt(AppConst.DIALOG_USAGE.CREATE_EXAM) && (
        <>
          <p>You are about to start the <b>Civil Law Quiz</b>. You have 30 minutes.</p>
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
          closeDialog={closeDialog}
          useLoading={useLoading}
        />
      )}
      {dialogData.isUsageAt(AppConst.DIALOG_USAGE.VIEW_DOCUMENT)
      && dialogData.extraData !== null 
      && 
      (
        <ViewDocument
          docPath={dialogData.extraData.link}
        />
      )}
      {dialogData.isUsageAt(AppConst.DIALOG_USAGE.CONFIRM_NOTIFY)
      && dialogData.extraData !== null
      &&
      (
        <ConfirmNotify
          dialogData={dialogData}
          closeDialog={closeDialog}
        />
      )}
      {/* {dialogData.isUsageAt(AppConst.DIALOG_USAGE.TEST) && (
        <SliderPoint
          startPercent={0.2}
          onPercentAt={() => {}}
          textStart={"30 minute"}
          textEnd={"120 minute"}
        />
      )} */}
      {dialogData.isUsageAt(AppConst.DIALOG_USAGE.ADD_EXAM) && (
        <AddExam/>
      )}
    </Dialog>

    <Header />
    <div className='main-pages'>
      <Sidebar
        onSelect={onPageSelected}
        currentId={page}
      />
      {appService.getAppData().getAppState() === AppConst.APP_STATE.IDLE
      &&  page === "create_exam"
      &&
        (<CreateExamPage
          useLoading={useLoading}
          useDialog={useDialog}
        />)
      }
    </div>
    <Footer />
    </>
  )
}

export default App
