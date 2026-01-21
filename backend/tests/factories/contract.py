from app.models.contract import Contract

import factory
import uuid


class ContractFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Contract
        sqlalchemy_session_persistence = "flush"

    client_id = factory.LazyFunction(uuid.uuid4)
    service_id = factory.LazyFunction(uuid.uuid4)
    created_at = factory.faker.Faker("date_time")
    end_at = factory.faker.Faker("date_time")
    value = factory.faker.Faker(
        "pydecimal", left_digits=6, right_digits=2, positive=True
    )
