from . import yaml
from .Serialisable import Serialisable

class PersistantObject(Serialisable):
    def __init__(self, persistance):
        self.persistance = persistance
        contents = persistance.read()
        if len(contents) > 0:
            representation = yaml.load(contents)
            self.from_dict(representation)

    # Requires a sub class to imprement the to_dict method
    def save(self):
        self.persistance.write(yaml.dump(self.to_dict()))
