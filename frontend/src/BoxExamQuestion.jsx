import {useState} from 'react'
import AppConst from './services/AppConst'

const BoxExamQuestion = ({questionMode, questionData, historyAnswerIndex, onChoseOption}) => {

    const [chosenAnswerIndex, setChosenAnswerIndex] = useState(-1);

    const onChoseAt = (index) => {
        setChosenAnswerIndex(index);
        onChoseOption(index);
    }

    return (
        <div
            className='box-exam-question-container'
        >
            <div
                className='box-exam-question-content-container'
            >
                <label
                    className='box-exam-question-label-content'
                >
                    {questionData.questionText}
                </label>
                {questionMode === AppConst.EXAM_DETAIL_MODE.DOING && (
                    questionData.options.map((sampleAnswer, index) => (
                        <div
                            key={index}
                            className='box-exam-question-sample-answer-container'
                        >
                            <div
                                className='box-exam-question-sample-answer-check-box'
                                onClick={() => {onChoseAt(index)}}
                            >
                                <img
                                    className='box-exam-question-sample-answer-image-box'
                                />
                                {(chosenAnswerIndex === index 
                                || (questionMode === AppConst.EXAM_DETAIL_MODE.FULL && historyAnswerIndex === index)) 
                                && (
                                    <img 
                                        className='box-exam-question-sample-awnser-image-tick'
                                    />
                                )}
                            </div>
                            <label
                                className='box-exam-question-sample-anwser-content'
                            >
                                {sampleAnswer}
                            </label>
                        </div>
                    ))
                )}
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
        </div>
    )
}