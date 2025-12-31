# AI-Driven Learning Platform (Mini MVP) 

An innovative learning platform that allows users to explore various topics through AI-generated lessons, track their personal learning history, and manage the system via an administrative dashboard.

##  Technologies & Tools
- **Backend:** Node.js, Express, TypeScript.
- **Frontend:** React.js, TypeScript, React Router, Axios.
- **Database:** MongoDB (via Mongoose ORM).
- **AI Engine:** OpenAI API (GPT-3.5 Turbo) with a built-in Mock fallback.
- **Security:** JWT (JSON Web Tokens) for authentication and bcrypt for password hashing.
- **Environment:** Docker & Docker Compose for database orchestration.

---

##  Getting Started

### 1. Database Setup (Docker)
This project uses Docker to run MongoDB. Ensure Docker Desktop is open, then run:
```bash
docker-compose up -d
2. Backend Installation & Data Seeding
Navigate to the backend directory:

Bash

cd backend
Install dependencies:

Bash

npm install
Configure your .env file (API keys, Mongo URI, etc.).

Populate Database (Crucial Step):  run the Setup Script -npm run setup -To ensure a smooth evaluation experience, the project includes a data seeding script. Running this script accomplishes three things:

Schema Ready: It populates the MongoDB with initial Categories and Sub-categories.

Instant Testing: It creates Demo Users (both Admin and Student) so you can log in immediately without manual registration.

Full Visibility: It provides enough sample data so the Admin Dashboard and Global History features are populated and easy to review.

Bash

npm run setup

Demo Credentials (Created by Setup):

Admin User: |name: Admin User|_id: 333333333, | phone: 0500000000,

Student User:| name: Israel Israeli | _id: '123456789',| phone: '0521234567',


Start the server:

Bash

npm run dev
3. Frontend Installation
Navigate to the frontend directory:

Bash

cd frontend
Install dependencies:

Bash

npm install
Start the application:

Bash

npm start
The app will be available at http://localhost:3000.

 Key Implementation Details
Modular Architecture
The project is built with a clear separation of concerns:

Controllers: Handle incoming requests and responses.

Services: Contain core business logic (e.g., AI prompting).

Models: Define data structures for Users, Categories, and History.

Robust AI Interaction
Prompt Engineering: Optimized prompts for generating structured educational content.

Mock Mode: If the OpenAI API is unavailable or the key is missing, the system automatically switches to a "Mock Mode" to ensure the UI remains fully functional for testing.

Admin Capabilities
Users with the admin role (Defined by running npm run setup) can access a special dashboard to:

Monitor all users registered in the system.

View the full history of AI generations across the entire platform.

Filter and search through data.

Add categories and subcategories
 Assumptions
Users must provide a valid phone number during registration.

All AI-generated content is saved to the history for future reference.

The system assumes a RTL (Right-to-Left) orientation for Hebrew content where applicable.