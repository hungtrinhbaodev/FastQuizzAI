import ExamQuestionData from "./ExamQuestionData";
import AppConst from "../services/AppConst";

class ExamDetailData {

    constructor(
        examMode = AppConst.EXAM_DETAIL_MODE.DOING
    ) {
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

}

export default ExamDetailData;