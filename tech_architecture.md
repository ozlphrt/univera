# **Univera — Technical Architecture**

This document defines the high-level technical architecture for **Univera**, a mobile-first PWA for college guidance.

---

## **1. High-Level Architecture Overview**

Univera is a **React 19 + TypeScript PWA** with a modular front-end, API-driven backend, and cloud-managed data.

### **1.1 Architecture Style**
- **Frontend:** React 19 + Vite + TypeScript
- **State Management:** Zustand (or Redux Toolkit as fallback)
- **Backend:** Node.js (Express/NestJS) or serverless functions (Supabase/Firebase/Cloud Functions)
- **Database:** Postgres (via Supabase) or Firestore (if Firebase is chosen)
- **Auth:** Email/password + OAuth (Google/Apple) via Supabase/Firebase Auth
- **Storage:** Cloud object storage for documents (Supabase Storage / Firebase Storage)
- **PWA Layer:** Service Worker + Web App Manifest
- **Analytics:** PostHog or Firebase Analytics

---

## **2. Frontend Architecture**

### **2.1 Core Stack**
- **React 19** (with Suspense/Server Components compatible mindset)
- **TypeScript** for type safety
- **Vite** for fast dev/build
- **React Router** for routing
- **Zustand** for global state

### **2.2 Application Layers**
1. **Presentation Layer**
   - UI components
   - Screens (pages)
   - Theming & styling

2. **State & Logic Layer**
   - Global stores: auth, profile, colleges, tasks, UI
   - Derived selector functions
   - Feature-level hooks

3. **Data Access Layer**
   - API clients (REST/GraphQL)
   - Fetch utilities with caching
   - Error handling & retries

4. **PWA Layer**
   - Service worker registration
   - Offline cache strategies
   - Install prompt helpers

---

## **3. Backend Architecture**

### **3.1 Possible Implementations**
We will design for an abstract backend so implementation can be:
- **Option A (Recommended):** Supabase (Postgres + auth + storage + Row Level Security)
- **Option B:** Firebase (Auth + Firestore + Storage)
- **Option C:** Custom Node.js API + Hosted Postgres

This doc will assume **Supabase** as the baseline.

### **3.2 Backend Responsibilities**
- User authentication & session management
- Secure storage of:
  - Profiles
  - Colleges & metadata
  - Tasks & timeline
  - Essay data (ideas, status)
  - Parent links
- College Match Engine computation (if not purely client-side)
- College catalog querying & filtering
- Role handling (student vs parent)

---

## **4. Data Flow Overview**

### **4.1 Onboarding Flow (High-Level)**
1. User opens app → PWA shell loads from cache/CDN
2. Service worker activates (if installed)
3. User either:
   - Continues as guest (local anonymous ID), or
   - Signs up / logs in
4. Quick Start flow collects initial answers
5. Client computes initial matches (using local engine + cached college data)
6. Profile & responses synced to backend when authenticated
7. Dashboard data hydrated from server + local cache

### **4.2 Normal Usage**
- Client fetches profile data → populates stores
- Client fetches college list (paginated)
- Client runs client-side match engine using local + remote inputs
- Writes (edits) are sent via REST/GraphQL to backend
- Local optimistic updates to maintain snappy UX

---

## **5. Modules & Services**

### **5.1 Frontend Modules**
- **/modules/auth** — login, signup, session handling
- **/modules/onboarding** — Quick Start & adaptive questions
- **/modules/dashboard** — readiness score, overview, suggestions
- **/modules/profile** — student profile cards
- **/modules/colleges** — listings, details, filters
- **/modules/tasks** — timeline, tasks, reminders
- **/modules/essays** — brainstorming and progress tracking
- **/modules/parents** — parent-specific views
- **/modules/assistant** — AI assistant UI
- **/modules/vault** — document storage UI

### **5.2 Backend Services**
- **Auth Service**
- **User Profile Service**
- **College Data Service**
- **Match Engine Service (optional, if server-side)**
- **Task & Timeline Service**
- **Essay Metadata Service**
- **Parent Linking Service**
- **Notification Service** (email/push in future)

---

## **6. PWA Architecture**

### **6.1 PWA Features**
- Installable on mobile (Add to Home Screen)
- Service worker precaches shell
- Runtime caching for API calls (with staleness strategy)
- Offline read access for:
  - Dashboard snapshot
  - Profile data
  - Task list (last known)

### **6.2 Caching Strategy**
- **Static assets:** Cache-first
- **API responses (profile, colleges):** Stale-while-revalidate
- **Mutations:** Network-first with queued writes (future enhancement)

---

## **7. State Management Design**

### **7.1 Zustand Stores (Example)**
- **useAuthStore** — token, user, mode (student/parent)
- **useProfileStore** — academic, ECs, prefs, budget
- **useCollegesStore** — list, filters, pagination, selected college
- **useTasksStore** — tasks, completion, schedule
- **useUIStore** — theme, onboarding status, nav state

### **7.2 Derived Computations**
- Readiness score
- Profile completion
- List balance (reach/target/safety)
- Recommended next actions

---

## **8. Security & Privacy**

### **8.1 Core Principles**
- No sensitive data stored in plain local storage
- Token-based auth with secure refresh
- Row Level Security for user data (Supabase)
- Separate student vs parent access rights

### **8.2 Data Separation**
- Student profile & app data segregated by user ID
- Parent accounts linked via relationship table
- Role checks on backend for every operation

---

## **9. Environments & Deployment**

### **9.1 Environments**
- **Local Dev** — Vite dev server + Supabase dev project
- **Staging** — Hosted PWA + staging DB
- **Production** — CDN-hosted PWA + production DB

### **9.2 Deployment Targets**
- Frontend: Vercel, Netlify, or static hosting
- Backend: Supabase + optional serverless functions

---

## **10. Observability**

- **Logging:** Client error logging (Sentry or similar)
- **Analytics:** User flow, onboarding completion, feature usage
- **Performance:** Core Web Vitals tracked

---

## **11. Extensibility Considerations**

The architecture must allow:
- Plugging in richer college datasets
- Adding counselor accounts & org structures
- Integrating AI services (e.g., OpenAI API) for assistant & essays
- Scaling to multiple locales and regions

---

## **Next File:**
After this tech architecture is accepted, the next document will be:
**UI_UX_GUIDE.md**