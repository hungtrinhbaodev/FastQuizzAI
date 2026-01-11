from data.base_data import Base_Data
from const import EXAM_STATE
import utils

class Examing_Data(Base_Data):

    def __init__(self):
        super().__init__()

        self.user_id = ""
        self.start_time = 0
        self.end_time = 0

        self.exam_id = ""
        self.anwsers = []

        self.state = EXAM_STATE.NOT_DOING.value

    def load_from(self, exam):
        self.user_id = exam.user_id
        self.exam_id = exam.id
        self.anwsers = []
        for self.anwsers in range(exam.number_question):
            self.anwsers.append(-1)
        self.state = EXAM_STATE.EXAMING.value
        self.start_time = utils.get_currrent_millisecond()
        self.end_time = utils.get_currrent_millisecond() + exam.exam_duration

    def get_remaining_time(self):
        return self.end_time - utils.get_currrent_millisecond()

    def get_dict(self):
        dict_data = super().get_dict(["end_time", "start_time"])
        dict_data["remaining_time"] = self.get_remaining_time()
        return dict_data
    
    def update_anwser(self, index_question, index_answer):
        if index_question < 0 or index_question >= len(self.anwsers):
            return
        self.anwsers[index_question] = index_answer