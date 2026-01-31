import { useState, useEffect } from 'react';
import AppConst from './services/AppConst';
import AppIcon from './AppIcon';
import './BoxExamQuestion.css';

const BoxExamQuestion = ({
  questionMode,
  questionData,
  correctIndex,
  onChoseOption,
  questionIndex,
  chosenIndex,
  shuffleAnswer
}) => {
  const [chosenAnswerIndex, setChosenAnswerIndex] = useState(-1);

  useEffect(() => {
    setChosenAnswerIndex(chosenIndex);
  }, [chosenIndex]);

  const onChoseAt = (index) => {
    if (questionMode === AppConst.EXAM_DETAIL_MODE.FULL) {
      return;
    }
    setChosenAnswerIndex(index);
    onChoseOption(index, questionIndex);
  };

  const isCheckAt = (index) => {
    if (questionMode === AppConst.EXAM_DETAIL_MODE.FULL) {
      return index === correctIndex || chosenAnswerIndex === index;
    }
    return chosenAnswerIndex === index;
  };

  const getAnswerTextStlyle = (answerIndex) => {
    const styles = {};
    if (questionMode === AppConst.EXAM_DETAIL_MODE.FULL) {
      answerIndex === correctIndex && (styles['color'] = 'green');
      answerIndex === chosenIndex &&
        chosenIndex != correctIndex &&
        (styles['color'] = 'red');
    }
    return styles;
  };

  const getBackgroundStyles = () => {
    const styles = {};
    if (questionMode === AppConst.EXAM_DETAIL_MODE.FULL) {
      correctIndex === chosenIndex && (styles['backgroundColor'] = '#1dff1d10');
      correctIndex !== chosenIndex && (styles['backgroundColor'] = '#fd000010');
    } else {
      questionIndex % 2 === 0
        ? (styles['backgroundColor'] = '#FFFFFF')
        : (styles['backgroundColor'] = '#4F4F4F10');
    }
    return styles;
  };

  return (
    <div className="box-exam-question-container" style={getBackgroundStyles()}>
      <label className="box-exam-question-label-content box-exam-question-label">
        {questionIndex + 1}. {questionData.questionText}
      </label>
      {questionData.options.map((_, index) => {
        const shuffleIndex = shuffleAnswer[index];
        const sampleAnswer = questionData.options[shuffleIndex];
        return (
          <div
            key={index}
            className="box-exam-question-sample-answer-container"
          >
            <div
              className="box-exam-question-sample-answer-check-box"
              onClick={() => {
                onChoseAt(index);
              }}
              style={getAnswerTextStlyle(index)}
            >
              {!isCheckAt(index) && (
                <AppIcon
                  className="box-exam-question-sample-answer-box"
                  iconType={AppConst.ICON_TYPE.EMPTY_BOX}
                />
              )}
              {isCheckAt(index) && (
                <AppIcon
                  className="box-exam-question-sample-answer-box"
                  iconType={AppConst.ICON_TYPE.CHECK_BOX}
                />
              )}
            </div>
            <label
              className="box-exam-question-sample-anwser-content box-exam-question-label"
              style={getAnswerTextStlyle(index)}
            >
              {sampleAnswer}
            </label>
          </div>
        );
      })}
      {questionMode === AppConst.EXAM_DETAIL_MODE.FULL && (
        <div className="box-exam-question-explain-container">
          <label className="box-exam-question-explain-content box-exam-question-label">
            Explain for quesiton: {questionData.explain}
          </label>
        </div>
      )}
    </div>
  );
};

export default BoxExamQuestion;
