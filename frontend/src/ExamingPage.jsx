import { useState, useEffect } from 'react';
import BoxExamQuestion from './BoxExamQuestion';
import './ExamingPage.css';
import appService from './services/AppService';
import AppConst from './services/AppConst';
import AppUtils from './services/AppUtils';
import DialogData from './data/DialogData';

const ExamingPage = ({
  iExamingData,
  useDialog,
  onFinishExam,
  closeDialog
}) => {
  const [questionsData, setQuestionsData] = useState([]);
  const [shuffleAnswers, setSuffleAnswers] = useState([]);
  const [answersIndex, setAnswerIndex] = useState([]);
  const [timeRemain, setTimeRemain] = useState(0);
  const [detailMode, setDetailMode] = useState(AppConst.EXAM_DETAIL_MODE.FULL);
  const [examName, setExamName] = useState('');

  useEffect(() => {
    setQuestionsData(iExamingData.examDetail.questions);
    setAnswerIndex([...iExamingData.anwsers]);
    setDetailMode(iExamingData.examDetail.examMode);
    setSuffleAnswers(iExamingData.shuffleAnswers);

    const examsData = appService.getUserExams();
    if (!examsData) {
      appService.requestExams();
    } else {
      const examData = appService.getExamBy(iExamingData.examId);
      if (examData) {
        setExamName(examData.name);
      }
    }

    const remainingTime = iExamingData.remainingTime;
    const endTime = AppUtils.getCurrentTimeInMili() + remainingTime;

    setTimeRemain(endTime - AppUtils.getCurrentTimeInMili());
    const interval = setInterval(() => {
      const timeRemain = endTime - AppUtils.getCurrentTimeInMili();
      setTimeRemain(timeRemain);
      if (timeRemain < 0) {
        clearInterval(interval);
        onFinishExam();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [iExamingData]);

  useEffect(() => {
    const listener = (subscribeType) => {
      switch (subscribeType) {
        case AppConst.SUBSCRIBE_TYPE.RELOAD_USER_EXAMING_DATA: {
          const examingData = appService.getExamingData();
          setAnswerIndex([...examingData.anwsers]);
          break;
        }
        case AppConst.SUBSCRIBE_TYPE.RELOAD_USER_EXAMS: {
          const examData = appService.getExamBy(iExamingData.examId);
          if (examData) {
            setExamName(examData.name);
          }
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
    };
  }, []);

  const onChoseOption = (optionIndex, quesitonIndex) => {
    answersIndex[quesitonIndex] = optionIndex;
    appService.requestChoseAnswerInExam(optionIndex, quesitonIndex);
  };

  const onSubmitExaming = () => {
    // check user do all questions
    if (
      answersIndex.filter(
        (answersIndex, index) =>
          answersIndex < 0 || answersIndex > questionsData[index].options.length
      ).length
    ) {
      const dialogData = useDialog(
        DialogData.makeConfirmNotify(
          "You don't chose all questions, do you want to submit!",
          () => {
            onFinishExam(dialogData);
            closeDialog();
          }
        )
      );
      return;
    }
    onFinishExam();
  };

  return (
    <div className="examing-page-container">
      <div className="examing-page-time-countdown-container">
        {AppUtils.convertMiliToTimeString(timeRemain)}
      </div>
      <h1 className="examing-page-title">
        {examName !== '' && 'Examing in exam: ' + examName}
      </h1>
      {questionsData.length > 0 &&
        questionsData.map((questionData, index) => {
          return (
            <BoxExamQuestion
              key={index}
              questionData={questionData}
              questionMode={detailMode}
              correctIndex={-1}
              chosenIndex={answersIndex[index]}
              questionIndex={index}
              onChoseOption={onChoseOption}
              shuffleAnswer={shuffleAnswers[index]}
            />
          );
        })}
      <div className="examing-page-button-group-container">
        <button
          className="examing-page-button-submit"
          onClick={onSubmitExaming}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ExamingPage;
