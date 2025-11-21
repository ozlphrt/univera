# **Univera — UI Components Specification**
This document defines the main reusable UI components for Univera’s mobile-first PWA. Components should be implemented as modular, typed React + TypeScript components, with clear props and limited internal state.

Styling is assumed to be via a utility-first CSS framework (e.g., Tailwind) or a lightweight component library, but this doc stays framework-agnostic.

---

## **1. Design Goals for Components**

- Highly reusable across screens
- Mobile-first layout and behavior
- Accessible by default
- Theming-compatible
- Minimal, clear props

---

## **2. Core Components**

### **2.1 Button**
Generic button used across app.

**Props (example):**
```ts
ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}
```

Behavior:
- Keyboard accessible
- Distinct visual styles per variant

---

### **2.2 IconButton**
Compact button with icon-only or icon-dominant.

**Use cases:** filter icon, close, back, etc.

---

### **2.3 Card**
Base container for most content blocks.

**Props:**
```ts
CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  onClick?: () => void;
  footer?: ReactNode;
  interactive?: boolean;
}
```

Usage:
- Dashboard widgets
- Profile sections
- College preview items

---

### **2.4 ProgressBar / ProgressRing**
For profile completion, readiness, etc.

**Props:**
```ts
ProgressProps {
  value: number; // 0–100
  label?: string;
  compact?: boolean;
}
```

Types:
- Horizontal bar
- Circular ring

---

### **2.5 Chip / Pill**
Selectable pill for filters and choices.

**Props:**
```ts
ChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}
```

Use cases:
- Region selection
- Environment preference
- Tag display

---

### **2.6 Slider**
Numeric or rating input with discrete steps.

**Props:**
```ts
SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
}
```

Use cases:
- Academic strength (1–5)
- EC strength (1–5)
- Cost importance

---

### **2.7 TextField**
Standard text input.

**Props:**
```ts
TextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "number" | "password";
  error?: string;
  helperText?: string;
}
```

---

### **2.8 Select / Dropdown**
Labeled select for fixed options.

**Props:**
```ts
SelectOption {
  value: string;
  label: string;
}

SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  helperText?: string;
}
```

Use cases:
- Grade level
- Course rigor
- Intended major

---

### **2.9 Toggle / Switch**
For boolean fields.

Use cases:
- Need financial aid
- Parent/student mode

---

## **3. Layout Components**

### **3.1 ScreenContainer**
Base layout wrapper for screens.

Responsibilities:
- Provide consistent padding
- Apply background color
- Handle scroll

---

### **3.2 SectionHeader**
Reusable header for screen sections.

**Props:**
```ts
SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode; // e.g., "Edit" button
}
```

---

### **3.3 BottomNavBar**
Persistent bottom navigation.

**Props:**
```ts
BottomNavItem {
  key: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

BottomNavBarProps {
  items: BottomNavItem[];
}
```

Tabs (MVP): Dashboard, Colleges, Tasks, Profile, More.

---

### **3.4 AppHeader / TopBar**
Optional top bar for title + back navigation.

Props may include:
- title
- showBackButton
- rightAction (icon/button)

---

## **4. Domain-Specific Components**

### **4.1 DashboardWidgets**

#### **4.1.1 ReadinessWidget**
Shows readiness score and short description.

Props:
- score (0–100)
- statusLabel (e.g., "Getting Started", "On Track")

#### **4.1.2 ProfileCompletionWidget**
Shows profile completion with CTA.

Props:
- percent
- onClick

#### **4.1.3 CollegeSummaryWidget**
Shows count of reach/target/safety.

Props:
- reachCount
- targetCount
- safetyCount
- onClick

#### **4.1.4 NextStepCard**
Single actionable suggestion.

Props:
- title
- description
- ctaLabel
- onClick

---

### **4.2 Onboarding Components**

#### **4.2.1 OnboardingCard**
Full-screen card wrapper for questions.

Props:
- title
- description
- children (inputs)
- onNext
- onBack
- progress (0–1 or step/total)

#### **4.2.2 QuestionComponents**
Specialized variants:
- Single choice chips
- Multi-choice chips
- Slider question
- Text response

---

### **4.3 Profile Components**

#### **4.3.1 ProfileSectionCard**
Represents a profile section (academics, ECs, etc.).

Props:
- title
- statusText
- completionPercent
- onClick

#### **4.3.2 ExtracurricularItem**
Single EC item display.

Props:
- title
- category
- years
- leadership flag

---

### **4.4 Colleges Components**

#### **4.4.1 CollegeListItem**
Card in colleges list.

Props:
- name
- location
- category (reach/target/safety)
- tags
- onClick

#### **4.4.2 CollegeCategoryTabs**
Tabs or chips for All / Reach / Target / Safety.

Props:
- activeCategory
- onChange

#### **4.4.3 CollegeDetailHeader**
Top section of detail screen.

Props:
- name
- location
- category
- saved
- onToggleSave

#### **4.4.4 FitExplanationBlock**
Text block explaining match.

Props:
- explanation

---

### **4.5 Tasks Components**

#### **4.5.1 TaskListItem**
Compact representation of a task.

Props:
- title
- status
- phase
- dueDate
- onClick

#### **4.5.2 TaskStatusBadge**
Visual indicator for task status.

---

### **4.6 Essays Components**

#### **4.6.1 EssayCard**
Represents an essay in list.

Props:
- type
- status
- lastUpdated
- onClick

#### **4.6.2 IdeaList**
List of brainstorming ideas.

Props:
- items
- onAdd
- onRemove

---

### **4.7 Parent View Components**

#### **4.7.1 ParentInfoCard**
Explains process / expectations.

Props:
- title
- body

#### **4.7.2 FinancialOverviewCard**
High-level financial summary.

Props:
- budgetEstimate
- aidExpected

---

## **5. Feedback & System Components**

### **5.1 Toast**
Global notifications (save success, error, etc.).

### **5.2 Modal**
For confirmations or focused tasks.

### **5.3 SkeletonLoader**
For loading states (lists, cards).

### **5.4 ErrorState / EmptyState**
Component that displays:
- Icon
- Title
- Description
- Optional CTA

---

## **6. Theming & Customization**

- Use a theme object or context for colors, spacing, radii.
- Allow easy swapping of fonts and brand colors if needed.
- Keep layout and styling decoupled from domain logic.

---

## **Next File:**
The next document will be:
**TASK_LIST.md** (project management tasks for building Univera).