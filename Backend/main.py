from fastapi import FastAPI, HTTPException, status, Depends, Body
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from db_models import Base, User as UserModel
from models import UserCreate, UserLogin, UserResponse, AdminLoginRequest, PromptRequest
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from gpt4all import GPT4All
from typing import List

app = FastAPI()

model_path = "D:/Projects/Project_Extras/Meta-Llama-3-8B-Instruct.Q4_0.gguf"
try:
    gpt4all_model = GPT4All(model_path, allow_download=False)
except Exception as e:
    raise RuntimeError(f"Failed to load GPT4All model: {e}. Please ensure the model file exists at {model_path}.")

DATABASE_URL = "sqlite:///./users.db"
ADMIN_CREDENTIALS = {"email": "admin@gmail.com", "password": "admin123"}

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create the database tables
Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def hash_password(password: str):
    return pwd_context.hash(password)


@app.get("/")
def read_root():
    return {"message": "Welcome!"}


@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(UserModel).filter(
        (UserModel.username == user.username) | (UserModel.email == user.email)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(user.password)
    new_user = UserModel(username=user.username, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully!"}


@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")
    return {
        "message": "Login successful.",
        "username": db_user.username,
        "email": db_user.email
    }

@app.post("/admin-login", response_model=List[UserResponse])
def admin_login(admin_request: AdminLoginRequest = Body(...), db: Session = Depends(get_db)):
    if admin_request.email == ADMIN_CREDENTIALS["email"] and admin_request.password == ADMIN_CREDENTIALS["password"]:
        users = db.query(UserModel).all()
        return users
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials.")


@app.get("/admin/users", response_model=List[UserResponse])
def get_all_users(email: str, password: str, db: Session = Depends(get_db)):
    if email != ADMIN_CREDENTIALS["email"] or password != ADMIN_CREDENTIALS["password"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials.")
    users = db.query(UserModel).all()
    return users

@app.delete("/admin/users/{user_id}")
def delete_user(user_id: int, email: str, password: str, db: Session = Depends(get_db)):
    if email != ADMIN_CREDENTIALS["email"] or password != ADMIN_CREDENTIALS["password"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials.")
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    db.delete(user)
    db.commit()
    return {"message": f"User with id {user_id} deleted successfully."}

@app.post("/generate")
async def generate_answer(request: PromptRequest):
    try:
        # response = gpt4all_model.generate("Hello, world!", max_tokens=10)
        # print(response)
        response = gpt4all_model.generate(request.prompt, max_tokens=100)
        return {"answer": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GPT4All error: {str(e)}")

# @app.post("/admin/login")
# def admin_login(admin: AdminLoginRequest):
#     if admin.username == ADMIN_CREDENTIALS["username"] and admin.password == ADMIN_CREDENTIALS["password"]:
#         return {"message": "Admin login successful."}
#     else:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials.")
#
#
# @app.get("/admin/users", response_model=List[UserResponse])
# def get_all_users(
#         username: str,
#         password: str,
#         db: Session = Depends(get_db)
# ):
#     if username != ADMIN_CREDENTIALS["username"] or password != ADMIN_CREDENTIALS["password"]:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials.")
#
#     users = db.query(UserModel).all()
#     return users
#
# @app.delete("/admin/users/{user_id}")
# def delete_user(user_id: int, admin: AdminLoginRequest, db: Session = Depends(get_db)):
#     if admin.username != ADMIN_CREDENTIALS["username"] or admin.password != ADMIN_CREDENTIALS["password"]:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials.")
#     user = db.query(UserModel).filter(UserModel.id == user_id).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found.")
#     db.delete(user)
#     db.commit()
#     return {"message": f"User with id {user_id} deleted successfully."}
