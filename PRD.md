# Product Requirements Document (PRD)

## File Uploader

### 1. Product Overview

**Product Name:** File Uploader
**Version:** 1.0.0
**Product Type:** Full-stack web application (personal cloud storage, stripped-down Google Drive)

File Uploader is a personal storage service that lets authenticated users organize files into folders, upload them to cloud storage, view file details, download files, and optionally generate time-limited public share links for folders. The backend is built with Express and Prisma; authentication is session-based via Passport.js with sessions persisted in the database.

### 2. Target Users

- **Registered Users:** Create an account, log in, and manage their own private files and folders.
- **Link Recipients (unauthenticated):** Anyone holding a valid share link can view/download the shared folder's contents without an account, for the duration the owner specified.

### 3. Core Features

#### 3.1 Authentication & Session Management

- **Project & dependency setup:** ☐ Express + Prisma project scaffolded, all core dependencies installed (Passport, multer, session store, etc.)
- **User registration:** ☐ Account creation (email/username + password)
- **User login:** ☐ Passport.js local strategy authentication
- **Session persistence:** ☐ Sessions stored in the database via the Prisma session store, surviving server restarts
- **Logout:** ☐ Destroy session and clear session cookie
- **Route protection:** ☐ Middleware to guard all file/folder routes behind an authenticated-session check

#### 3.2 File Upload (Local, Interim)

- **Upload form:** ☐ Authenticated users can select and upload a file
- **Local filesystem storage:** ☐ Initial implementation saves uploaded files to disk via Multer middleware (placeholder before cloud storage is wired in)

#### 3.3 Folder Management

- **Create folder:** ☐ Authenticated users can create folders
- **List folders:** ☐ View folders (and nested contents) belonging to the user
- **Rename/update folder:** ☐ Edit folder name
- **Delete folder:** ☐ Remove a folder (and decide cascade behavior for its files)
- **Upload into a folder:** ☐ Files can be uploaded directly into a specific folder
- **Database relations:** ☐ Folder–file and folder–owner relations modeled in Prisma schema

#### 3.4 File Details & Download

- **File detail view:** ☐ Page showing name, size, and upload timestamp for a specific file
- **Download:** ☐ Button/route that streams or redirects to the file for download

#### 3.5 Cloud Storage Integration

- **Cloud upload:** ☐ Replace/augment local disk storage with a cloud storage provider (Cloudinary or Supabase Storage)
- **URL persistence:** ☐ Save the returned cloud file URL (and any needed metadata) in the database instead of a local path
- **Migration path:** ☐ Decide whether existing local files are migrated or the switch only applies going forward

#### 3.6 File Validation

- **Type restriction:** ☐ Allow-list or block-list of accepted MIME types/extensions
- **Size restriction:** ☐ Maximum upload size enforced (client-side hint + server-side hard limit via Multer)
- **Error feedback:** ☐ Clear rejection messages when a file fails validation

#### 3.7 Folder Sharing (Extra Credit)

- **Share form:** ☐ Owner selects a duration (e.g. 1d, 10d) for a folder to be shared
- **Link generation:** ☐ Unique share link created (UUID-based path, e.g. `/share/:uuid`)
- **Public access:** ☐ Unauthenticated visitors with a valid, unexpired link can view/download the shared folder's contents
- **Expiration enforcement:** ☐ Links stop working after the specified duration
- **Revocation (optional):** ☐ Owner can manually invalidate a share link early

### 4. Technical Specifications

#### 4.1 Suggested Route Structure

**Auth Routes**

- `GET /register`, `POST /register` ☐ — Registration form + handler
- `GET /login`, `POST /login` ☐ — Login form + Passport authentication
- `POST /logout` ☐ — Destroy session

**Folder Routes** (secured)

- `GET /folders` ☐ — List user's folders
- `POST /folders` ☐ — Create folder
- `GET /folders/:folderId` ☐ — View folder contents
- `PUT /folders/:folderId` ☐ — Rename/update folder
- `DELETE /folders/:folderId` ☐ — Delete folder

**File Routes** (secured)

- `POST /folders/:folderId/files` ☐ — Upload file into a folder
- `POST /files` ☐ — Upload file to root (no folder)
- `GET /files/:fileId` ☐ — File detail view
- `GET /files/:fileId/download` ☐ — Download file
- `DELETE /files/:fileId` ☐ — Delete file

**Share Routes (extra credit)**

- `POST /folders/:folderId/share` ☐ — Generate a share link with a duration
- `GET /share/:uuid` ☐ — Public, unauthenticated view of a shared folder's contents (only while unexpired)

#### 4.2 Data Models (indicative)

- **User:** id, email/username, hashed password, timestamps
- **Folder:** id, name, ownerId (→ User), parentFolderId (nullable, if nesting is supported), timestamps
- **File:** id, name, size, mimeType, url (cloud storage), folderId (nullable, → Folder), ownerId (→ User), uploadedAt
- **Session:** managed by the Prisma session store (per its schema)
- **ShareLink (extra credit):** id (UUID), folderId (→ Folder), expiresAt, createdAt, revoked (boolean, optional)

#### 4.3 Dependencies

- **Express** — server framework
- **Prisma** — ORM/database access
- **Passport.js** (+ `passport-local`) — authentication
- **prisma-session-store** — persist sessions in the database
- **Multer** — multipart/form-data file upload handling
- **Cloudinary SDK or Supabase client** — cloud file storage
- **A view/templating layer or frontend framework** — for forms and file/folder browsing UI (not yet decided)

### 5. Security & Validation

- Passwords hashed before storage (e.g. bcrypt) ☐
- Sessions persisted server-side (not just signed client cookies) via Prisma session store ☐
- All folder/file routes check the requesting user owns the resource before allowing access ☐
- Upload validation: file type allow-list and max size enforced server-side (not just in the form) ☐
- Share links: UUID unguessable, expiration checked on every access, no auth bypass beyond the shared folder's contents ☐

### 6. Open Decisions

- **Cloud storage provider:** Cloudinary vs. Supabase Storage — affects SDK, URL format, and free-tier limits.
- **Folder nesting:** flat folders vs. arbitrary nested subfolders — affects schema (`parentFolderId`) and UI complexity.
- **Cascade behavior:** what happens to files when their parent folder is deleted (block, cascade-delete, or move to root).
- **Share link revocation:** whether owners can manually kill a link before its natural expiry.
- **File replace/versioning:** out of scope unless explicitly added later.

### 7. Success Criteria

- ☐ User can register, log in, and stay logged in across requests via a persisted session
- ☐ User can create folders and upload files into them
- ☐ Uploaded files are validated (type/size) before being accepted
- ☐ Files are stored in a cloud provider with the URL saved in the database (not just local disk)
- ☐ File detail page shows name, size, upload time, and allows download
- ☐ (Extra credit) Owner can generate a time-limited share link, and an unauthenticated visitor can access the shared folder's contents until it expires
