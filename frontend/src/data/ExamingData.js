import ExamDetailData from './ExamDetailData';
class ExamingData {
  constructor(
    examId = '',
    remainingTime = 0,
    anwsers = [],
    examDetail = null,
    shuffleAnswers = []
  ) {
    this.examId = examId;
    this.remainingTime = remainingTime;
    this.anwsers = anwsers;
    this.examDetail = examDetail;
    this.shuffleAnswers = shuffleAnswers;
  }
}

export default ExamingData;
