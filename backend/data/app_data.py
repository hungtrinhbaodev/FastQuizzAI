from data.base_data import Base_Data
from const import APP_STATE

class App_Data(Base_Data):
    def __init__(self):
        super().__init__()
        self.app_state = APP_STATE.NO_LOGIN.value
        self.current_user = ""