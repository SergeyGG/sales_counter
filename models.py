import datetime

from mongoengine import EmbeddedDocument, EmbeddedDocumentField
from pyramid_mongoengine import MongoEngine

db = MongoEngine()


class Good(EmbeddedDocument):
    name = db.StringField(required=True)
    cost = db.FloatField(required=True)
    quantity = db.FloatField(required=True)


class Sale(db.Document):
    title = db.StringField(required=True)
    date = db.DateTimeField(default=datetime.datetime.now)
    number = db.IntField(required=True)
    goods = db.ListField(EmbeddedDocumentField(Good))

    @staticmethod
    def convert_dict_to_update(dictionary, roots=None, return_dict=None):
        if return_dict is None:
            return_dict = {}
        if roots is None:
            roots = []

        for key, value in dictionary.items():
            if isinstance(value, dict):
                roots.append(key)
                Sale.convert_dict_to_update(value, roots=roots, return_dict=return_dict)
                roots.remove(key)  # go one level down in the recursion
            else:
                if roots:
                    set_key_name = 'set__{roots}__{key}'.format(
                        roots='__'.join(roots), key=key)
                else:
                    set_key_name = 'set__{key}'.format(key=key)
                return_dict[set_key_name] = value

        return return_dict
