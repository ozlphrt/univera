# **Univera — Project Task List**
This is the master task list for building the **Univera** mobile-first PWA. Tasks are organized into phases with dependencies, difficulty, and ownership suggestions.

The goal is to give Cursor AI and developers a clear roadmap with clean, atomic tasks.

---

# **Legend**
- **P** = Priority (H = High, M = Medium, L = Low)
- **D** = Difficulty (1 = trivial → 5 = very complex)
- **Dep** = Dependencies
- **Owner** = Frontend / Backend / Design / All

---

# **PHASE 1 — Foundation & Setup**

## **1.1 Repository & Project Setup**
| Task | P | D | Dep | Owner |
|------|---|---|-----|--------|
| Initialize Vite + React 19 + TypeScript project | H | 1 | — | FE |
| Add ESLint + Prettier config | M | 1 | — | FE |
| Configure absolute imports | M | 1 | — | FE |
| Setup folder structure (`modules/`, `components/`, `stores/`) | H | 1 | — | FE |
| Install Zustand | H | 1 | — | FE |
| Add React Router | H | 1 | — | FE |

## **1.2 PWA Setup**
| Task | P | D | Dep | Owner |
|------|---|---|-----|--------|
| Add web manifest | H | 1 | Project setup | FE |
| Implement Service Worker (basic offline cache) | H | 3 | Manifest | FE |
| Test PWA install on mobile | H | 2 | SW | FE |

## **1.3 Backend Setup (Supabase recommended)**
| Task | P | D | Dep | Owner |
|------|---|---|-----|--------|
| Create Supabase project | H | 1 | — | BE |
| Initialize Postgres tables (Users, Profiles, Colleges, Tasks, Essays) | H | 3 | Data models | BE |
| Add RLS (Row Level Security) policies | H | 3 | Tables | BE |
| Integrate Supabase Auth in frontend | H | 3 | FE setup | FE |
| Setup Supabase client & global API wrapper | H | 2 | Auth | FE |

---

# **PHASE 2 — Onboarding**

## **2.1 Welcome & Auth Screens**
| Task | P | D | Dep | Owner |
|------|---|---|-----|--------|
| Build Welcome Screen | H | 2 | Components | FE |
| Build Log In screen | H | 2 | Auth | FE |
| Build Sign Up screen | H | 2 | Auth | FE |

## **2.2 Quick Start Onboarding Flow**
| Task | P | D | Dep | Owner |
|------|---|---|-----|--------|
| Implement onboarding route + container | H | 2 | Router | FE |
| Create OnboardingCard component | H | 2 | Components | FE |
| Implement 10–12 question screens | H | 3 | OnboardingCard | FE |
| Add adaptive logic (conditional questions) | H | 4 | All onboarding | FE |
| Implement local temp storage (IndexedDB or memory) | M | 2 | Onboarding | FE |
| Add processing/loading screen | M | 1 | Onboarding | FE |
| Generate initial match results (client-side engine v1) | H | 4 | Match engine draft | FE/BE |

---

# **PHASE 3 — Dashboard**

| Task | P | D | Dep | Owner |
|------|---|---|-----|--------|
| Build Dashboard layout | H | 2 | Nav | FE |
| Implement Readiness widget | H | 3 | Profile data | FE |
| Implement Profile Completion widget | H | 3 | Profile module | FE |
| Implement College Summary widget | H | 3 | Match engine + Colleges module | FE |
| Implement Next Step card logic | H | 3 | Profile + Colleges | FE |
| Add pull-to-refresh | L | 2 | Dashboard | FE |

---

# **PHASE 4 — Profile Module**

## **4.1 Profile Root**
| Task | P | D | Dep | Owner |
|------|---|---|-----|--------|
| Build Profile root screen | H | 2 | Components | FE |
| Implement section cards | H | 2 | Components | FE |

## **4.2 Individual Sections**
| Section | P | D | Dep |
|---------|---|---|-----|
| Academics | H | 3 | Backend + UI |
| Extracurriculars | H | 3 | Backend + UI |
| Preferences | H | 2 | UI |
| Budget | M | 2 | UI |
| Personality | M | 2 | UI |

Each section includes:
- Input screen
- Autosave
- Sync to backend
- Update profile completion

---

# **PHASE 5 — Colleges Module**

## **5.1 List View**
| Task | P | D | Dep | Owner |
|------|---|-----|------|--------|
| Build list view with tabs | H | 3 | Router | FE |
| Implement category filters (Reach/Target/Safety) | H | 3 | Match engine | FE |
| Build CollegeListItem component | H | 2 | Components | FE |
| Paginate results | M | 3 | API | FE |

## **5.2 Detail View**
| Task | P | D | Dep | Owner |
|------|---|-----|------|--------|
| Build College Detail screen | H | 4 | List + API | FE |
| Implement FitExplanationBlock | H | 2 | Match engine | FE |
| Add Save/Unsave logic | H | 2 | Auth + Profile | FE |

---

# **PHASE 6 — Task & Timeline System**

| Task | P | D | Dep | Owner |
|------|---|-----|------|--------|
| Build Tasks root screen | H | 3 | Nav | FE |
| Group tasks by phase | H | 3 | Backend data | FE |
| Build TaskListItem component | H | 2 | UI | FE |
| Build Task Detail screen | H | 3 | TaskListItem | FE |
| Implement status update logic | H | 2 | Backend | FE |

---

# **PHASE 7 — Essays Module**

| Task | P | D | Dep | Owner |
|------|---|-----|------|--------|
| Build Essays root screen | M | 2 | Nav | FE |
| Build EssayCard component | M | 2 | Components | FE |
| Build Brainstorm screen | M | 3 | UI | FE |
| Store ideas in backend | M | 3 | Backend | FE |
| Sync status updates | M | 2 | Backend | FE |

---

# **PHASE 8 — Parent Mode**

| Task | P | D | Dep | Owner |
|------|---|-----|------|--------|
| Build parent toggle + mode state | M | 2 | Auth | FE |
| Build Parent Dashboard | M | 3 | Dashboard | FE |
| Build ParentInfoCard | M | 2 | Components | FE |
| Build FinancialOverviewCard | M | 3 | Data models | FE/BE |

---

# **PHASE 9 — Match Engine (Hybrid)**

| Task | P | D | Dep | Owner |
|------|---|-----|------|--------|
| Implement Simple Mode (sliders → scoring) | H | 3 | Profile | FE |
| Implement Advanced Mode (full profile → scoring) | H | 5 | Profile + Data models | FE/BE |
| Create category thresholds for reach/target/safety | H | 3 | Engine | FE/BE |
| Add explanations generator | H | 3 | Engine | FE |
| Optimize for performance (local caching) | M | 3 | Engine | FE |

---

# **PHASE 10 — AI Assistant (MVP)**

| Task | P | D | Dep | Owner |
|------|---|-----|------|--------|
| Build chat UI | M | 3 | Components | FE |
| Add basic Q&A ability (FAQ-level) | M | 4 | Backend | FE/BE |
| Add routing logic ("Show me my colleges") | M | 4 | Engine + Nav | FE |

---

# **PHASE 11 — Document Vault**

| Task | P | D | Dep | Owner |
|------|---|-----|------|--------|
| Build upload UI | L | 3 | Components | FE |
| Configure storage buckets | L | 2 | Backend | BE |
| Add file listing screen | L | 2 | UI | FE |

---

# **PHASE 12 — QA, Testing & Polish**

| Task | P | D | Dep | Owner |
|------|---|-----|------|--------|
| Write unit tests for components | M | 3 | FE components | FE |
| Test onboarding flows thoroughly | H | 2 | Onboarding | FE |
| Test profile syncing edge cases | H | 4 | Profile | FE/BE |
| Load testing for match engine | M | 3 | Match engine | FE/BE |
| Final UI polish (spacing, typography, animations) | M | 2 | All modules | Design/FE |

---

# **PHASE 13 — Deployment**

| Task | P | D | Dep | Owner |
|------|---|-----|------|--------|
| Deploy frontend to Vercel/Netlify | H | 1 | All FE | FE |
| Deploy backend (Supabase config finalize) | H | 2 | All BE | BE |
| Test PWA installability | H | 2 | Deployment | FE |
| Connect domain (univera.app or similar) | M | 1 | Deployment | DevOps |

---

# **PHASE 14 — Post-MVP Enhancements**

- Counselor dashboard
- Essay AI assistant
- Major/career discovery engine
- Advanced financial calculator
- Multi-student management for parents
- Full chat-based intake
- International student support

---

# **Next File:**
The next document will be:
**API_DESIGN.md**