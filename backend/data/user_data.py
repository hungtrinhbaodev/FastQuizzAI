from data.base_data import Base_Data

class User_Data(Base_Data):

    def __init__(self, i_id = "", i_name = "", i_avatar = ""):
        super().__init__()
        self.id = i_id
        self.name = i_name
        self.avatar = i_avatar