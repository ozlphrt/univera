# **Univera — MVP Feature Specification**
This document defines the *Minimum Viable Product* feature set for **Univera**, ensuring clear scope, technical feasibility, and a smooth mobile-first user experience.

Univera's MVP is intentionally broad but shallow: every core module exists, but advanced depth is optional.

---

# **1. MVP Goals**
The MVP must:
- Provide immediate value within 5 minutes (Quick Start → College List)
- Establish core modules for long-term expansion
- Deliver a premium mobile-first PWA experience
- Support both students and parents with differentiated UX
- Implement the hybrid admissions engine (simple + advanced)
- Create a unified dashboard for guidance and progress

---

# **2. Core MVP Modules**
Below are the modules included in MVP, with priority levels.

## **2.1 Dashboard (High Priority)**
The central hub showing:
- Readiness Score (simple version)
- Profile completeness
- College List snapshot
- Tasks & timeline overview
- "Next Suggested Step" card (rule-based)

**Interactions:**
- Tap → navigate to deeper modules
- Pull-to-refresh

---

## **2.2 Quick Start Onboarding (High Priority)**
10–12 adaptive questions:
- GPA (range)
- Preferred major or "undecided"
- Region preferences
- Budget
- School size preference
- Urban/suburban/rural
- Academics confidence slider
- EC strength slider
- Timeline status

**Output:** Initial college list + user dashboard.

---

## **2.3 Student Profile System (High Priority)**
### Modular Cards:
- Academics (GPA, coursework, tests)
- Extracurriculars & leadership
- Intended major & interests
- Preferences (size, region, environment)
- Budget & financial constraints
- Personality & learning style

### Features:
- Add/edit cards individually
- Smooth mobile forms
- Auto-save
- Profile completion percentage

---

## **2.4 College Match Engine (High Priority)**
### **Mode 1 — Simple Slider Mode**
- Academic Strength (1–5)
- Extracurricular Strength (1–5)
- Major competitiveness
- Preferences
- Outputs Reach / Target / Safety categories

### **Mode 2 — Advanced Mode**
- Real academic/test data
- Rigor evaluation
- EC depth & leadership inputs
- Narrative inputs (optional)

### **Output:**
Each school has:
- Fit score
- Category
- "Why this fits you" text

---

## **2.5 Colleges Module (High Priority)**
### College List:
- Categorized into Reach / Target / Safety tabs
- Infinite scroll / lazy load
- Search and filter system

### College Profile Page:
- Overview
- Acceptance rate
- Majors
- Cost info (basic)
- Deadlines
- Location map
- Photos

---

## **2.6 Task & Timeline System (High Priority)**
### Baseline Features:
- Auto-generated timeline based on grade level
- Monthly task list
- Task cards with priorities
- Reminders (local notifications)

### Examples:
- "Create your activities list"
- "Shortlist 10 colleges"
- "Start essay brainstorming"

---

## **2.7 Essays Module (Medium Priority)**
### MVP-Level Functionality:
- Brainstorming prompts
- Idea collection
- Common App essay overview
- Progress tracking (% complete)

(No writing editor in MVP — just planning.)

---

## **2.8 Parent View (Medium Priority)**
### Features:
- Financial expectations card
- Deadline visibility
- "What to expect this month" guide
- Parent-friendly explanations

### Switching:
- Toggle: Student Mode ↔ Parent Mode

---

## **2.9 AI Assistant (Medium Priority)**
### MVP constraints:
- FAQ-level interaction
- Query routing ("Check your profile", "Show colleges", etc.)

Future: fully intelligent conversational system.

---

## **2.10 Document Vault (Low Priority)**
### MVP:
- Upload PDFs + notes
- Private storage per user

(No advanced organization in MVP.)

---

# **3. MVP UI/UX Requirements**
- Full-screen card onboarding (Airbnb-style)
- Bottom navigation unlocks post-onboarding
- Smooth transitions (fade, slide)
- Soft shadows, rounded cards
- Warm color palette (brand theme)
- Accessible typography with clear hierarchy
- No clutter — maximum simplicity

---

# **4. Tech Requirements for MVP**
- React 19 + Vite + TypeScript
- PWA (offline caching, installable)
- Zustand or Redux Toolkit for state
- Lightweight local DB for caching (IndexedDB)
- Cloud backend (Supabase or Firebase) for sync
- Analytics (PostHog or Firebase Analytics)

---

# **5. MVP Stretch Features (Optional)**
- Multi-student profiles for families
- Advanced essay workspace
- AI-powered major matching
- Micro-interactions (Lottie animations)

---

# **6. MVP Completion Criteria**
- User completes onboarding + sees personalized list
- Dashboard reflects real-time profile state
- At least 100 colleges available in the DB
- All core modules accessible from navigation bar
- Parent Mode functional (minimum 2 cards)
- College Match Engine returns meaningful categories

---

## **Next File:**
After approval, the next document will be:
**TECH_ARCHITECTURE.md**