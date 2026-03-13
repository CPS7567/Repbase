from fastapi import FastAPI
from pydantic import BaseModel
from main import DatabaseManager
from auth import AuthDatabaseManager


app = FastAPI()

db = DatabaseManager()
auth = AuthDatabaseManager()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# ==========================
# REQUEST MODELS
# ==========================

class GymCreate(BaseModel):
    name: str
    location: str
    contact: str



class MemberCreate(BaseModel):
    username: str
    password: str
    name: str
    dob: str
    gender: str
    email: str
    phone: str
    gym_id: int

class adminCreate(BaseModel):
    username: str
    password: str
    name: str
    email: str
    phone: str
    gym_id: int

class TrainerCreate(BaseModel):
    username: str
    password: str
    name: str
    specialization: str
    phone: str
    schedule: str
    gym_id: int

class PlanCreate(BaseModel):
    plan_name: str
    duration: int
    price: float
    access_level: str
    gym_id: int
# ==========================
# GYM APIs
# ==========================

@app.post("/gym")
def add_gym(gym: GymCreate):
    result = db.insert_gym(gym.name, gym.location, gym.contact)
    return result


@app.put("/gym/{gym_id}")
def update_gym(gym_id: int, gym: GymCreate):
    result = db.update_gym(gym_id, gym.name, gym.location, gym.contact)
    return result


@app.delete("/gym/{gym_id}")
def delete_gym(gym_id: int):
    result = db.delete_gym(gym_id)
    return result


@app.post("/gymadmin")
def add_gym_admin(admin: adminCreate):
    res = auth.insert_user(admin.username, "gym_admin", admin.password)
    # error check for duplicate username can be added here

    res = auth.get_user_by_username(admin.username)
    user_id = res["user_id"]

    result = db.insert_gym_admin(
        admin.name,
        admin.email,
        admin.phone,
        admin.gym_id,
        user_id
    )
    return result

# ==========================

@app.put("/gymadmin/{user_id}")
def update_gym_admin(user_id: int, admin: adminCreate):

    result = db.update_gym_admin(user_id, admin.name, admin.email, admin.phone)
    return result


@app.post("/gymplan")
def add_gym_plan(plan: PlanCreate):
    result = db.insert_plan(
        plan.plan_name,
        plan.duration,
        plan.price,
        plan.access_level,
        plan.gym_id
    )
    return result

@app.put("/gymplan/{plan_id}")
def update_gym_plan(plan_id: int, plan: PlanCreate):
    result = db.update_plan(
        plan_id,
        plan.gym_id,
        plan.plan_name,
        plan.duration,
        plan.price,
        plan.access_level
    )
    return result

@app.delete("/gymplan/{plan_id}")
def delete_gym_plan(plan_id: int):
    result = db.delete_plan(plan_id)
    return result

@app.post("/membership/{user_id}")
def add_membership(user_id: int, plan_id: int, start_date: str, expiry_date: str, status: str):
    res = db.get_member_id(user_id)
    member_id = res["member_id"]
    result = db.insert_membership(member_id, plan_id, start_date, expiry_date, status)
    return result
# MEMBER APIs
# ==========================




@app.post("/member")
def add_member(member: MemberCreate):
    result = auth.insert_user(member.username, "member", member.password)
    res = auth.get_user_by_username(member.username)
    user_id = res["user_id"]

    result = db.insert_member(
        member.name,
        member.dob,
        member.gender,
        member.email,
        member.phone,
        member.gym_id
        ,user_id
    )
    return result

@app.post("/trainer")
def add_trainer(trainer: TrainerCreate):
    result = auth.insert_user(trainer.username, "trainer", trainer.password)
    res = auth.get_user_by_username(trainer.username)
    user_id = res["user_id"]

    result = db.insert_trainer(
        trainer.name,
        trainer.specialization,
        trainer.phone,
        trainer.schedule,
        trainer.gym_id
        ,user_id
    )
    return result

