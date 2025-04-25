## 🎬 Review Pilem API
An API for managing film reviews using Express.js and SQL Server. Features include user authentication, film and genre management, curated lists, reviews, and user reactions.

## 📁 Project Structure
```
review-pilem-api/
├── src/
  ├── config/               # Handling database connection
  ├── controllers/          # Route logic handlers
  ├── middlewares/          # Middleware (e.g., auth, validation)
  ├── models/               # Models to interact with database
  ├── routes/               # API route definitions
  ├── db/                   # Contains database seeder file
  └── app.js                # Entry point of the application
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
git clone https://github.com/eggseedd/review-pilem-api.git
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
npm run devStart
```
## 🗂️ CDM (Conceptual Data Model)
![ReviewPilem-2025-04-25_08-55](https://github.com/user-attachments/assets/c3124088-7d90-4840-8597-681a5c5482ec)

## 🧱 PDM (Physical Data Model)
![ReviewPilem_Physical_Export-2025-04-25_08-55](https://github.com/user-attachments/assets/32ce6a5b-3c37-497f-b0ff-ba77260a6369)

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
