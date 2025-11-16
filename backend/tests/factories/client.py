import factory
from app.models.client import Client


class ClientFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Client
        sqlalchemy_session_persistence = "commit"

    email = factory.faker.Faker("email")
    name = factory.faker.Faker("name")
    phone = factory.faker.Faker("phone_number")
    address = factory.faker.Faker("address")
