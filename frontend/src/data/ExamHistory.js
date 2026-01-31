class ExamHistoryData {
  constructor(
    historyId = '',
    userId = '',
    examId = '',
    examDoingTime = 0,
    examStartTime = 0,
    examAnswer = [],
    examPoint = 0,
    correctAnswer = 0,
    shuffleAnswers = []
  ) {
    this.id = historyId;
    this.userId = userId;
    this.examId = examId;
    this.examDoingTime = examDoingTime;
    this.examStartTime = examStartTime;
    this.examAnswer = examAnswer;
    this.examPoint = examPoint;
    this.correctAnswer = correctAnswer;
    this.shuffleAnswers = shuffleAnswers;
  }
}

export default ExamHistoryData;
