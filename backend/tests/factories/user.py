import factory
from app.models.user import User, AuthCredentials
from app.core.auth import hash_password


class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = User
        sqlalchemy_session_persistence = "commit"

    email = factory.faker.Faker("email")
    name = factory.faker.Faker("name")

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        # Extract password if provided, default to "1234"
        password = kwargs.pop("password", "1234")
        
        # Create the User instance
        user = super()._create(model_class, *args, **kwargs)
        
        # Create associated AuthCredentials
        session = cls._meta.sqlalchemy_session
        auth_credentials = AuthCredentials(
            user_id=user.id,
            provider="local",
            provider_user_id=user.email,
            hashed_password=hash_password(password)
        )
        session.add(auth_credentials)
        session.commit()
        session.refresh(user)
        
        return user
