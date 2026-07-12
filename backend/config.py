import os

class Settings:
    PROJECT_NAME: str = "Hamro Sewa Engine"
    PROJECT_VERSION: str = "1.0.0"
    
    # Connection target for XAMPP MySQL Default Pool
    DATABASE_URL: str = "mysql+pymysql://root:@localhost/hamro_sewa_db"
    
    # Cryptography configurations for password hashing and token generation
    SECRET_KEY: str = "SUPER_SECRET_HAMRO_SEWA_KEY_2026_NEPAL_NCIT"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # Tokens last 24 hours

settings = Settings()