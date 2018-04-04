import yaml

class PersistantObjectList:
    def __init__(self, persistance):
        self.persistance = persistance
        nothing_in_persistance = len(persistance.read()) == 0
        if nothing_in_persistance:
            persistance.write("[]")
        self.current = 0

    def to_list(self):
        return yaml.load(self.persistance.read())

    def add(self, obj):
        current = self.to_list()
        current.append(obj)
        self.persistance.write(yaml.dump(current))

    def find(self, func):
        objects = self.to_list()
        for obj in objects:
            if func(obj):
                return obj
        return None
        

