"Importing our modules so that we can create our backend and connect opur database eventually to our frontend"

import os

from supabase import create_client, Client

from fastapi import FastAPI

from pydantic import BaseModel


#We need to makle sure that we have our url and key, to test whether or not we are creating our backend correctly"

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")



#Now we have created our web client in order to test whetehr or not these variables that are ahrd coded actually work or not"
supabase: Client = create_client(url, key)

print("Connected")

#This is supposed to fetching data"

response = supabase.table("profiles").select("*").execute()

print(response.data)

#Now we will create our functionality with our FastAPI"

#This is creating our instance of FastAPI"
app = FastAPI()

#This line is basically a GET request so that we can check we received anything from our users or database"

#get is helping us fetch our data and the slash is the route or the URL"


#sync def root():
    #return {"message": "Hello World"}

#This helps us understand and define the route that we are making a GET request for in order to succesffuly recieved data"

# supabase.auth.sign_up({"email": "randomtest123@gmail.com", "password": "123456"})


#Now we need to authenticate our sign up users and see with teh current dummy data that we have that it works and sends out the data and that its successful"

#We need to create a class Login Request in order to fully send in the request
class LoginRequest(BaseModel):
    email: str
    password: str

# We need to create a class called EventRequest in order to send the data to our datatbase about calendar events
class EventRequest(BaseModel):
    user_id: str
    title: str
    start_date: str
    end_date: str
    location: str 
    event_type: str 
    start_time: str
    end_time: str




@app.post("/signup")
def sign_up(request: LoginRequest):
    supabase.auth.sign_up({"email": request.email, "password": request.password})
    return {"message": "User signed up"}

@app.post("/login")
def login(request: LoginRequest):
    supabase.auth.sign_in_with_password({"email": request.email, "password": request.password})
    return {"message": "User now successfully logged in"}

@app.post("/create_event")
def create_event(request: EventRequest):
    #Now we need to fetch the dat that is contained in the request
    supabase.table("events").insert({
        "user_id": request.user_id,
        "title": request.title,
        "start_date": request.start_date,
        "end_date": request.end_date,
        "location": request.location,
        "event_type": request.event_type,
        "start_time": request.start_time,
        "end_time": request.end_time}).execute()
    return {"message": "Event created successfully"}

#Now we need to create a en end point in order to get the events of a spe3cific user
@app.get("/events")

#Create the function now and have the paramter be your user id and execute fetching the data
def get_events(user_id: str):
    response = supabase.table("events").select("*").eq("user_id", user_id).execute()

    #Now we need to return our data 
    return response.data