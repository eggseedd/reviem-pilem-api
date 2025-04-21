## 🎬 Review Pilem API
An API for managing film reviews using Express.js and SQL Server. Features include user authentication, film and genre management, curated lists, reviews, and user reactions.

## 📁 Project Structure
```
review-pilem-api/
├── controllers/          # Route logic handlers
├── middlewares/          # Middleware (e.g., auth, validation)
├── models/               # Models to interact with database
├── routes/               # API route definitions
├── utils/                # Utility functions
├── config/               # Configuration files
├── app.js                # Entry point of the application
├── .env.example          # Example environment variables
└── README.md             # Project documentation
```

## 🚀 Features
- JWT-based user authentication
  
- Role-based access (Admin, User, Guest)

- CRUD operations for:

  - Genres — Create, Read, Update
  
  - Films — Full CRUD
  
  - Film Lists (user-curated) — Create, Read, Update
  
  - Reviews — Full CRUD
  
  - Reactions — Like and Dislike functionality


## 🔧 Installation
Clone the repository:

```
git clone https://github.com/yourusername/review-pilem-api.git
cd review-pilem-api
```
Install dependencies:

```
npm install
```
Set up your environment variables:

```
cp .env.example .env
# Then edit .env with your own credentials
```
Run the server:

```
npm run dev
```
## 🗂️ CDM (Conceptual Data Model)
*To be inserted here.*

## 🧱 PDM (Physical Data Model)
*To be inserted here.*

## 📬 API Documentation
The full API documentation can be accessed here:

👉 [Click here to view the API Docs](https://eggseedd.github.io/review-pilem-api/)

## 👥 User Roles
Role	Permissions

| **User**  | **Permissions** |
| ------------- | ------------- |
| **Admin**  | 	Can add/edit genres (not delete), manage full film data including status and metadata  |
| **User**  | Can manage profile, organize films into lists, write/edit/delete reviews, and like/dislike reviews  |
| **Guest**	  | Can browse films, view detailed films info, access user profiles, and search films by title  |

## 🛠 Tech Stack
- Node.js + Express.js
  
- SQL Server (Database)
  
- JWT (Authentication)