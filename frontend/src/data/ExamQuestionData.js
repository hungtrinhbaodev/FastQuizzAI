class ExamQuestionData {

    constructor(
        docId = "",
        questionText = "",
        options = [],
        correctAnswer = "",
        explain = ""
    ) {
        this.docId = docId;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
        this.explain = explain;
    }

}

export default ExamQuestionData;