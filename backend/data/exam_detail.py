from data.exam_question import Exam_Question
import json
from const import VIEW_EXAM_DETAIL_MODE
from typing import List


class Exam_Detail():

    def __init__(self):
        self.questions = []
        pass

    def load_by(self, exam_data):

        if exam_data is None:
            return

        file_path = exam_data.exam_path

        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)

            questions_config = data['quiz_results']
            for i in range(exam_data.number_question):
                config = questions_config[i]
                question = Exam_Question()
                question.parse_form_json(config)
                self.questions.append(question)

        except Exception as e:
            self.questions = []
            print("load exam detail error", e)

    def get_questions(self) -> List[Exam_Question]:
        return self.questions

    def get_dict(self, detail_mode=VIEW_EXAM_DETAIL_MODE.FULL.value):

        questions = []
        for question in self.questions:
            questions.append(question.get_dict(detail_mode))

        return {
            'detail_mode': detail_mode,
            'questions': questions
        }

    def get_number_correct_answer(self, answers, shuffle_answers=[]):
        num_correct = 0
        for i in range(len(self.questions)):
            if i < len(answers) and answers[i] != -1:
                answer = answers[i]
                question = self.questions[i]
                if question.check_answer(shuffle_answers[i][answer]):
                    num_correct += 1
        return num_correct

    def get_point_by(self, answers, shuffle_answers=[]):
        return self.get_number_correct_answer(answers, shuffle_answers) / len(self.questions) * 10
