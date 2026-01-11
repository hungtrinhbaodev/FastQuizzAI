import os
from data.base_data import Base_Data
from const import VIEW_EXAM_DETAIL_MODE

class Exam_Question(Base_Data):
    def __init__(self):
        super().__init__()
        self.doc_id = ""
        self.category = ""
        self.question_text = ""
        self.options = []
        self.correct_answer = ""
        self.explanation_vi = ""
        pass

    def parse_form_json(self, json):
        self.doc_id, _ = os.path.splitext(json['doc_source'])
        self.category = json['category']
        self.question_text = json['question_text']
        self.options = json['options']
        self.correct_answer = json['correct_answer']
        self.explanation_vi = json['explanation_vi']

    def get_dict(self, detail_mode):
        if detail_mode == VIEW_EXAM_DETAIL_MODE.DOING.value:
            return super.get_dict([
                'doc_id',
                'category',
                'correct_answer',
                'explanation_vi'
            ])
        return super().get_dict()
    
    def check_answer(self, answer):
        content_answer = self.options[answer]
        return content_answer == self.correct_answer