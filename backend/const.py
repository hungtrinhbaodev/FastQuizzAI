from enum import Enum
import os
import json

class APP_STATE(Enum):
    NO_LOGIN = 0
    IDLE = 1
    EXEMING = 2


class DOCUMENT_TAG(Enum):
    LAW = 0
    ENGLISH = 1
    OTHER = 2

    @staticmethod
    def get_tag_name(tag):

        if tag == DOCUMENT_TAG.LAW.value:
            return "law"
        
        if tag == DOCUMENT_TAG.ENGLISH.value:
            return "english"
        
        return "common"
    
class VIEW_EXAM_DETAIL_MODE(Enum):
    FULL = 0
    DOING = 1

class EXAM_STATE(Enum):
    NOT_DOING = 0
    EXAMING = 1

DOCUMENTS_FOLDER = os.path.join(os.path.dirname(__file__), 'assets', 'documents')

EXAM_FOLDER = os.path.join(os.path.dirname(__file__), 'assets', 'exams')

CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'assets', 'config.json')

with open(CONFIG_PATH, 'r', encoding='utf-8') as file:
    # Use json.load to parse the file object
    data = json.load(file)

APP_CONF = data