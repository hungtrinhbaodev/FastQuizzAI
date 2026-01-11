from data.base_data import Base_Data
from const import EXAM_STATE

class Exam_Data(Base_Data):
    def __init__(self, id = "",  name = "", document_ids = [], user_id = "", number_question = 0, exam_duration = 0):
        super().__init__()
        self.id = id
        self.name = name
        self.document_ids = document_ids
        self.user_id = user_id
        self.number_question = number_question
        self.exam_duration = exam_duration
        self.exam_path = ""
        
