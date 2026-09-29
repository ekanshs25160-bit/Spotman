# File Uploader

A personal cloud storage backend — a stripped-down Google Drive — built with **Node.js**, **Express**, **MongoDB Atlas**, **Passport.js**, and **Multer**.

Authenticated users can organize files into nested folders, upload files, view file details, and download them.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Server | Express 5 (ES Modules) |
| Database | MongoDB Atlas via Mongoose |
| Authentication | Passport.js (Local Strategy) + express-session |
| Session Storage | connect-mongo (persisted in MongoDB) |
| Password Hashing | bcryptjs |
| File Uploads | Multer (disk storage) |
| Environment | dotenv |

---

## Features

- **User Registration & Login** — Secure password hashing with bcryptjs.
- **Session Persistence** — Sessions survive server restarts (stored in MongoDB Atlas).
- **Route Protection** — All file and folder endpoints require an authenticated session.
- **Folder Management** — Create, list, view contents, rename, and delete folders.
- **Nested Folders** — Folders can be placed inside other folders via `parentFolder`.
- **File Uploads** — Upload files to root or into a specific folder via Multer.
- **File Details & Download** — View metadata and stream files back to the client.
- **Ownership Checks** — Users can only access and modify their own resources.

---

## Project Structure

```
.
├── index.js                    # Entry point: connects DB then starts server
├── app.js                      # Express app: middleware, session, passport, routes
├── uploads/                    # Local file storage (disk)
├── src/
│   ├── config/
│   │   └── passport.js         # Passport LocalStrategy, serialize/deserialize
│   ├── controllers/
│   │   ├── auth.controller.js  # registerUser
│   │   ├── folder.controllers.js # CRUD for folders
│   │   └── file.controller.js  # uploadFile, getFileById, downloadFile, deleteFile
│   ├── db/
│   │   └── index.js            # Mongoose connection
│   ├── middleware/
│   │   ├── auth.middleware.js  # isAuthenticated guard
│   │   └── multer.middleware.js # Multer diskStorage configuration
│   ├── models/
│   │   ├── user.model.js       # User schema (email, username, password)
│   │   ├── folder.model.js     # Folder schema (name, owner, parentFolder)
│   │   └── file.model.js       # File schema (name, size, mimeType, url, folder, owner)
│   └── routes/
│       ├── auth.routes.js      # POST /auth/register, /auth/login, /auth/logout
│       ├── folder.routes.js    # CRUD /folders
│       └── file.routes.js      # Upload, view, download, delete /files
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
SESSION_SECRET="your_random_secret"
MONGO_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net?retryWrites=true&w=majority"
```

### 3. Start the Development Server

```bash
npm run dev
```

The server starts at `http://localhost:3000`.

---

## API Reference

All routes except `/auth/*` require an authenticated session (session cookie).

### Auth

| Method | Route | Description |
|---|---|---|
| `POST` | `/auth/register` | Create a new user account |
| `POST` | `/auth/login` | Log in and receive session cookie |
| `POST` | `/auth/logout` | Destroy session and log out |

**Register body:**
```json
{
  "name": "Jane Doe",
  "username": "janedoe",
  "email": "jane@example.com",
  "password": "supersecret"
}
```

**Login body:**
```json
{
  "email": "jane@example.com",
  "password": "supersecret"
}
```

---

### Folders

| Method | Route | Description |
|---|---|---|
| `GET` | `/folders` | List all folders owned by the user |
| `POST` | `/folders` | Create a new folder |
| `GET` | `/folders/:folderId` | View folder contents (subfolders + files) |
| `PUT` | `/folders/:folderId` | Rename a folder |
| `DELETE` | `/folders/:folderId` | Delete a folder |

**Create folder body:**
```json
{
  "name": "My Documents",
  "parentFolder": "<parentFolderId_or_omit_for_root>"
}
```

---

### Files

| Method | Route | Description |
|---|---|---|
| `POST` | `/files` | Upload a file to root (multipart/form-data) |
| `POST` | `/folders/:folderId/files` | Upload a file into a folder |
| `GET` | `/files/:fileId` | Get file metadata |
| `GET` | `/files/:fileId/download` | Download the file |
| `DELETE` | `/files/:fileId` | Delete a file |

**Upload — form-data field:**
- Key: `file` (type: File)

---

## Security Notes

- Passwords are hashed with bcryptjs before storage; raw passwords are never saved.
- Sessions are stored server-side in MongoDB Atlas, not in client-side cookies.
- All folder and file operations verify that the requesting user owns the resource before proceeding.
- `req.user` is populated from the session on every request via Passport's `deserializeUser`.


