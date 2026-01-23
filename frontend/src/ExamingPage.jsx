import {useState, useEffect} from 'react'
import BoxExamQuestion from './BoxExamQuestion';
import './ExamingPage.css'
import appService from './services/AppService';
import AppConst from './services/AppConst';

const ExamingPage = ({iExamingData}) => {

    const [examingData, setExamingData] = useState(null);
    const [answersIndex, setAnswerIndex] = useState([]);

    useEffect(() => {
        setExamingData(iExamingData);
        setAnswerIndex([...iExamingData.anwsers])
        console.log("iExamingData", iExamingData);
    }, [iExamingData]);

    useEffect(() => {

        const listener = (subscribeType) => {

            switch (subscribeType) {
                case AppConst.SUBSCRIBE_TYPE.RELOAD_USER_EXAMING_DATA: {
                    const examingData = appService.getExamingData();
                    setAnswerIndex([...examingData.anwsers]);
                    break;
                }
                default: {
                    break;
                }
            }
        }

        appService.subscribe(listener);

        return () => {
            appService.unsubscribe(AppConst.SUBSCRIBE_TYPE.RELOAD_EXAMS);
        }

    }, []);

    const onChoseOption = (optionIndex, quesitonIndex) => {
        answersIndex[quesitonIndex] = optionIndex;
        appService.requestChoseAnswerInExam(optionIndex, quesitonIndex);
    }

    return (
        <div
            className='examing-page-container'
        >
            {examingData && examingData.examDetail.questions.map((questionData, index) => {
                return (
                <BoxExamQuestion
                    key={index}
                    questionData={questionData}
                    questionMode={examingData.examDetail.examMode}
                    historyAnswerIndex={-1}
                    chosenIndex={answersIndex[index]}
                    questionIndex={index}
                    onChoseOption={onChoseOption}
                />
            )
            })}
        </div>
    );
}

export default ExamingPage;