from enum import Enum


class Base_Data:

    def __init__(self):
        pass

    def parse_from_db_object(self, db_object):
        for key in db_object:
            if key in self.__dict__:
                self.__dict__[key] = db_object[key]
        return self.update_default_added_key()

    def get_db_object(self, pk_field, pk_value):
        db_object = self.__dict__.copy()
        db_object[pk_field] = pk_value
        return db_object

    def get_dict(self, igore_keys=[]):
        dict_data = self.__dict__.copy()
        for key in igore_keys:
            if key in dict_data:
                del dict_data[key]
        return dict_data

    # when we add more key to option
    # we need to set a default value
    # for this new key when object
    # is parse from db if data have update
    # we will return true
    def update_default_added_key(self):
        return False
