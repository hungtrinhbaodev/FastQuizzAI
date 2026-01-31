import { useEffect } from 'react';
import BoxExamQuestion from './BoxExamQuestion';
import './ExamHistoryDetail.css';

const ExamHistoryDetail = ({ historyData, examDetail }) => {
  useEffect(() => {
    console.log('ExamHistoryDetail', historyData.shuffleAnswers.length);
  }, []);

  return (
    <div className="exam-history-detail-container">
      <h2 className="exam-history-detail-title">Exam result:</h2>
      <div className="exam-history-detail-questions-container">
        {examDetail.questions.map((questionData, index) => (
          <BoxExamQuestion
            key={index}
            questionData={questionData}
            questionMode={examDetail.examMode}
            correctIndex={examDetail.getCorrectAnswerAt(
              index,
              historyData.shuffleAnswers[index]
            )}
            chosenIndex={historyData.examAnswer[index]}
            questionIndex={index}
            onChoseOption={() => {}}
            shuffleAnswer={historyData.shuffleAnswers[index]}
          />
        ))}
      </div>
      <div className="exam-history_detail-group-button">
        <button className="exam-history-button-confirm">Confirm</button>
      </div>
    </div>
  );
};

export default ExamHistoryDetail;
