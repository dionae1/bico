import factory
from app.models.user import AuthCredentials
from app.core.auth import hash_password


class AuthCredentialsFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = AuthCredentials
        sqlalchemy_session_persistence = "commit"

    provider = "local"
    provider_user_id = factory.LazyAttribute(lambda obj: obj.user.email if obj.user else factory.faker.Faker("email").generate())
    hashed_password = hash_password("1234")

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        if "password" in kwargs:
            raw_password = kwargs.pop("password")
            kwargs["hashed_password"] = hash_password(raw_password)
        return super()._create(model_class, *args, **kwargs)
