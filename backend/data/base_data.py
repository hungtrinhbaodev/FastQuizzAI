from enum import Enum

class Base_Data:

    def __init__(self):
        pass

    def parse_from_db_object(self, db_object):
        for key in db_object:
            if key in self.__dict__:
                self.__dict__[key] = db_object[key]
        
    def get_db_object(self, pk_field, pk_value):
        db_object = self.__dict__.copy()
        db_object[pk_field] = pk_value
        return db_object
    
    def get_dict(self):
        return self.__dict__.copy()
