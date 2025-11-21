# **Univera — API Design**
This document defines the main API surface for Univera. It is written in a backend-agnostic style but assumes a RESTful JSON API layered on top of Supabase/Postgres (or a similar service).

Authentication is handled via Supabase Auth/JWT. All endpoints require authentication unless explicitly marked as public.

Base URL (example): `/api/v1`.

---

## **1. Authentication & Users**

> Supabase/Firebase will handle most of this. These endpoints are conceptual and may be partly replaced by the auth provider.

### **1.1 POST /auth/signup**
- **Description:** Create a new user.
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "string",
  "role": "student" | "parent"
}
```
- **Response:**
```json
{
  "userId": "uuid",
  "token": "jwt-token"
}
```

### **1.2 POST /auth/login**
- **Description:** Log in an existing user.
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```
- **Response:** Same as signup.

### **1.3 GET /auth/me**
- **Description:** Get the current authenticated user.
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "student",
  "linkedStudentId": "uuid-or-null"
}
```

---

## **2. Student Profile**

### **2.1 GET /profiles/me**
- **Description:** Get the authenticated student's profile.
- **Response:** `StudentProfile` object (see DATA_MODELS.md).

### **2.2 PUT /profiles/me**
- **Description:** Update entire profile.
- **Body:** partial or full `StudentProfile`.
- **Response:** Updated `StudentProfile`.

### **2.3 PATCH /profiles/me/section/:sectionKey**
- **Description:** Update a specific section (e.g., academics, extracurriculars, preferences).
- **Body:** Section object.
- **Response:** Updated `StudentProfile` or section.

---

## **3. Extracurriculars**

### **3.1 POST /profiles/me/extracurriculars**
- **Description:** Add a new EC entry.
- **Body:**
```json
{
  "title": "string",
  "category": "sports",
  "description": "optional",
  "years": 3,
  "hoursPerWeek": 5,
  "leadership": true,
  "achievements": "optional"
}
```

### **3.2 PUT /profiles/me/extracurriculars/:id**
- **Description:** Update an EC entry.

### **3.3 DELETE /profiles/me/extracurriculars/:id**
- **Description:** Remove an EC entry.

---

## **4. Colleges**

### **4.1 GET /colleges**
- **Description:** List colleges with filters.
- **Query Params (optional):**
  - `search` (string)
  - `region` (string)
  - `type` (public/private)
  - `category` (reach/target/safety) — if match filtering is enabled
  - `limit`, `offset`

- **Response:**
```json
{
  "items": [College],
  "total": 1234
}
```

### **4.2 GET /colleges/:collegeId**
- **Description:** Get college detail.
- **Response:** `College` object.

---

## **5. College Matches**

### **5.1 POST /matches/compute**
- **Description:** Compute matches for current student (optional server-side engine).
- **Body (optional):** Advanced options or overrides.
- **Response:**
```json
{
  "results": [CollegeFit]
}
```

> Alternatively, match computation can be fully client-side.

### **5.2 GET /matches**
- **Description:** Retrieve last known match results for student.
- **Response:** array of `CollegeFit`.

---

## **6. Saved Colleges**

### **6.1 GET /saved-colleges**
- **Description:** Get list of saved colleges for student.

### **6.2 POST /saved-colleges**
- **Body:**
```json
{ "collegeId": "uuid" }
```

### **6.3 DELETE /saved-colleges/:collegeId**
- **Description:** Remove saved college.

---

## **7. Tasks & Timeline**

### **7.1 GET /tasks**
- **Description:** Get tasks for the student.
- **Query Params:**
  - `phase` (optional)

- **Response:** array of `Task`.

### **7.2 PATCH /tasks/:taskId**
- **Description:** Update task status.
- **Body:**
```json
{ "status": "not_started" | "in_progress" | "done" }
```

---

## **8. Essays**

### **8.1 GET /essays**
- **Description:** List all essay records for student.

### **8.2 POST /essays**
- **Description:** Create new essay entry.
- **Body:**
```json
{
  "type": "CommonApp",
  "prompt": "optional"
}
```

### **8.3 PATCH /essays/:essayId**
- **Description:** Update essay ideas or status.
- **Body:**
```json
{
  "ideas": ["idea1", "idea2"],
  "status": "brainstorming"
}
```

---

## **9. Parent Links**

### **9.1 POST /parent-links**
- **Description:** Parent links to a student profile.
- **Body:**
```json
{
  "studentId": "uuid",
  "relationship": "mother"
}
```

### **9.2 GET /parent-links**
- **Description:** Get all student profiles linked to parent.

- **Response:**
```json
{
  "students": [StudentProfile]
}
```

---

## **10. Document Vault**

### **10.1 GET /documents**
- **Description:** List uploaded documents.

### **10.2 POST /documents**
- **Description:** Upload a document (signed URL or direct upload depending on infra).

- **Body (metadata):**
```json
{
  "fileName": "transcript.pdf",
  "type": "transcript" | "resume" | "essay" | "other"
}
```

### **10.3 DELETE /documents/:id**
- **Description:** Delete a document.

---

## **11. AI Assistant (MVP)**

### **11.1 POST /assistant/query**
- **Description:** Send a question to AI assistant.
- **Body:**
```json
{
  "message": "What are my reach schools?"
}
```

- **Response:**
```json
{
  "answer": "Based on your profile, your current reach schools are...",
  "actions": [
    {
      "type": "nav",
      "target": "colleges",
      "params": { "category": "reach" }
    }
  ]
}
```

---

## **12. Analytics (Internal)**

Analytics may be tracked via client-side integration (PostHog, etc.) and not via public API.

Events to track:
- Onboarding started/completed
- Profile sections completed
- Matches generated
- Colleges saved
- Tasks completed

---

## **13. Error Handling & Conventions**

- Use standard HTTP status codes:
  - 200 OK
  - 201 Created
  - 400 Bad Request
  - 401 Unauthorized
  - 403 Forbidden
  - 404 Not Found
  - 500 Internal Server Error

- Error response format:
```json
{
  "error": {
    "code": "string",
    "message": "Human-readable message"
  }
}
```

---

## **Next Files:**
The last two documents will be:
- **COLLEGE_MATCH_ENGINE.md**
- **INTAKE_QUESTIONS.md**

