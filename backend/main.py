from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Memory Assist AI Service")

# Allow local frontend dev server to call this API during development.
# Adjust `allow_origins` to your frontend origin(s) in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


class Memory(BaseModel):
    id: int
    title: str
    content: str
    created_at: str


class MemoriesList(BaseModel):
    memories: list[Memory]


class ChatEntry(BaseModel):
    id: int
    title: str
    date: str
    message_count: int


class ChatHistoryList(BaseModel):
    entries: list[ChatEntry]


class Person(BaseModel):
    id: int
    name: str
    relationship: str
    birthday: str


class PeopleList(BaseModel):
    people: list[Person]


class Place(BaseModel):
    id: int
    name: str
    description: str
    visits: int


class PlacesList(BaseModel):
    places: list[Place]


class Birthday(BaseModel):
    id: int
    name: str
    date: str
    days_until: int


class BirthdaysList(BaseModel):
    birthdays: list[Birthday]


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    # super simple hello-world AI
    if "remember" in req.message.lower():
        reply = (
            "Okay, I'll remember that. Later, you can ask me about it and I'll remind you. "
            "For now, this is just a demo and doesn't actually store it."
        )
    else:
        reply = (
            "I'm your memory helper. You can say things like:\n"
            "- \"Remember that my daughter visits on Sunday\"\n"
            "- \"Remember my wifi password is ...\""
        )

    return ChatResponse(reply=reply)


@app.get("/memories", response_model=MemoriesList)
async def get_memories():
    # Dummy memories
    return MemoriesList(memories=[
        Memory(id=1, title="Mom's Birthday", content="Mom's birthday is March 15th", created_at="2025-11-20"),
        Memory(id=2, title="WiFi Password", content="Home WiFi password is SecurePass123!", created_at="2025-11-18"),
        Memory(id=3, title="Doctor Appointment", content="Annual checkup scheduled for Dec 15th at 2 PM", created_at="2025-11-25"),
    ])


@app.get("/chat-history", response_model=ChatHistoryList)
async def get_chat_history():
    # Dummy chat history
    return ChatHistoryList(entries=[
        ChatEntry(id=1, title="Birthday Discussion", date="2025-11-28", message_count=12),
        ChatEntry(id=2, title="Travel Plans", date="2025-11-25", message_count=8),
        ChatEntry(id=3, title="Work Projects", date="2025-11-20", message_count=15),
    ])


@app.get("/people", response_model=PeopleList)
async def get_people():
    # Dummy people
    return PeopleList(people=[
        Person(id=1, name="Sarah Johnson", relationship="Sister", birthday="1990-05-12"),
        Person(id=2, name="Michael Chen", relationship="Best Friend", birthday="1988-08-03"),
        Person(id=3, name="Emma Wilson", relationship="Colleague", birthday="1995-12-21"),
    ])


@app.get("/places", response_model=PlacesList)
async def get_places():
    # Dummy places
    return PlacesList(places=[
        Place(id=1, name="Central Park", description="NYC's iconic park for outdoor activities", visits=5),
        Place(id=2, name="Local Coffee Shop", description="Favorite coffee spot downtown", visits=23),
        Place(id=3, name="Mountain Trail", description="Beautiful hiking trail with scenic views", visits=2),
    ])


@app.get("/birthdays", response_model=BirthdaysList)
async def get_birthdays():
    # Dummy birthdays with days until
    return BirthdaysList(birthdays=[
        Birthday(id=1, name="Sarah Johnson", date="May 12", days_until=163),
        Birthday(id=2, name="Michael Chen", date="August 3", days_until=245),
        Birthday(id=3, name="Emma Wilson", date="December 21", days_until=20),
    ])


@app.get("/")
def root():
    return {"message": "Memory Assist Bot is running!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8001)

# To run the app, use the command:
# python backend/main.py
# uvicorn main:app --reload --port 8001
# uvicorn backend.main:app --reload --host localhost --port 8001  
# The app will be accessible at http://localhost:8001  
# http://127.0.0.1:8001/docs. Click on the POST /chat section. Click Try it out
