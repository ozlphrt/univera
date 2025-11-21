# **Univera — College Match Engine Specification**
This document defines the complete logic for Univera’s hybrid match engine. The engine operates in **two modes**:
1. **Simple Slider Mode** (low friction, mobile-first)
2. **Advanced Mode** (full admissions logic)

Both modes output:
- A **fit score** (0–100)
- A category: **Reach**, **Target**, or **Safety**
- A human-readable **explanation**: “Why this fits you”

---

# **1. Overview of Match Engine Architecture**

The engine runs **client-side** for instant feedback, with optional server-side overrides.

### **Inputs come from:**
- Student profile (academics, ECs, preferences)
- Quick Start answers
- College dataset (type, acceptance rate, cost, environment, majors, etc.)

### **Outputs:**
```ts
CollegeFitResult {
  collegeId: string;
  fitScore: number;      // 0–100
  category: "reach" | "target" | "safety";
  explanation: string;
  inputsUsed: {...};
}
```

---

# **2. Simple Mode (Slider-Based)**
Designed for onboarding and early engagement.

### **Inputs (from onboarding sliders):**
- **AcademicStrength**: 1–5
- **ExtracurricularStrength**: 1–5
- **MajorCompetitiveness**: "low" | "medium" | "high"
- **PreferenceWeights** (optional): region, size, vibe

### **Steps:**
1. Convert **AcademicStrength** → synthetic GPA (~2.5 to 4.0)
2. Convert **ExtracurricularStrength** → EC score
3. Calculate **College Rigor Index** from acceptance rate
4. Compute **Academic Fit**: difference between synthetic GPA and college difficulty
5. Compute **Preference Fit**: region + size + environment matches
6. Combine into **Fit Score**:

```ts
fitScore = (
  academicFit * 0.6 +
  preferenceFit * 0.3 +
  ecFit * 0.1
);
```

### **Category Thresholds (Simple Mode):**
- **Safety:** fitScore ≥ 70 and college difficulty ≤ academic strength + buffer
- **Target:** fitScore 45–70
- **Reach:** fitScore < 45 or college difficulty is high

---

# **3. Advanced Mode (Full Admissions Logic)**
This mode activates after profile completion.

### **Inputs:**
- GPA (weighted, unweighted)
- Course rigor
- Trend
- Test scores
- EC depth & leadership
- Intended major competitiveness
- Academic interests
- Preferences (location, environment, size)
- Budget + financial aid needs
- Student demographics (non-sensitive)

### **College Inputs:**
- Acceptance rate
- Size
- Type (public/private)
- Major availability & competitiveness
- Region
- Cost of attendance

---

# **4. Detailed Scoring Breakdown**
The advanced engine produces a composite score of **10 sub-scores**.

## **4.1 Academic Fit (0–100)**
Based on:
- GPA vs admitted averages
- Rigor alignment
- Test score percentile match
- Trend bonus (upward trend gives +5–10)

Formula (conceptual):
```ts
academicFit = weightedAverage([
  gpaScore * 0.5,
  rigorScore * 0.2,
  testScoreFit * 0.2,
  trendBoost * 0.1,
]);
```

## **4.2 Extracurricular Fit (0–100)**
Computed from:
- Years of involvement
- Leadership roles
- Impact/achievements
- Category match with college strengths

## **4.3 Major Fit (0–100)**
- If intended major is highly selective → weight increases
- If major not offered → score = 0

## **4.4 Preference Fit (0–100)**
- Environment (urban/suburban/rural)
- Size
- Region
- Campus vibe/keywords

## **4.5 Financial Fit (0–100)**
- Budget match
- Average net price
- Availability of merit aid
- Need-aware/need-blind considerations

---

# **5. Composite Fit Score**
Weighted sum:

```ts
finalFitScore = (
  academicFit * 0.45 +
  extracurricularFit * 0.15 +
  majorFit * 0.15 +
  preferenceFit * 0.15 +
  financialFit * 0.10
);
```

Scored 0–100.

---

# **6. Category Logic (Advanced Mode)**
Category = Reach / Target / Safety

### **6.1 Based on Academic Fit vs College Selectivity**
- **Safety:**
  - academicFit ≥ 75
  - college acceptance rate ≥ 40%

- **Target:**
  - academicFit 55–75
  - acceptance rate 20–40%

- **Reach:**
  - academicFit < 55
  - OR acceptance rate < 20%
  - OR major is highly selective (CS, engineering, business, nursing)

### **6.2 Additional Rules**
- If college major = highly selective AND majorFit < 50 → auto Reach
- If college cost > budget * 1.5 → downgrade one category

---

# **7. Explanation Generator**
Human-friendly reasons are created using a template system.

### **Template Examples:**
- "Your strong academics align well with __CollegeName__'s admitted student profile."
- "This school matches your interest in __Major__."
- "You prefer __environment__, and this campus offers exactly that vibe."
- "The acceptance rate is competitive, making this a stretch, but still possible."

### **Inputs for Explanation:**
- Academics vs averages
- Major match
- Location preferences
- Cost fit
- EC strength

### **Output Structure:**
```ts
explanation: string;
```

---

# **8. Performance & Caching**

- **Simple mode**: computed fully client-side, always instant.
- **Advanced mode**: cached results stored in IndexedDB.
- Recompute triggers:
  - Profile updated
  - Preferences updated
  - New colleges added

---

# **9. Data Requirements on Colleges**
To compute matching effectively, the college dataset must include:
- Acceptance rate
- Cost info
- Size
- Region
- Major list
- Type (public/private)
- Location coordinates

Optional enhancements:
- Middle 50% SAT/ACT
- GPA averages
- Major-level selectivity

---

# **10. Edge Cases**

### **10.1 Missing GPA or test scores**
- Fall back to Simple Mode
- Use sliders + trend + rigor as proxies

### **10.2 Undecided major**
- Reduce major weight to 5%
- Use preference fit heavily

### **10.3 International students**
- Adjust cost model
- Ignore in-state/out-of-state variables

---

# **11. Future Extensions**
- AI-driven personalized weighting
- Advisor calibration sliders
- Dynamic difficulty curves per major
- Transfer student mode
- Country-specific match engines (UK, Canada, EU)

---

# **Next File:**
The final document will be:
**INTAKE_QUESTIONS.md**