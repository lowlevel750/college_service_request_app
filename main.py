from fastapi import FastAPI

from admin import auth
from admin import register_user
from admin import login
from admin import get_users
from admin import get_user
from admin import update_user
from admin import delete_user
from admin import create_category
from admin import get_categories
from admin import get_category
from admin import update_category
from admin import delete_category

from student import create_request
from student import get_requests
from student import get_request
from student import update_request
from student import delete_request

from staff import get_staff_requests
from staff import get_staff_request
from staff import assign_request
from staff import update_request_status
from staff import delete_request as staff_delete_request


app = FastAPI(title="College Service Request System")


# Admin / Authentication
app.include_router(register_user.router)
app.include_router(login.router)
app.include_router(get_users.router)
app.include_router(get_user.router)
app.include_router(update_user.router)
app.include_router(delete_user.router)

app.include_router(create_category.router)
app.include_router(get_categories.router)
app.include_router(get_category.router)
app.include_router(update_category.router)
app.include_router(delete_category.router)


# Student / Faculty
app.include_router(create_request.router)
app.include_router(get_requests.router)
app.include_router(get_request.router)
app.include_router(update_request.router)
app.include_router(delete_request.router)


# Service Staff / Lead
app.include_router(get_staff_requests.router)
app.include_router(get_staff_request.router)
app.include_router(assign_request.router)
app.include_router(update_request_status.router)
app.include_router(staff_delete_request.router)


@app.get("/")
def root():
    return {"message": "College Service Request System API is running"}


@app.get("/health")
def health():
    return {"status": "OK"}
