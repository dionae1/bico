from app.models.client import Client

import factory
import uuid

class ClientFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Client
        sqlalchemy_session_persistence = "commit"

    user_id = factory.LazyFunction(uuid.uuid4)
    email = factory.faker.Faker("email")
    name = factory.faker.Faker("name")
    phone = factory.faker.Faker("phone_number")
    address = factory.faker.Faker("address")
