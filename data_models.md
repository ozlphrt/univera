# **Univera — Data Models**
This document defines the core data structures for Univera’s backend and frontend models. These models will be used across the PWA, backend API, Supabase/Firebase storage, and local/offline caches.

The models are designed to be:
- Modular
- Extensible
- Mobile-friendly
- Future-proof (for counselor/admin roles)
- Compatible with both SQL (Supabase/Postgres) and NoSQL (Firestore)

---

# **1. User Model**
Represents an authenticated user in Univera.

```ts
User {
  id: string;
  email: string;
  role: "student" | "parent" | "counselor"; // MVP: student + parent
  createdAt: string;
  updatedAt: string;
  linkedStudentId?: string; // for parent mode
}
```

---

# **2. Student Profile Model**
Central entity representing a student’s academic and personal information.

```ts
StudentProfile {
  id: string; // same as userId for students
  basicInfo: {
    firstName?: string;
    lastName?: string;
    gradeLevel?: "9" | "10" | "11" | "12" | "gap";
    expectedGradYear?: number;
  };

  academics: {
    gpa?: number; // 0–4 scale
    weightedGpa?: number;
    courseRigor?: "low" | "medium" | "high";
    testScores?: {
      sat?: number;
      act?: number;
      apScores?: Array<{ subject: string; score: number }>;
    };
    academicTrend?: "upward" | "flat" | "downward";
  };

  extracurriculars: Array<{
    id: string;
    title: string;
    category: "sports" | "arts" | "stem" | "community" | "leadership" | "work" | "research" | "other";
    description?: string;
    years?: number; // 1–4
    hoursPerWeek?: number;
    leadership?: boolean;
    achievements?: string;
  }>;

  preferences: {
    region?: Array<string>; // e.g., ["Northeast", "West Coast"]
    environment?: "urban" | "suburban" | "rural";
    schoolSize?: "small" | "medium" | "large";
    campusVibe?: Array<string>; // e.g., ["collaborative", "competitive", "creative"]
  };

  intendedMajor?: string;

  budget: {
    annualBudget?: number; // parent input
    needFinancialAid?: boolean;
  };

  personality?: {
    learningStyle?: string;
    traits?: Array<string>;
  };

  profileCompletion: number; // 0–100
}
```

---

# **3. College Model**
Baseline model for each college.

```ts
College {
  id: string;
  name: string;
  location: {
    city: string;
    state: string;
    region: string;
    lat?: number;
    lng?: number;
  };

  type: "public" | "private" | "community" | "for-profit";

  size: number; // total students
  acceptanceRate?: number; // decimal 0–1

  cost: {
    tuitionInState?: number;
    tuitionOutOfState?: number;
    averageAid?: number;
    averageNetPrice?: number;
  };

  academics: {
    popularMajors?: Array<string>;
    competitiveness?: "low" | "medium" | "high";
  };

  deadlines?: Array<{
    type: "ED" | "EA" | "RD" | "Priority";
    date: string;
  }>;

  images?: Array<string>;

  tags?: Array<string>;
}
```

---

# **4. College Fit Result Model**
Represents a generated match between a student and a college.

```ts
CollegeFit {
  studentId: string;
  collegeId: string;
  fitScore: number; // 0–100
  category: "reach" | "target" | "safety";
  explanation: string; // "Why this fits you"

  inputsUsed: {
    academicStrength: number; // slider 1–5
    extracurricularStrength: number; // slider 1–5
    majorCompetitiveness: string;
    preferencesMatchScore: number;
    advancedModeUsed: boolean;
  };

  generatedAt: string;
}
```

---

# **5. Task Model**
For timeline and planning.

```ts
Task {
  id: string;
  studentId: string;
  title: string;
  description?: string;
  dueDate?: string;
  phase: string; // e.g., "Junior Fall"
  status: "not_started" | "in_progress" | "done";
  linkedProfileSection?: string; // e.g., "academics"
  createdAt: string;
  updatedAt: string;
}
```

---

# **6. Essay Model**
For brainstorming, prompts, and progress.

```ts
Essay {
  id: string;
  studentId: string;
  type: "CommonApp" | "Supplement" | "ShortAnswer";
  prompt?: string;
  ideas: Array<string>;
  status: "not_started" | "brainstorming" | "outlining" | "drafting" | "polishing";
  updatedAt: string;
}
```

---

# **7. Parent Link Model**
For parent accounts accessing student overview.

```ts
ParentLink {
  parentId: string;
  studentId: string;
  relationship: "mother" | "father" | "guardian" | "other";
  createdAt: string;
}
```

---

# **8. Notification Model (Future)**

```ts
Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}
```

---

# **9. Local Storage / Offline Caching Models**
Cached snapshots stored via IndexedDB for offline mode.

```ts
LocalCache {
  profileSnapshot?: StudentProfile;
  onboardingProgress?: object;
  cachedColleges?: Array<College>;
  cachedTasks?: Array<Task>;
  lastSync: string;
}
```

---

# **10. Extensibility Notes**
These models allow for:
- Advanced essay modules
- Counselor dashboards
- Multi-student views per parent
- AI-based narrative profiles
- International student support
- Testing optional vs required logic
- Regional differences (US/EU/Canada/UK)

---

## **Next File:**
After this data model doc is approved, the next will be:
**SCREEN_FLOWS.md**