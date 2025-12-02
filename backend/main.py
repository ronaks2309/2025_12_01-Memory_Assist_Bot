from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import sqlite3
from typing import Optional, List
from datetime import datetime


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
    conversation_id: Optional[int] = None


class ChatResponse(BaseModel):
    reply: str
    conversation_id: Optional[int] = None


class Memory(BaseModel):
    id: int
    title: str
    content: str
    created_at: str


class MemoriesList(BaseModel):
    memories: list[Memory]

# --- SQLite-backed conversations/messages ---


DB_PATH = Path(__file__).parent / "data.db"


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def ensure_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            created_at TEXT
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id INTEGER,
            role TEXT,
            content TEXT,
            timestamp TEXT,
            FOREIGN KEY(conversation_id) REFERENCES conversations(id)
        )
        """
    )
    conn.commit()
    conn.close()


class Conversation(BaseModel):
    id: int
    title: Optional[str]
    created_at: str


class ConversationsList(BaseModel):
    conversations: List[Conversation]


class MessageItem(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    timestamp: str


class MessagesList(BaseModel):
    messages: List[MessageItem]


ensure_db()


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
    # store the incoming user message (and assistant reply) in SQLite when a conversation is provided
    # create a conversation automatically if none provided
    conn = get_conn()
    cur = conn.cursor()

    conv_id = None
    if getattr(req, "conversation_id", None):
        conv_id = req.conversation_id
        # ensure conversation exists
        cur.execute("SELECT id FROM conversations WHERE id = ?", (conv_id,))
        if cur.fetchone() is None:
            conn.close()
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        # auto-create a conversation
        created_at = datetime.utcnow().isoformat()
        cur.execute(
            "INSERT INTO conversations (title, created_at) VALUES (?, ?)",
            (None, created_at),
        )
        conv_id = cur.lastrowid

    # insert user message
    user_ts = datetime.utcnow().isoformat()
    cur.execute(
        "INSERT INTO messages (conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
        (conv_id, "user", req.message, user_ts),
    )
    conn.commit()

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

    # insert assistant reply
    bot_ts = datetime.utcnow().isoformat()
    cur.execute(
        "INSERT INTO messages (conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
        (conv_id, "assistant", reply, bot_ts),
    )
    conn.commit()
    conn.close()

    return ChatResponse(reply=reply, conversation_id=conv_id)


@app.get("/memories", response_model=MemoriesList)
async def get_memories():
    # Dummy memories
    return MemoriesList(memories=[
        Memory(id=1, title="Mom's Birthday", content="Mom's birthday is March 15th", created_at="2025-11-20"),
        Memory(id=2, title="WiFi Password", content="Home WiFi password is SecurePass123!", created_at="2025-11-18"),
        Memory(id=3, title="Doctor Appointment", content="Annual checkup scheduled for Dec 15th at 2 PM", created_at="2025-11-25"),
    ])


@app.post("/conversations", response_model=Conversation)
async def create_conversation(payload: Optional[dict] = None):
    title = None
    if payload and isinstance(payload, dict):
        title = payload.get("title")

    conn = get_conn()
    cur = conn.cursor()
    created_at = datetime.utcnow().isoformat()
    cur.execute(
        "INSERT INTO conversations (title, created_at) VALUES (?, ?)",
        (title, created_at),
    )
    conv_id = cur.lastrowid
    conn.commit()
    conn.close()
    return Conversation(id=conv_id, title=title, created_at=created_at)


@app.get("/conversations", response_model=ConversationsList)
async def list_conversations():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, title, created_at FROM conversations ORDER BY id DESC")
    rows = cur.fetchall()
    convs = [Conversation(id=r["id"], title=r["title"], created_at=r["created_at"]) for r in rows]
    conn.close()
    return ConversationsList(conversations=convs)


@app.get("/conversations/{conv_id}/messages", response_model=MessagesList)
async def get_conversation_messages(conv_id: int):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, conversation_id, role, content, timestamp FROM messages WHERE conversation_id = ? ORDER BY id ASC", (conv_id,))
    rows = cur.fetchall()
    messages = [
        MessageItem(id=r["id"], conversation_id=r["conversation_id"], role=r["role"], content=r["content"], timestamp=r["timestamp"])
        for r in rows
    ]
    conn.close()
    return MessagesList(messages=messages)


@app.post("/conversations/{conv_id}/messages", response_model=MessageItem)
async def post_message(conv_id: int, payload: dict):
    role = payload.get("role")
    content = payload.get("content")
    if role not in ("user", "assistant"):
        raise HTTPException(status_code=400, detail="role must be 'user' or 'assistant'")

    ts = datetime.utcnow().isoformat()
    conn = get_conn()
    cur = conn.cursor()
    # ensure conversation exists
    cur.execute("SELECT id FROM conversations WHERE id = ?", (conv_id,))
    if cur.fetchone() is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Conversation not found")

    cur.execute(
        "INSERT INTO messages (conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
        (conv_id, role, content, ts),
    )
    msg_id = cur.lastrowid
    conn.commit()
    conn.close()
    return MessageItem(id=msg_id, conversation_id=conv_id, role=role, content=content, timestamp=ts)


# /chat-history endpoint removed (frontend no longer uses it)


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
