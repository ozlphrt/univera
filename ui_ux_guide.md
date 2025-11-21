# **Univera — UI / UX Guide**

This document defines the design language, interaction patterns, and UX principles for **Univera — College Guidance Made Simple**.

Univera blends:
- **Duolingo** → playful, approachable, bite-sized progress
- **Airbnb** → clean, premium, calm visual design

Tone: **Calm + Friendly with subtle personality**.

---

## **1. Core UX Principles**

1. **Simplicity First**  
   - No cluttered screens; focus on one primary action at a time.
   - Avoid long, intimidating forms; break into cards and steps.

2. **Mobile-First**  
   - Designed primarily for small screens.
   - Thumb-friendly controls, bottom-focused interactions.

3. **Guided, Not Overwhelming**  
   - Users should always know: *“What should I do next?”*
   - Use a clear "Next step" card and friendly microcopy.

4. **Reassuring & Supportive**  
   - Acknowledge anxiety around college admissions.
   - Copy should be empathetic, non-judgmental, and encouraging.

5. **Progressive Disclosure**  
   - Show simple views first; advanced options can be expanded.
   - Advanced Mode is opt-in.

---

## **2. Visual Design Language**

### **2.1 Color Palette (Conceptual)**
- **Primary:** Soft blue or teal (trust, calm)
- **Accent:** Warm coral or soft orange (friendly highlights)
- **Background:** Off-white / very light gray
- **Surfaces:** White cards with gentle shadows
- **Feedback Colors:**
  - Success: Soft green
  - Warning: Amber
  - Error: Muted red (not aggressive)

*Exact hex values can be defined later in a design system.*

### **2.2 Typography**
- **Headings:** Rounded, modern sans-serif (e.g., Inter / SF Pro / Nunito)
- **Body text:** High readability sans-serif
- **Hierarchy:**
  - H1: Page titles (20–24px on mobile)
  - H2: Section titles (18–20px)
  - Body: 14–16px
  - Labels/Meta: 12–13px

### **2.3 Components Visual Style**
- Rounded corners (8–16px, consistent)
- Soft shadows, not harsh
- Generous spacing between cards
- Clean icons (outline style)
- Avoid dense tables; use cards and lists

---

## **3. Layout & Navigation**

### **3.1 Onboarding (Phase 1)**
- Full-screen cards stacked vertically or horizontally
- One primary action per screen (Next / Continue)
- Progress indicator (e.g., 3/10)
- Microcopy explaining why each question matters

### **3.2 Post-Onboarding (Phase 2)**
- **Bottom navigation bar** with 4–5 icons:
  - Dashboard
  - Colleges
  - Tasks
  - Profile
  - More (optional)

- Each section uses top headers + scrollable content
- Pull-to-refresh supported where relevant

---

## **4. Key Screens UX**

### **4.1 Dashboard**
**Purpose:** Be the student's “home base” for their journey.

**Elements:**
- Welcome message (personalized)
- Readiness score (simple visual: ring or bar)
- Profile completion bar
- Small college list summary (e.g., 3 Reach / 4 Target / 2 Safety)
- Tasks for this week/month
- "Next suggested step" card (tap → deep-link)

**Interactions:**
- Tap sections to navigate to deeper modules
- Scroll for more info; keep key summary above the fold

---

### **4.2 Quick Start Onboarding**
**Goals:** Low friction, fun, < 2 minutes.

**Patterns:**
- One question per card
- Pre-defined options, sliders, chips instead of free text where possible
- Adaptive follow-up questions only when needed
- Friendly language

**Examples:**
- "How would you describe your grades so far?" (options instead of raw GPA)
- "Where would you love to study?" with map-inspired chips

---

### **4.3 Profile Module**
**Structure:**
- Card-based sections:
  - Academics
  - Activities & Leadership
  - Preferences
  - Budget
  - Personality & learning style

Each card:
- Shows summary state (e.g., "Academics: GPA entered, tests missing")
- Tap → detailed edit screen

**UX Notes:**
- Break long forms into subsections
- Use clear labels and helper text
- Save automatically where possible

---

### **4.4 Colleges Module**
**Views:**
1. **Overview / List View:**
   - Tabs or filters: All / Reach / Target / Safety
   - Each college displayed as a card:
     - Name, location, type
     - Category (badge)
     - Quick fit summary
     - CTA: View details

2. **College Detail View:**
   - Hero section (name, location, tags)
   - Fit explanation: "Why Univera thinks this is a match"
   - Key stats: acceptance rate, cost, size
   - Majors of interest
   - Deadlines & timeline integration
   - Action: Save / Remove from list

---

### **4.5 Tasks & Timeline**
**Concept:** Guided checklist over time.

**UX:**
- Group tasks by month or phase (e.g., "Spring of Junior Year")
- Each task card:
  - Title, short description
  - Due date or suggested date
  - Status: Not started / In progress / Done

**Interactions:**
- Swipe to mark done
- Tap for details & links (e.g., to profile section)

---

### **4.6 Essays Module**
**MVP:** Planning and idea capture only.

**UX:**
- Show core essay types (Common App Personal Statement, Supplements)
- Brainstorming prompts as cards
- Simple lists of ideas
- Progress indicator per essay (Not started / Brainstorming / Outlining / Drafting / Polishing)

---

### **4.7 Parent Mode**
**Access:** Toggle in profile or login as parent.

**Differences from Student View:**
- More emphasis on:
  - Financial expectations
  - Deadlines
  - Explanations of process
- Less emphasis on:
  - Micro-level profile editing

**UX Tone:**
- Slightly more formal but still friendly
- Reassuring, educational language

---

## **5. Microcopy & Tone Guidelines**

### **5.1 Do's**
- Use encouraging language: "You're making great progress."
- Explain *why* something matters: "This helps us match you with colleges that fit your style."
- Normalize uncertainty: "It's okay if you're undecided — many students are."

### **5.2 Don'ts**
- No shaming: avoid "You should have..." or "You failed to..."
- Avoid overly formal academic jargon
- Avoid fear-based messaging

---

## **6. Interaction Patterns**

- **Primary actions:** clearly distinguished buttons (e.g., solid fill)
- **Secondary actions:** outlined or text buttons
- **Transitions:** simple fades/slides, no flashy animations
- **Empty states:** always provide guidance (what to do next)
- **Loading states:** skeleton loaders or short text hints

---

## **7. Accessibility**

- Minimum contrast ratios for text
- Support larger fonts (no layout breakage)
- Tap targets at least 44x44px
- Avoid color-only status indicators

---

## **8. Brand Identity Summary**

- **Name:** Univera
- **Tagline:** "College Guidance Made Simple"
- **Keywords:** Clarity, Calm, Support, Progress, Confidence

---

## **Next File:**
After this guide, the next document will be:
**DATA_MODELS.md**