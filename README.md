# InsightX - AI Chatbot

A modern, beautiful AI-powered chatbot application built with FastAPI backend and React frontend, powered by Groq's LLM.

## Features

- 🤖 **AI-Powered Conversations**: Uses Groq's Llama 3.1 8B model for intelligent responses
- 💬 **Beautiful UI**: Modern, responsive design with smooth animations and glassmorphism effects
- 📝 **Markdown Support**: Renders bold, italic, lists, and code formatting in messages
- 🔄 **Conversation Management**: Maintains conversation context across messages
- ⚡ **Fast & Responsive**: Built with FastAPI and React for optimal performance

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Groq**: AI inference platform
- **Uvicorn**: ASGI server
- **Python 3.12+**

### Frontend
- **React 19**: UI library
- **Vite**: Build tool and dev server
- **Custom CSS**: Modern styling with animations

## Prerequisites

- Python 3.12 or higher
- Node.js 18+ and npm
- Groq API key ([Get one here](https://console.groq.com/))

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python3 -m venv venv
```

3. Activate the virtual environment:
```bash
# Linux/Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file in the backend directory:
```bash
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend/chatbot
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Start the Backend Server

1. Activate the virtual environment (if not already active):
```bash
cd backend
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows
```

2. Run the server:
```bash
uvicorn app:app --reload
```

The backend will be available at `http://localhost:8000`

### Start the Frontend Development Server

1. Navigate to the frontend directory:
```bash
cd frontend/chatbot
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port shown in terminal)

## API Endpoints

### `GET /`
Returns API status and available endpoints.

### `POST /chat/`
Send a message to the chatbot.

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "role": "user",
  "conversation_id": "unique-conversation-id"
}
```

**Response:**
```json
{
  "response": "Hello! I'm doing well, thank you for asking...",
  "conversation_id": "unique-conversation-id"
}
```

### Interactive API Documentation

Visit `http://localhost:8000/docs` to access the interactive Swagger UI documentation.

## Project Structure

```
Chatbot/
├── backend/
│   ├── app.py              # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # Environment variables (create this)
│   ├── .gitignore          # Git ignore rules
│   └── venv/               # Virtual environment
│
└── frontend/
    └── chatbot/
        ├── src/
        │   ├── App.jsx     # Main React component
        │   ├── App.css     # Component styles
        │   ├── main.jsx    # React entry point
        │   └── index.css   # Global styles
        ├── package.json    # Node dependencies
        └── vite.config.js  # Vite configuration
```

## Configuration

### Backend Configuration

The backend requires a Groq API key. Create a `.env` file in the `backend` directory:

```env
GROQ_API_KEY=your_api_key_here
```

### Frontend Configuration

Update the API URL in `src/App.jsx` if your backend runs on a different host/port:

```javascript
const response = await fetch(`http://localhost:8000/chat/`, {
  // ... rest of the code
});
```

## Features in Detail

### Markdown Support
The chatbot supports rendering markdown in messages:
- **Bold text**: `**text**`
- *Italic text*: `*text*`
- Lists: Numbered (`1. Item`) and bulleted (`- Item`)
- `Code`: Inline code with `` `code` ``

### Conversation Management
Each conversation maintains its own context using a unique `conversation_id`. Messages are stored in memory for the session duration.

## Development

### Backend Development

The server runs with auto-reload enabled. Changes to `app.py` will automatically restart the server.

### Frontend Development

The Vite dev server supports Hot Module Replacement (HMR) for instant updates.

## Building for Production

### Frontend

Build the frontend for production:
```bash
cd frontend/chatbot
npm run build
```

The built files will be in the `dist` directory.

### Backend

For production deployment, consider using a production ASGI server like Gunicorn with Uvicorn workers:

```bash
pip install gunicorn
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## License

This project is open source and available for personal and commercial use.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on the repository.

