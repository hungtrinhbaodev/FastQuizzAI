from data.base_data import Base_Data

class Exam_History(Base_Data):
    def __init__(
            self, 
            id = "",
            user_id = "", 
            exam_id = "", 
            exam_doing_time = 0,
            start_doing_time = 0,
            exam_answer = [],
            exam_point = 0
            ):
        super().__init__()
        self.id = id
        self.exam_id = user_id
        self.user_id = exam_id
        self.doing_time = exam_doing_time
        self.start_time = start_doing_time
        self.exam_answers = exam_answer
        self.exam_point = exam_point
