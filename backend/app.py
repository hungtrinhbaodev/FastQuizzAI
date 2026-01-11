import os
from db import db
from data.user_data import User_Data
from data.app_data import App_Data
from data.document_data import Document_Data
from data.exam_data import Exam_Data
from const import APP_STATE
from data.examing_data import Examing_Data
from data.exam_detail import Exam_Detail
from data.exam_history import Exam_History
import uuid


class App:

    instance = None

    def __init__(self):

        self._app_data = None
        self._users = None
        self._docs = []
        self._exams = []
        self._exam_histories = []

        self._exam_infos = {}
        self._examing_data = Examing_Data()

        self.load_app_data()
        self.load_users()
        self.load_docs(self._app_data.current_user)
        self.load_exams(self._app_data.current_user)
        self.load_exam_histories(self._app_data.current_user)
        self.load_examing_info()

    def load_examing_info(self):
        if self._app_data.app_state == APP_STATE.EXEMING.value:

            db_examings_data = db.load_objects_from_db("pk", "EXAMING, ", "user_id", self._app_data.current_user)
            if len(db_examings_data) == 0:
                self._app_data.app_state = APP_STATE.IDLE.value
                self.save_app_data()
                return
            
            self._examing_data.parse_from_db_object(db_examings_data[0])
            remaining_time = self._examing_data.get_remaining_time()
            if remaining_time <= 0:
                self.process_finish_exam()
            
    def process_finish_exam(self, finish_exam_time = 0):
        
        exam_history = None
        exam_detail = self.get_detail_exam(self._examing_data.exam_id)

        if exam_detail:
            exam_point = exam_detail.get_point_by(self._examing_data.anwsers)
            finish_exam_time = max(finish_exam_time, self._examing_data.end_time)
            exam_history = Exam_History(
                id = str(uuid.uuid4()),
                user_id = self._app_data.current_user,
                exam_id = self._examing_data.exam_id,
                start_doing_time = self._examing_data.start_time,
                exam_doing_time = finish_exam_time - self._examing_data.start_time,
                exam_answer = self._examing_data.anwsers,
                exam_point = exam_point
            )
            self.add_history(exam_history)
            
            self._app_data.app_state = APP_STATE.IDLE.value
            self.save_app_data()
            db.remove_objects_from_db("pk", "EXAMING", "user_id", self._app_data.current_user)

        return exam_history

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

    def load_exams(self, user_id):
        db_exams = db.load_objects_from_db("pk", "EXAM", "user_id", user_id)
        exams = []
        for db_exam in db_exams:
            exam = Exam_Data()
            exam.parse_from_db_object(db_exam)
            exams.append(exam)
        self._exams = exams

    def load_exam_histories(self, user_id):
        db_exam_histories = db.load_objects_from_db("pk", "EXAM_HISTORY", "user_id", user_id)
        exam_histories = []
        for db_exam_history in db_exam_histories:
            exam_history = Exam_History()
            exam_history.parse_from_db_object(db_exam_history)
            exam_histories.append(exam_history)
        self._exam_histories = exam_histories
    
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

    def add_exam(self, exam):
        assert type(exam) == Exam_Data, "Exam must be of type Exam_Data"
        assert exam.user_id == self._app_data.current_user, "Exam must belong to current user"
        self._exams.append(exam)
        db_exam = exam.get_db_object("pk", "EXAM")
        db.save_object_to_db(db_exam, "pk", "id")

    def add_history(self, exam_history):
        assert type(exam_history) == Exam_History, "Exam history must be of type Exam_History"
        self._exam_histories.append(exam_history)
        db_exam_history = exam_history.get_db_object("pk", "EXAM_HISTORY")
        db.save_object_to_db(db_exam_history, "pk", "id")

    def update_examing_data(self, exam_id):
        exam = self.get_exam_by(exam_id)
        self._examing_data.load_from(exam)
        self.save_examing_data

    def save_examing_data(self):
        db_object = self._examing_data.get_db_object("pk", "EXAMING")
        db.save_object_to_db(db_object, "pk", "user_id")
    
    def get_doc_by(self, doc_id):
        for doc in self._docs:
            if doc.id == doc_id:
                return doc
        return None
    
    def get_exam_by(self, exam_id):
        for exam in self._exams:
            if exam.id == exam_id:
                return exam
        return None

    def remove_doc(self, doc_id):
        doc_to_remove = self.get_doc_by(doc_id)
        
        if doc_to_remove:
            self._docs.remove(doc_to_remove)
            db.remove_objects_from_db("pk", "DOC", "id", doc_id)
            return True
        return False
    
    def remove_exam(self, exam_id):
        exam_to_remove = self.get_exam_by(exam_id)
        
        if exam_to_remove:
            self._exams.remove(exam_to_remove)
            db.remove_objects_from_db("pk", "EXAM", "id", exam_id)
            return True
        
        return False

    def get_exam_info(self, exam_id):
        return self._exam_infos   

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
    
    def get_exams(self):
        return self._exams
    
    def get_app_data(self):
        return self._app_data
    
    def get_detail_exam(self, exam_id):
        if not exam_id in self._exam_infos:
            exam = self.get_exam_by(exam_id)
            exam_detail = Exam_Detail()
            exam_detail.load_by(exam)
            self._exam_infos[exam_id] = exam_detail
        return self._exam_infos[exam_id]
    
    def get_examing_data(self):
        return self.get_examing_data()

    @staticmethod
    def get_instance():
        if App.instance == None:
            App.instance = App()
        return App.instance
