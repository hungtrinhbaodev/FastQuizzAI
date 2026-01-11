class ExamData {

    constructor(
        examId, 
        examName,
        numberQuestion, 
        examDuration,
        docIds
    ) {
        this.id = examId;
        this.name = examName;
        this.numberQuestion = numberQuestion;
        this.duration = examDuration;
        this.docIds = docIds;
    }

}

export default ExamData;