import factory
from app.models.user import User
from app.core.auth import hash_password


class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = User
        sqlalchemy_session_persistence = "commit"

    email = factory.faker.Faker("email")
    name = factory.faker.Faker("name")
    hashed_password = hash_password("1234")

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        if "password" in kwargs:
            raw_password = kwargs.pop("password")
            kwargs["hashed_password"] = hash_password(raw_password)
        return super()._create(model_class, *args, **kwargs)
