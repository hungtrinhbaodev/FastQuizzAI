import {useState} from 'react'
import FloatDropBoxMultiOption from './FloatDropBoxMultiOption';
import AppConst from './services/AppConst';
import AppUtils from './services/AppUtils';
import appService from './services/AppService';
import BoxOneOption from './BoxOneOption';
import SliderPoint from './SliderPoint';
import './AddExam.css';

const AddExam = ({}) => {
    
    const [examName, setExamName] = useState("");
    const [examDocsId, setExamDocsId] = useState([]);
    const [examTime, setExamTime] = useState(0);
    const [examTimeText, setExamTimeText] = useState(AppUtils.convertMiliInToMinutes(AppConst.EXAM_TIME.START) + " minutes")
    const [examNumberQuestion, setExamNumberQuestion] = useState(AppConst.EXAM_NUMBER_QUESTION.START);
    // const [examDifficult, setExamDifficult] = useState(0);
    const [docsData, setDocsData] = useState([]);

    (async() => {
        const docData = await appService.requestUserDocs();
        setDocsData(docData);
    })();

    // const getListDifficultTypes  = () => {
    //     let listDifficult = [];
    //     for (const key in AppConst.EXAM_DIFFICULT) {
    //         listDifficult.push(AppConst.EXAM_DIFFICULT[key]);
    //     }
    //     return listDifficult;
    // }

    // const getListDifficultNames = () => {
    //     let listDifficultNames = [];
    //     for (const difficultType of getListDifficultTypes()) {
    //         listDifficultNames.push(AppUtils.getDifficultNameBy(difficultType));
    //     }
    //     console.log("listDifficultNames", listDifficultNames);
    //     return listDifficultNames;
    // }

    // const onChoseDifficult = (index) => {
    //     setExamDifficult(getListDifficultTypes()[index]);
    // }

    const onChoseDocs = (docIndices) => {
        const docIds = [];
        docIndices.map(index => docsData[index].id);
        setExamDocsId(docIds);
    }

    const onChoseTimeExam = (percent) => {
        let timeRoundByStep = AppUtils.getValuenInRangeWith(
            AppConst.EXAM_TIME.START,
            AppConst.EXAM_TIME.END,
            percent,
            AppConst.EXAM_TIME.STEP
        );
        setExamTime(timeRoundByStep);
        setExamTimeText(AppUtils.convertMiliInToMinutes(timeRoundByStep) + " minutes");
    }

    const onChoseNumberQuestion = (percent) => {
        let numberQuestion = AppUtils.getValuenInRangeWith(
            AppConst.EXAM_NUMBER_QUESTION.START,
            AppConst.EXAM_NUMBER_QUESTION.END,
            percent,
            AppConst.EXAM_NUMBER_QUESTION.STEP
        );
        setExamNumberQuestion(numberQuestion);
    }

    return (
        <div
            className='add-exam-container'
        >
            <div
                className='add-exam-input-name-container'
            >
                <label
                    className='label-input-name add-exam-label'
                >
                    Enter exam name:
                </label>
                <input 
                    type='text'
                    className='add-exam-input-name-exam'
                    placeholder='Enter your exam name...'
                    onChange={(e) => {setExamName(e.target.value)}}
                />
            </div>

            <div
                className='add-exam-chose-document-container'
            >
                <label
                    className='add-exam-label-choose-document add-exam-label'
                >
                    Chose documents:
                </label>
                <div
                    className='add-exam-options-document-container'
                >
                    <FloatDropBoxMultiOption
                        optionNames={docsData.map(docData => docData.name)}
                        onChoseOptions={onChoseDocs}
                    />
                </div>
            </div>
                
            <div
                className='add-axam-chose-time-container add-exam-slide-container'
            >
                <label
                    className="add-exam-label-chose-time add-exam-label"
                >
                    Chose time exam: {examTimeText}
                </label>
                <SliderPoint 
                    onPercentAt={onChoseTimeExam}
                    startPercent={0}
                    textStart={"30 minutes"}
                    textEnd={"120 minutes"}
                />    
            </div>

            <div
                className='add-exam-chose-number-question add-exam-slide-container'
            >
                <label
                    className="add-exam-label-chose-number-question add-exam-label"
                >
                    Chose number question exam: {examNumberQuestion}
                </label>
                <SliderPoint
                    onPercentAt={onChoseNumberQuestion}
                    startPercent={0}
                    textStart={"30 question"}
                    textEnd={"120 question"}
                />
            </div>

            {/* <div
                className='add-exam-chose-difficult-container'
            >
                <BoxOneOption 
                    title={"Chose difficult exam:"}
                    optionNames={getListDifficultNames()}
                    onChosenOptions={onChoseDifficult}
                    defaultChosenIndex={getListDifficultTypes().indexOf(AppConst.EXAM_DIFFICULT.EASY)}
                />
            </div> */}

        </div>
    );
} 

export default AddExam;