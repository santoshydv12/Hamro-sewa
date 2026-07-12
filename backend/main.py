from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import auth, users, professionals, bookings, admin

# Automatically create tables inside MySQL if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hamro Sewa App Engine")

# Configure CORS so your React frontend can speak to this port safely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect all the route files
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(professionals.router)
app.include_router(bookings.router)
app.include_router(admin.router)

@app.get("/")
def index():
    return {"status": "Online", "project": "Hamro Sewa Backend Central Hub"}