# **Univera — Screen Flows**
This document defines the main user flows and screen transitions for Univera’s mobile-first PWA.

Flows are designed to:
- Minimize friction
- Provide clear guidance
- Respect mobile ergonomics
- Support both students and parents

---

## **1. Global Navigation Overview**

### **Phase 1: Pre-Onboarding**
- User lands on **Welcome Screen**
- Options:
  - "Get Started" (Quick Start onboarding)
  - "Log in" / "Sign up"

### **Phase 2: Post-Onboarding**
- **Bottom Navigation Bar** appears with 4–5 items:
  1. Dashboard
  2. Colleges
  3. Tasks
  4. Profile
  5. More (optional / overflow)

Each tab represents a root-level navigation stack.

---

## **2. Flow: First-Time User (Student) Onboarding**

### **2.1 Screens**

1. **Welcome Screen**
   - Brand logo + tagline: "College Guidance Made Simple"
   - CTA: "Get Started"
   - Secondary: "I already have an account" → Auth flow

2. **User Type Screen**
   - Question: "Who are you here for?"
   - Options:
     - "I'm a student"
     - "I'm a parent"
   - If parent → Parent onboarding variant (see section 6)

3. **Quick Start Intro**
   - Short text: "Answer a few quick questions so we can tailor Univera to you."
   - CTA: "Continue"

4. **Quick Start Question Cards (10–12 screens)**
   - One question per screen, e.g.:
     - "What grade are you in?" (9/10/11/12/Gap)
     - "How would you describe your grades?" (chips like: "Mostly A’s", "A’s and B’s", etc.)
     - "Do you know what you might want to study?" (Yes/No → branch)
     - "Where would you most like to study?" (region chips)
     - "What kind of campus do you imagine?" (Urban/Suburban/Rural)
     - "How important is cost for your family?" (slider or chips)
     - "How confident do you feel about your extracurriculars?" (slider 1–5)

   - Each card:
     - Next / Back
     - Progress indicator ("4 of 10")

5. **Processing Screen**
   - Brief loading state: "We’re preparing your first college matches and plan..."

6. **Initial Results Screen**
   - Headline: "Here’s your starting point"
   - Summary:
     - # of Reach / Target / Safety colleges found (sample subset)
     - A few example colleges
   - CTA: "Go to your dashboard"

7. **Dashboard Introduction Overlay**
   - Optional quick tour with 2–3 tooltips:
     - "This is your Readiness Score."
     - "Here’s where you’ll see your tasks."
     - "Tap here to explore colleges."

8. **Bottom Navigation Bar Appears**
   - User is now in normal app mode.

---

## **3. Flow: Authentication**

### **3.1 Log In**
- From Welcome Screen or More tab
- Inputs:
  - Email
  - Password
- CTAs:
  - "Log in"
  - "Forgot password?"

### **3.2 Sign Up**
- Inputs:
  - Email
  - Password
  - Confirm password
- Optional:
  - Name
  - Role (Student / Parent)

After signup:
- Redirect to Quick Start onboarding if profile is empty

---

## **4. Flow: Dashboard Usage**

### **4.1 Dashboard Screen Components**
- Welcome text (e.g., "Hi Alex, here’s where you are today")
- Readiness score component
- Profile completion bar
- College list summary strip
- Task list preview (top 2–3 tasks)
- "Next suggested step" card

### **4.2 Interactions**
- Tap readiness score → opens explanation / advanced view
- Tap profile bar → Profile module
- Tap college summary → Colleges module (default All tab)
- Tap task card → Task detail or full task list
- Pull-to-refresh → triggers data sync

---

## **5. Flow: Profile Editing**

### **5.1 Profile Root Screen**
- Sections as cards:
  - Academics
  - Extracurriculars
  - Preferences
  - Budget & Financial
  - Personality / Learning Style

Each card shows:
- Title
- Short summary of state (e.g., "GPA added, tests missing")
- Progress indicator for section

### **5.2 Editing a Section (Example: Academics)**

1. User taps "Academics" card
2. **Academics Detail Screen**
   - Fields:
     - GPA (input or range selection)
     - Weighted GPA (optional)
     - Course rigor (Low/Medium/High with helper text)
     - Test scores (SAT/ACT etc.)
   - CTA: "Save" (but autosave can occur on change)

3. On save:
   - Local state update
   - API call to backend
   - Potential recalc of match engine (in background)

4. Navigate back to Profile root → card updated

---

## **6. Flow: Parent Onboarding & View**

### **6.1 Parent Onboarding**
1. Parent selects "I'm a parent" on User Type
2. Parent is asked:
   - "Are you setting this up for one student or more?" (MVP: one)
   - "What grade is your student in?"
   - "How important is managing cost?" (chips)
3. Parent creates an account or logs in
4. Parent either:
   - Creates a new linked student profile (basic info only)
   - Or enters a code/invite from student's account (future feature)

### **6.2 Parent Dashboard**
- Similar layout but different emphasis:
  - High-level readiness
  - Financial expectations info card
  - Timeline overview
  - "This month’s key steps" for parents

---

## **7. Flow: College Exploration & Saving**

### **7.1 From Dashboard → Colleges**
1. User taps college summary strip or Colleges tab
2. **Colleges List Screen:**
   - Tabs or pills for Reach / Target / Safety / All
   - Filters (top right): region, size, cost, etc. (MVP: limited)
   - Cards for each college

3. User taps a college card → **College Detail Screen**

### **7.2 College Detail Screen**
- Sections:
  - Header: name, location, category badge
  - "Why this fits you" explanation text
  - Basic stats (size, cost, acceptance rate)
  - Majors of interest
  - Deadlines
  - Buttons: "Save" / "Remove from list"

Interactions:
- Save → adds to student’s saved list (if not already)
- Scrolling reveals more context

---

## **8. Flow: Tasks & Timeline**

### **8.1 Accessing Tasks**
- From Dashboard (task preview) or Tasks tab

### **8.2 Tasks Screen**
- Group tasks by phase (e.g., "Junior Spring", "Senior Fall")
- Show current phase expanded by default
- Each task card shows:
  - Title
  - Short description
  - Status

### **8.3 Updating Tasks**
- Tap task → Task Detail Screen
  - Full description
  - Optional links (e.g., "Go to Profile → Extracurriculars")
  - Status selector (Not started / In progress / Done)

- Quick interaction:
  - Swipe right → mark as Done (optional)

---

## **9. Flow: Essays Planning**

### **9.1 Essays Overview Screen**
- List of major essays:
  - Common App Personal Statement
  - Supplements (if user indicates target colleges requiring them)

- For each:
  - Status pill
  - CTA: "Start brainstorming" or "View ideas"

### **9.2 Brainstorm Flow**
1. User taps "Start brainstorming"
2. Sees prompt ideas / questions:
   - "Tell us about a time you overcame a challenge…"
   - "What’s something that matters deeply to you?"
3. User can:
   - Add bullet-point ideas
   - Mark favorite ideas

4. Status auto-updates to "Brainstorming"

---

## **10. Flow: Advanced Mode (Match Engine)**

### **10.1 Accessing Advanced Mode**
- From Profile or Colleges module:
  - "Advanced fit settings" link

### **10.2 Advanced Mode Screen**
- Show more granular controls / info:
  - Academic strength, EC strength (filled from profile)
  - Ability to adjust trade-off preferences (e.g., cost vs prestige)

- Explanation: "Univera normally handles this for you, but you can fine-tune if you like."

---

## **11. Flow: Switching Between Student & Parent Mode**

### **11.1 Mode Switch**
- Accessible from Profile or More tab
- Toggle or segmented control:
  - Student view / Parent view

Switching triggers:
- Different dashboard layout
- Adjusted wording
- Restricted actions for parents (view-focused)

---

## **12. Error & Empty State Flows**

### **12.1 No Colleges Found**
- Message: "We couldn't find good matches yet."
- CTA: "Improve your profile" → leads to Profile

### **12.2 No Tasks**
- Message: "We’re setting up your plan."
- CTA: "Complete onboarding" or "Update grade level"

### **12.3 Network Error**
- Simple offline screen
- Retry button
- Explanation: "Some features may be limited offline."

---

## **Next File:**
After this flows document, the next file will be:
**COMPONENTS.md**