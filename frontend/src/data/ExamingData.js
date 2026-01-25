import ExamDetailData from './ExamDetailData';
class ExamingData {
  constructor(examId = '', remainingTime = 0, anwsers = [], examDetail = null) {
    this.examId = examId;
    this.remainingTime = remainingTime;
    this.anwsers = anwsers;
    this.examDetail = examDetail;
  }
}

export default ExamingData;
