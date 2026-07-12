from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from config import settings

# This tells Python how to talk to your running XAMPP server
engine = create_engine(
    settings.DATABASE_URL, 
    pool_pre_ping=True,  # Keeps connection alive
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# This injects the database connection safely into our code later
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()