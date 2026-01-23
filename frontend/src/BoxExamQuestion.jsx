import {useState, useEffect} from 'react'
import AppConst from './services/AppConst'
import AppIcon from './AppIcon'
import './BoxExamQuestion.css'

const BoxExamQuestion = ({questionMode, questionData, historyAnswerIndex, onChoseOption, questionIndex, chosenIndex}) => {

    const [chosenAnswerIndex, setChosenAnswerIndex] = useState(-1);

    useEffect(() => {
        setChosenAnswerIndex(chosenIndex);
    }, [chosenIndex]);

    const onChoseAt = (index) => {
        setChosenAnswerIndex(index);
        onChoseOption(index, questionIndex);
    }

    const isCheckAt = (index) => {
        return chosenAnswerIndex === index || (questionMode === AppConst.EXAM_DETAIL_MODE.FULL && historyAnswerIndex === index);
    }

    return (
        <div
            className='box-exam-question-container'
        >
            <label
                className='box-exam-question-label-content box-exam-question-label'
            >
                {questionIndex + 1}. {questionData.questionText}
            </label>
            {questionData.options.map((sampleAnswer, index) => (
                <div
                    key={index}
                    className='box-exam-question-sample-answer-container'
                >
                    <div
                        className='box-exam-question-sample-answer-check-box'
                        onClick={() => {onChoseAt(index)}}
                    >
                        {!isCheckAt(index) && (<AppIcon
                            className='box-exam-question-sample-answer-box'
                            iconType={AppConst.ICON_TYPE.EMPTY_BOX}
                        />)}
                        {isCheckAt(index) && (<AppIcon
                            className='box-exam-question-sample-answer-box'
                            iconType={AppConst.ICON_TYPE.CHECK_BOX}
                        />)}
                    </div>
                    <label
                        className='box-exam-question-sample-anwser-content box-exam-question-label'
                    >
                        {sampleAnswer}
                    </label>
                </div>
            ))}
            {questionMode === AppConst.EXAM_DETAIL_MODE.FULL && (
                <div
                    className='box-exam-question-explain-container'
                >
                    <label
                        className='box-exam-question-explain-content'
                    >
                        {questionData.explain}
                    </label>
                </div>
            )}
        </div>
    )
}

export default BoxExamQuestion;