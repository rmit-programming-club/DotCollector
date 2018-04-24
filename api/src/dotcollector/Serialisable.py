import inspect
from typing import get_type_hints, Dict, Any, List


class Serialisable:

    @staticmethod
    def to_primitive(value, Type):
        if issubclass(Type, Serialisable):
            return value.to_dict()
        elif issubclass(Type, list):
            return [Serialisable.to_primitive(obj, Type.__args__[0]) for obj in value]
        else:
            return value

    def to_dict(self):
        dictionary: Dict[str, Any] = {}
        for attribute, Type in get_type_hints(self).items():
            value = getattr(self, attribute)
            dictionary[attribute] = self.to_primitive(value, Type)
        return dictionary

    @staticmethod
    def from_primitive(value, Type):
        if issubclass(Type, Serialisable):
            obj = Type()
            obj.from_dict(value)
            return obj
        elif issubclass(Type, list):
            return [Serialisable.from_primitive(obj, Type.__args__[0]) for obj in value]
        else:
            return value

    def from_dict(self, dictionary):
        for attribute, Type in get_type_hints(self).items():
            if attribute in dictionary:
                value = self.from_primitive(dictionary[attribute], Type)
                setattr(self, attribute, value)
