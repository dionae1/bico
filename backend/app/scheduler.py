from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.db.session import SessionLocal
from datetime import datetime, timezone

from app.models.user import User

scheduler = AsyncIOScheduler()


def cleanup_demo_accounts():
    print("Running cleanup_demo_accounts job")
    db = SessionLocal()
    now = datetime.now(timezone.utc)

    q = db.query(User).filter(
        User.is_demo == True,
        User.demo_expiration != None,
        User.demo_expiration < now,
    )

    if q.count() > 0:
        print(f"Cleaning up {q.count()} expired demo accounts")
        q.delete(synchronize_session=False)
        db.commit()

    db.close()
