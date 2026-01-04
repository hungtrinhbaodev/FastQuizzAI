from data.base_data import Base_Data
from const import DOCUMENT_TAG

class Document_Data(Base_Data):
    def __init__(self, name = "", user_id = "", id = "", tag = DOCUMENT_TAG.OTHER.value, url = "", created_time = -1):
        super().__init__()
        self.name = name
        self.belong_to = user_id
        self.id = id
        self.tag = tag
        self.url = url
        self.created_time = created_time