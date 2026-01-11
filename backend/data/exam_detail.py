from data.exam_question import Exam_Question
import json
from const import VIEW_EXAM_DETAIL_MODE

class Exam_Detail():

    def __init__(self):
        self.questions = []
        self.exam_duration = 0
        pass

    def load_by(self, exam_data):

        if exam_data is None:
            return
        
        file_path = exam_data.exam_path

        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)

            questions_config = data['quiz_results']
            for config in questions_config:
                question = Exam_Question()
                question.parse_form_json(config)
                self.questions.append(question)

        except Exception as e:
            self.questions = []
            print("load exam detail error", e)

    def get_dict(self, detail_mode = VIEW_EXAM_DETAIL_MODE.FULL.value):

        questions = []
        for question in self.question:
            questions.append(question.get_dict(detail_mode))

        return questions
    
    def get_point_by(self, answers):
        num_correct = 0
        for i in range(len(self.questions)):
            if i < len(answers) and answers[i] != -1:
                answer = answers[i]
                question = self.questions[i]
                if question.check_answer(answer):
                    num_correct += 1
        return num_correct / len(self.questions) * 10
    
            