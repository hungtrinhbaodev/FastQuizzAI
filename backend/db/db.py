from tinydb import TinyDB, Query
import os

def get_db():
    if not os.path.exists('./assets'):
        os.makedirs('./assets')
    return TinyDB('./assets/db.json')

def load_objects_from_db(pk_field, pk_value, *args):
    db = get_db()
    query = Query()
    condition = query[pk_field] == pk_value
    for i in range(0, len(args), 2):
        condition = condition & (query[args[i]] == args[i+1])
    return db.search(condition)

def save_object_to_db(object, pk_field, *args):
    assert object[pk_field] != None, "Primary key must be must be set in object!"
    db = get_db()
    query = Query()
    condition = query[pk_field] == object[pk_field]
    for i in range(0, len(args), 1):
        condition = condition & (query[args[i]] == object[args[i]])
    db.upsert(object, condition)

def remove_objects_from_db(pk_field, pk_value, *args):
    db = get_db()
    query = Query()
    condition = query[pk_field] == pk_value
    for i in range(0, len(args), 2):
        condition = condition & (query[args[i]] == args[i+1])
    db.remove(condition)