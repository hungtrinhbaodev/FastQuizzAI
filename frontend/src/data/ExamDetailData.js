import ExamQuestionData from './ExamQuestionData';
import AppConst from '../services/AppConst';

class ExamDetailData {
  constructor(examMode = AppConst.EXAM_DETAIL_MODE.DOING) {
    /**
     * @type {ExamQuestionData}
     */
    this.questions = [];
    this.examMode = examMode;
  }

  /**
   *
   * @param {ExamQuestionData} questionData
   */
  addQuestionData(questionData) {
    this.questions.push(questionData);
  }

  getCorrectAnswerAt(questionIndex, shuffleAnser) {
    const questionData = this.questions[questionIndex];
    if (!questionData) return -1;
    const correctAnswer = questionData.correctAnswer;
    const indexRightAnswer = questionData.options.indexOf(correctAnswer);
    return shuffleAnser.indexOf(indexRightAnswer);
  }
}

export default ExamDetailData;
