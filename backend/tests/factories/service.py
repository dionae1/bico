import factory
from app.models.service import Service


class ServiceFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Service
        sqlalchemy_session_persistence = "flush"

    name = factory.faker.Faker("company")
    description = factory.faker.Faker("text", max_nb_chars=200)
    price = factory.faker.Faker(
        "pydecimal", left_digits=4, right_digits=2, positive=True
    )
    cost = factory.faker.Faker(
        "pydecimal", left_digits=4, right_digits=2, positive=True
    )
    periodicity = factory.declarations.Iterator(["monthly", "quarterly", "yearly"])
    status = True
