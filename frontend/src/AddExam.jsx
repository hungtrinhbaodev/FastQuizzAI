import {useCallback, useEffect, useState} from 'react'
import FloatDropBoxMultiOption from './FloatDropBoxMultiOption';
import AppConst from './services/AppConst';
import AppUtils from './services/AppUtils';
import appService from './services/AppService';
import SliderPoint from './SliderPoint';
import LoadingData from './data/LoadingData';
import DialogData from './data/DialogData';
import './AddExam.css';

const AddExam = ({defaultDocIds, useDialog, closeDialog, useLoading}) => {
    
    const [examName, setExamName] = useState("");
    const [examDocIndices, setExamDocIndices] = useState([]);
    const [examTime, setExamTime] = useState(AppConst.EXAM_TIME.START);
    const [examTimeText, setExamTimeText] = useState(AppUtils.convertMiliInToMinutes(AppConst.EXAM_TIME.START) + " minutes")
    const [examNumberQuestion, setExamNumberQuestion] = useState(AppConst.EXAM_NUMBER_QUESTION.START);
    const [docsData, setDocsData] = useState([]);

    useEffect(() => {

        (async() => {
            const docsData = await appService.requestUserDocs();
            setDocsData(docsData);

            const defaultDocIndices = [];
            for (const docId of defaultDocIds) {
                for (let i = 0; i < docsData.length;i++) {
                    if (docsData[i].id === docId) {
                        defaultDocIndices.push(i);
                    }
                }
            }
            setExamDocIndices(defaultDocIndices);

        })();

    }, [defaultDocIds]);

    const onChoseDocs = useCallback((docIndices) => {
        setExamDocIndices(docIndices);
    });

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

    const handleConfirm = () => {

        if (examName == "") {
            alert("Please enter your exam name!");
            return;
        }
        if (examDocIndices.length <= 0) {
            alert("Please chose documents!");
            return;
        }
        if (examTime <= 0) {
            alert("Please chose time exam!");
            return;
        }
        if (examNumberQuestion <= 0) {
            alert("Please chose number question!");
            return;
        }

        const examDocsId = examDocIndices.map(index => docsData[index].id);

        const loadingData = useLoading(LoadingData.makeLoading("Wait to create your exam!"));

        closeDialog();

        appService.addExam(
            examName, 
            examDocsId, 
            examNumberQuestion,
            examTime, 
            () => {

                useLoading(LoadingData.makeNone(loadingData));

                useDialog(DialogData.makeConfirmNotify(
                    "Create exam name: " + examName + " successfully!"
                ));
            }
        );

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
                        defaultChosenOptions={examDocIndices}
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
                    textStart={"30 questions"}
                    textEnd={"120 questions"}
                />
            </div>

            <div
                className='add-exam-button-group-container'
            >
                <button
                    className='add-exam-button-confirm'
                    onClick={() => {handleConfirm()}}
                >
                    Confirm
                </button>
            </div>

        </div>
    );
} 

export default AddExam;