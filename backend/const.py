from enum import Enum

class APP_STATE(Enum):
    NO_LOGIN = 0
    IDLE = 1
    EXEMING = 2


class DOCUMENT_TAG(Enum):
    LAW = 0
    ENGLISH = 1
    OTHER = 2