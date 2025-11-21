import { QuestionConfig } from './types';

export type { QuestionConfig };

export const onboardingQuestions: QuestionConfig[] = [
  {
    id: 'user-type',
    title: 'Who are you here for?',
    description: 'Help us personalize your experience',
    type: 'single-choice',
    options: [
      { label: "I'm a student", value: 'student' },
      { label: "I'm a parent", value: 'parent' },
    ],
    required: true,
  },
  {
    id: 'grade',
    title: 'What grade are you in?',
    type: 'single-choice',
    options: [
      { label: '9th Grade', value: 9 },
      { label: '10th Grade', value: 10 },
      { label: '11th Grade', value: 11 },
      { label: '12th Grade', value: 12 },
      { label: 'Gap Year', value: 'gap' },
    ],
    required: true,
    skipCondition: (answers) => {
      const userType = answers.find((a) => a.questionId === 'user-type');
      return userType?.value === 'parent';
    },
  },
  {
    id: 'academic-assessment',
    title: 'How would you describe your grades so far?',
    description: "Don't worry if you're not sure — this helps us find colleges that match your academic profile.",
    type: 'single-choice',
    options: [
      { label: "Mostly A's", value: 'mostly-a' },
      { label: "A's and B's", value: 'a-and-b' },
      { label: "Mostly B's", value: 'mostly-b' },
      { label: "Below B's", value: 'below-b' },
      { label: 'Prefer not to say', value: 'prefer-not-to-say' },
    ],
    required: true,
  },
  {
    id: 'intended-major',
    title: 'Do you have something you might want to study?',
    description: "It's okay if you're not sure yet — many students feel the same.",
    type: 'single-choice',
    options: [
      { label: 'Yes, I have an idea', value: 'yes' },
      { label: "Not sure yet", value: 'no' },
    ],
    required: true,
  },
  {
    id: 'major-selection',
    title: 'What are you interested in studying?',
    description: 'Select all fields that interest you',
    type: 'multi-choice',
    options: [
      { label: 'Engineering', value: 'engineering' },
      { label: 'Medicine / Pre-Med', value: 'medicine' },
      { label: 'Business', value: 'business' },
      { label: 'Computer Science', value: 'computer-science' },
      { label: 'Arts & Design', value: 'arts-design' },
      { label: 'Education', value: 'education' },
      { label: 'Law / Pre-Law', value: 'law' },
      { label: 'Psychology', value: 'psychology' },
      { label: 'Biology / Life Sciences', value: 'biology' },
      { label: 'Mathematics', value: 'mathematics' },
      { label: 'Communications / Journalism', value: 'communications' },
      { label: 'Social Sciences', value: 'social-sciences' },
      { label: 'Humanities', value: 'humanities' },
      { label: 'Environmental Science', value: 'environmental-science' },
      { label: 'Other', value: 'other' },
    ],
    required: true,
    skipCondition: (answers) => {
      const intendedMajorAnswer = answers.find((a) => a.questionId === 'intended-major');
      return intendedMajorAnswer?.value !== 'yes';
    },
  },
  {
    id: 'geographic-preference',
    title: 'Where would you love to study?',
    description: 'Select all regions and cities that interest you',
    type: 'multi-choice',
    options: [
      { label: 'Northeast', value: 'northeast' },
      { label: 'South', value: 'south' },
      { label: 'Midwest', value: 'midwest' },
      { label: 'West', value: 'west' },
      { label: 'West Coast', value: 'west-coast' },
      { label: 'Pacific Northwest', value: 'pacific-northwest' },
      { label: 'Mountain West', value: 'mountain-west' },
      { label: 'New York City (NYC)', value: 'nyc' },
      { label: 'Boston', value: 'boston' },
      { label: 'Los Angeles (LA)', value: 'los-angeles' },
      { label: 'San Francisco', value: 'san-francisco' },
      { label: 'Seattle', value: 'seattle' },
      { label: 'No preference', value: 'no-preference' },
    ],
    required: true,
  },
  {
    id: 'campus-environment',
    title: 'What kind of campus do you imagine?',
    description: 'Select all that apply',
    type: 'multi-choice',
    options: [
      { label: 'Urban', value: 'urban' },
      { label: 'Suburban', value: 'suburban' },
      { label: 'Small town / Rural', value: 'rural' },
      { label: 'No preference', value: 'no-preference' },
    ],
    required: true,
  },
  {
    id: 'school-size',
    title: 'What size school feels right to you?',
    description: 'Select all that apply',
    type: 'multi-choice',
    options: [
      { label: 'Small (under 5,000 students)', value: 'small' },
      { label: 'Medium (5,000–15,000)', value: 'medium' },
      { label: 'Large (15,000+)', value: 'large' },
      { label: 'No preference', value: 'no-preference' },
    ],
    required: true,
  },
  {
    id: 'extracurricular-confidence',
    title: 'How strong do you feel your extracurriculars are?',
    description: 'Select the option that best describes you',
    type: 'single-choice',
    options: [
      { label: 'Just starting', value: 1 },
      { label: 'Building up', value: 2 },
      { label: 'Moderate strength', value: 3 },
      { label: 'Strong', value: 4 },
      { label: 'Very strong', value: 5 },
    ],
    required: true,
  },
  {
    id: 'academic-confidence',
    title: 'How confident do you feel about your academics?',
    description: 'Select the option that best describes you',
    type: 'single-choice',
    options: [
      { label: 'Not confident', value: 1 },
      { label: 'Somewhat confident', value: 2 },
      { label: 'Moderately confident', value: 3 },
      { label: 'Confident', value: 4 },
      { label: 'Very confident', value: 5 },
    ],
    required: true,
  },
  {
    id: 'cost-sensitivity',
    title: 'How important is cost for your family?',
    type: 'single-choice',
    options: [
      { label: 'Very important', value: 'very-important' },
      { label: 'Somewhat important', value: 'somewhat-important' },
      { label: 'Not very important', value: 'not-important' },
      { label: 'Prefer not to say', value: 'prefer-not-to-say' },
    ],
    required: true,
  },
  {
    id: 'application-timeline',
    title: 'Where are you in the application process?',
    type: 'single-choice',
    options: [
      { label: 'Just starting', value: 'just-starting' },
      { label: 'Starting soon', value: 'starting-soon' },
      { label: 'Actively working on it', value: 'actively-working' },
      { label: 'Already applying', value: 'already-applying' },
    ],
    required: true,
  },
];

