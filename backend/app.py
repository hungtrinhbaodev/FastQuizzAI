import os
from db import db
from data.user_data import User_Data
from data.app_data import App_Data
from data.document_data import Document_Data
from const import APP_STATE

class App:

    instance = None

    def __init__(self):

        self._app_data = None
        self._users = None
        self._docs = []

        self.load_app_data()
        self.load_users()
        self.load_docs(self._app_data.current_user)

    def load_app_data(self):
        db_app_data = db.load_objects_from_db("pk", "APP")
        app_data = App_Data()

        if len(db_app_data) == 0:
            app_data.app_state = APP_STATE.NO_LOGIN.value
            self._app_data = app_data
            self.save_app_data()
        else:
            app_data.parse_from_db_object(db_app_data[0])

        self._app_data = app_data
    
    def save_app_data(self):
        db_app_data = self._app_data.get_db_object("pk", "APP")
        db.save_object_to_db(db_app_data, "pk")
        
    def load_users(self):
        db_users = db.load_objects_from_db("pk", "USER")

        users = []
        for db_user in db_users:
            user = User_Data()
            user.parse_from_db_object(db_user)
            users.append(user)
        
        self._users = users

    def load_docs(self, user_id):
        db_docs = db.load_objects_from_db("pk", "DOC", "belong_to", user_id)
        docs = []
        for db_doc in db_docs:
            doc = Document_Data()
            doc.parse_from_db_object(db_doc)
            docs.append(doc)
        self._docs = docs
    
    def add_user(self, user):
        assert type(user) == User_Data, "User must be of type User_Data"
        self._users.append(user)
        db_user = user.get_db_object("pk", "USER")
        db.save_object_to_db(db_user, "pk", "id")

    def add_doc(self, doc):
        assert type(doc) == Document_Data, "Doc must be of type Document_Data"
        assert doc.belong_to == self._app_data.current_user, "Doc must belong to current user"
        self._docs.append(doc)
        db_doc = doc.get_db_object("pk", "DOC")
        db.save_object_to_db(db_doc, "pk", "id")
    
    def get_doc_by(self, doc_id):
        for doc in self._docs:
            if doc.id == doc_id:
                return doc
        return None

    def remove_doc(self, doc_id):
        doc_to_remove = None
        for doc in self._docs:
            if doc.id == doc_id:
                doc_to_remove = doc
                break
        
        if doc_to_remove:
            self._docs.remove(doc_to_remove)
            db.remove_objects_from_db("pk", "DOC", "id", doc_id)
            return True
        return False

    def get_current_user(self):
        return self.get_user(self._app_data.current_user)

    def get_user(self, id) -> User_Data:
        for user in self._users:
            if user.id == id:
                return user
        return User_Data()
    
    def get_users(self):
        return self._users
    
    def get_docs(self):
        return self._docs
    
    def get_app_data(self):
        return self._app_data

    @staticmethod
    def get_instance():
        if App.instance == None:
            App.instance = App()
        return App.instance
