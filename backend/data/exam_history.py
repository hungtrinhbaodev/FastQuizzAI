from data.base_data import Base_Data
import utils


class Exam_History(Base_Data):
    def __init__(
            self,
            id="",
            user_id="",
            exam_id="",
            exam_doing_time=0,
            start_doing_time=0,
            exam_answer=[],
            exam_point=0,
            correct_answers=0,
            shuffle_anwsers=[]
    ):
        super().__init__()
        self.id = id
        self.exam_id = exam_id
        self.user_id = user_id
        self.doing_time = exam_doing_time
        self.start_time = start_doing_time
        self.exam_answers = exam_answer
        self.exam_point = exam_point
        self.correct_answers = correct_answers
        self.shuffle_answers = shuffle_anwsers

    def update_default_added_key(self):
        is_update = False
        if len(self.shuffle_answers) == 0 or len(self.exam_answers) != len(self.shuffle_answers):
            self.shuffle_answers = []
            for _ in range(len(self.exam_answers)):
                self.shuffle_answers.append(utils.make_list_indices(4))
            is_update = True
        return is_update
