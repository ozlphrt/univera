// Client-side College Match Engine v1 (Simple Mode)
// Based on COLLEGE_MATCH_ENGINE.md specifications

import { OnboardingAnswer } from '@/modules/onboarding/types';

export interface College {
  id: string;
  name: string;
  location: {
    city: string;
    state: string;
    region: string;
  };
  type: 'public' | 'private' | 'community' | 'for-profit';
  size: number;
  acceptanceRate?: number; // 0-1
  cost: {
    tuitionInState?: number;
    tuitionOutOfState?: number;
    averageNetPrice?: number;
  };
  academics: {
    popularMajors?: string[];
    competitiveness?: 'low' | 'medium' | 'high';
  };
  environment?: 'urban' | 'suburban' | 'rural';
  logo?: string;
}

export interface CollegeFitResult {
  collegeId: string;
  fitScore: number; // 0-100
  category: 'reach' | 'target' | 'safety';
  explanation: string;
  inputsUsed: {
    academicStrength: number;
    extracurricularStrength: number;
    preferencesMatchScore: number;
    advancedModeUsed: boolean;
  };
  breakdown?: {
    academicFit: number;
    preferenceFit: number;
    ecFit: number;
    majorFit: number;
    competitivenessAdjustment: number;
  };
}

// Comprehensive domain mapping for common colleges (for better logo coverage)
const COLLEGE_DOMAIN_MAP: Record<string, string> = {
  // Sample colleges
  'University of Illinois Urbana-Champaign': 'illinois.edu',
  'Amherst College': 'amherst.edu',
  'Stanford University': 'stanford.edu',
  'Georgia State University': 'gsu.edu',
  'Reed College': 'reed.edu',
  'University of Michigan': 'umich.edu',
  'Arizona State University': 'asu.edu',
  'Williams College': 'williams.edu',
  // Common patterns
  'University of California': 'uc.edu',
  'University of California Berkeley': 'berkeley.edu',
  'University of California Los Angeles': 'ucla.edu',
  'Massachusetts Institute of Technology': 'mit.edu',
  'Harvard University': 'harvard.edu',
  'Yale University': 'yale.edu',
  'Princeton University': 'princeton.edu',
  'Columbia University': 'columbia.edu',
  'Cornell University': 'cornell.edu',
  'University of Pennsylvania': 'upenn.edu',
  'Duke University': 'duke.edu',
  'Northwestern University': 'northwestern.edu',
  'University of Chicago': 'uchicago.edu',
  'New York University': 'nyu.edu',
  'University of Texas': 'utexas.edu',
  'University of Washington': 'washington.edu',
  'University of North Carolina': 'unc.edu',
  'University of Virginia': 'virginia.edu',
  'University of Wisconsin': 'wisc.edu',
  'Pennsylvania State University': 'psu.edu',
  'Ohio State University': 'osu.edu',
  'University of Florida': 'ufl.edu',
  'University of Southern California': 'usc.edu',
  'Boston University': 'bu.edu',
  'Northeastern University': 'northeastern.edu',
  'Carnegie Mellon University': 'cmu.edu',
  'Johns Hopkins University': 'jhu.edu',
  'Vanderbilt University': 'vanderbilt.edu',
  'Rice University': 'rice.edu',
  'Emory University': 'emory.edu',
  'Georgetown University': 'georgetown.edu',
  'University of Notre Dame': 'nd.edu',
  'Wake Forest University': 'wfu.edu',
  'Tufts University': 'tufts.edu',
  'Brandeis University': 'brandeis.edu',
  'Case Western Reserve University': 'case.edu',
  'Tulane University': 'tulane.edu',
  'University of Rochester': 'rochester.edu',
  'Boston College': 'bc.edu',
  'Villanova University': 'villanova.edu',
  'Lehigh University': 'lehigh.edu',
  'Rensselaer Polytechnic Institute': 'rpi.edu',
  'Worcester Polytechnic Institute': 'wpi.edu',
  'Stevens Institute of Technology': 'stevens.edu',
  'California Institute of Technology': 'caltech.edu',
  'Georgia Institute of Technology': 'gatech.edu',
  'Virginia Tech': 'vt.edu',
  'Texas A&M University': 'tamu.edu',
  'Purdue University': 'purdue.edu',
  'Indiana University': 'iu.edu',
  'University of Minnesota': 'umn.edu',
  'University of Maryland': 'umd.edu',
  'Rutgers University': 'rutgers.edu',
  'University of Connecticut': 'uconn.edu',
  'University of Delaware': 'udel.edu',
  'University of Vermont': 'uvm.edu',
  'University of New Hampshire': 'unh.edu',
  'University of Maine': 'maine.edu',
  'University of Rhode Island': 'uri.edu',
  'University of Massachusetts': 'umass.edu',
  'SUNY': 'suny.edu',
  'State University of New York': 'suny.edu',
  'CUNY': 'cuny.edu',
  'City University of New York': 'cuny.edu',
  'University of Colorado': 'colorado.edu',
  'University of Utah': 'utah.edu',
  'University of Arizona': 'arizona.edu',
  'University of New Mexico': 'unm.edu',
  'University of Nevada': 'unlv.edu',
  'University of Oregon': 'uoregon.edu',
  'Oregon State University': 'oregonstate.edu',
  'Washington State University': 'wsu.edu',
  'University of Idaho': 'uidaho.edu',
  'Montana State University': 'montana.edu',
  'University of Wyoming': 'uwyo.edu',
  'University of Alaska': 'alaska.edu',
  'University of Hawaii': 'hawaii.edu',
  'University of Alabama': 'ua.edu',
  'Auburn University': 'auburn.edu',
  'University of Arkansas': 'uark.edu',
  'Louisiana State University': 'lsu.edu',
  'University of Mississippi': 'olemiss.edu',
  'Mississippi State University': 'msstate.edu',
  'University of Oklahoma': 'ou.edu',
  'Oklahoma State University': 'okstate.edu',
  'Baylor University': 'baylor.edu',
  'Texas Christian University': 'tcu.edu',
  'Southern Methodist University': 'smu.edu',
  'University of Houston': 'uh.edu',
  'University of South Carolina': 'sc.edu',
  'Clemson University': 'clemson.edu',
  'University of Georgia': 'uga.edu',
  'Florida State University': 'fsu.edu',
  'University of Central Florida': 'ucf.edu',
  'University of Miami': 'miami.edu',
  'Florida International University': 'fiu.edu',
  'University of Kentucky': 'uky.edu',
  'University of Louisville': 'louisville.edu',
  'University of Tennessee': 'utk.edu',
  'Middle Tennessee State University': 'mtsu.edu',
  'North Carolina State University': 'ncsu.edu',
  'East Carolina University': 'ecu.edu',
  'Appalachian State University': 'appstate.edu',
  'University of West Virginia': 'wvu.edu',
  'Marshall University': 'marshall.edu',
  'Virginia Commonwealth University': 'vcu.edu',
  'James Madison University': 'jmu.edu',
  'George Mason University': 'gmu.edu',
  'Old Dominion University': 'odu.edu',
  'University of Richmond': 'richmond.edu',
  'College of William & Mary': 'wm.edu',
  'Washington and Lee University': 'wlu.edu',
  'Towson University': 'towson.edu',
  'Delaware State University': 'desu.edu',
};

// Helper function to generate college logo URL (using Clearbit logo API)
const getCollegeLogo = (collegeName: string): string => {
  // First, check if we have a direct mapping
  if (COLLEGE_DOMAIN_MAP[collegeName]) {
    return `https://logo.clearbit.com/${COLLEGE_DOMAIN_MAP[collegeName]}`;
  }
  
  // Try name-based domain generation with common patterns
  const nameLower = collegeName.toLowerCase();
  
  // Handle common abbreviations and patterns
  const abbreviationMap: Record<string, string> = {
    'mit': 'mit.edu',
    'm.i.t.': 'mit.edu',
    'caltech': 'caltech.edu',
    'cal tech': 'caltech.edu',
    'gatech': 'gatech.edu',
    'georgia tech': 'gatech.edu',
    'virginia tech': 'vt.edu',
    'vt': 'vt.edu',
    'texas a&m': 'tamu.edu',
    'texas a and m': 'tamu.edu',
    'tamu': 'tamu.edu',
    'penn state': 'psu.edu',
    'psu': 'psu.edu',
    'ohio state': 'osu.edu',
    'osu': 'osu.edu',
  };
  
  for (const [key, domain] of Object.entries(abbreviationMap)) {
    if (nameLower.includes(key)) {
      return `https://logo.clearbit.com/${domain}`;
    }
  }
  
  // Try to extract domain from name using common patterns
  let domain = nameLower
    .replace(/university of /g, '')
    .replace(/the university of /g, '')
    .replace(/college of /g, '')
    .replace(/institute of technology/g, '')
    .replace(/institute/g, '')
    .replace(/college/g, '')
    .replace(/university/g, '')
    .replace(/state/g, '')
    .replace(/&/g, 'and')
    .trim()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
  
  // Handle multi-word names - try first word or abbreviation
  if (domain.length > 15) {
    const words = nameLower.split(/\s+/).filter(w => 
      !['university', 'college', 'of', 'the', 'state', 'institute', 'technology'].includes(w)
    );
    if (words.length > 0) {
      // Try first significant word
      domain = words[0].replace(/[^a-z0-9]/g, '');
      // Or try abbreviation of first letters
      if (words.length > 1) {
        const abbrev = words.map(w => w[0]).join('').replace(/[^a-z0-9]/g, '');
        if (abbrev.length >= 2 && abbrev.length <= 6) {
          domain = abbrev;
        }
      }
    }
  }
  
  // Generate logo URL
  if (domain && domain.length >= 2) {
    return `https://logo.clearbit.com/${domain}.edu`;
  }
  
  // Fallback: return empty string (will use initials)
  return '';
};

// Sample college dataset (in production, this would come from an API)
const SAMPLE_COLLEGES: College[] = [
  {
    id: '1',
    name: 'University of Illinois Urbana-Champaign',
    location: { city: 'Champaign', state: 'IL', region: 'Midwest' },
    type: 'public',
    size: 56000,
    acceptanceRate: 0.60,
    cost: { tuitionInState: 15000, tuitionOutOfState: 32000, averageNetPrice: 16000 },
    academics: { popularMajors: ['Business', 'Engineering', 'Education'], competitiveness: 'medium' },
    environment: 'suburban',
    logo: getCollegeLogo('University of Illinois Urbana-Champaign'),
  },
  {
    id: '2',
    name: 'Amherst College',
    location: { city: 'Amherst', state: 'MA', region: 'Northeast' },
    type: 'private',
    size: 1900,
    acceptanceRate: 0.11,
    cost: { tuitionInState: 64000, tuitionOutOfState: 64000, averageNetPrice: 18000 },
    academics: { popularMajors: ['English', 'History', 'Psychology'], competitiveness: 'high' },
    environment: 'rural',
    logo: getCollegeLogo('Amherst College'),
  },
  {
    id: '3',
    name: 'Stanford University',
    location: { city: 'Stanford', state: 'CA', region: 'West Coast' },
    type: 'private',
    size: 17000,
    acceptanceRate: 0.04,
    cost: { tuitionInState: 56000, tuitionOutOfState: 56000, averageNetPrice: 15000 },
    academics: { popularMajors: ['Computer Science', 'Engineering', 'Mathematics'], competitiveness: 'high' },
    environment: 'suburban',
    logo: getCollegeLogo('Stanford University'),
  },
  {
    id: '4',
    name: 'Georgia State University',
    location: { city: 'Atlanta', state: 'GA', region: 'South' },
    type: 'public',
    size: 52000,
    acceptanceRate: 0.82,
    cost: { tuitionInState: 9000, tuitionOutOfState: 24000, averageNetPrice: 11000 },
    academics: { popularMajors: ['Business', 'Nursing', 'Communications'], competitiveness: 'low' },
    environment: 'urban',
    logo: getCollegeLogo('Georgia State University'),
  },
  {
    id: '5',
    name: 'Reed College',
    location: { city: 'Portland', state: 'OR', region: 'West Coast' },
    type: 'private',
    size: 1400,
    acceptanceRate: 0.48,
    cost: { tuitionInState: 62000, tuitionOutOfState: 62000, averageNetPrice: 32000 },
    academics: { popularMajors: ['Art', 'Music', 'Theater'], competitiveness: 'medium' },
    environment: 'urban',
    logo: getCollegeLogo('Reed College'),
  },
  {
    id: '6',
    name: 'University of Michigan',
    location: { city: 'Ann Arbor', state: 'MI', region: 'Midwest' },
    type: 'public',
    size: 50000,
    acceptanceRate: 0.20,
    cost: { tuitionInState: 16000, tuitionOutOfState: 53000, averageNetPrice: 17000 },
    academics: { popularMajors: ['Business', 'Engineering', 'Psychology'], competitiveness: 'high' },
    environment: 'urban',
    logo: getCollegeLogo('University of Michigan'),
  },
  {
    id: '7',
    name: 'Arizona State University',
    location: { city: 'Tempe', state: 'AZ', region: 'West Coast' },
    type: 'public',
    size: 75000,
    acceptanceRate: 0.88,
    cost: { tuitionInState: 11000, tuitionOutOfState: 29000, averageNetPrice: 14000 },
    academics: { popularMajors: ['Business', 'Engineering', 'Communications'], competitiveness: 'low' },
    environment: 'urban',
    logo: getCollegeLogo('Arizona State University'),
  },
  {
    id: '8',
    name: 'Williams College',
    location: { city: 'Williamstown', state: 'MA', region: 'Northeast' },
    type: 'private',
    size: 2100,
    acceptanceRate: 0.09,
    cost: { tuitionInState: 61000, tuitionOutOfState: 61000, averageNetPrice: 19000 },
    academics: { popularMajors: ['English', 'History', 'Economics'], competitiveness: 'high' },
    environment: 'rural',
    logo: getCollegeLogo('Williams College'),
  },
];

// Convert academic strength (1-5) to synthetic GPA
function academicStrengthToGPA(strength: number): number {
  // Map 1-5 to GPA range 2.5 - 4.0
  return 2.5 + (strength - 1) * (4.0 - 2.5) / 4;
}

// Calculate college difficulty from acceptance rate
function getCollegeDifficulty(acceptanceRate?: number): number {
  if (!acceptanceRate) return 3; // Default medium difficulty
  // Lower acceptance rate = higher difficulty (1-5 scale)
  return 1 + (1 - acceptanceRate) * 4;
}

// Calculate academic fit score (0-100)
// This score differentiates colleges based on acceptance rate and student strength match
function calculateAcademicFit(
  academicStrength: number,
  collegeDifficulty: number,
  acceptanceRate?: number
): number {
  const syntheticGPA = academicStrengthToGPA(academicStrength);
  const baseGpaScore = (syntheticGPA / 4.0) * 100;
  
  // Calculate how well the student matches the college difficulty
  const difficultyDiff = collegeDifficulty - academicStrength;
  
  // Use acceptance rate directly to create wider score differentiation
  let acceptanceRateScore = 50; // Base score
  if (acceptanceRate !== undefined && acceptanceRate !== null) {
    // Higher acceptance rate = better fit for most students (safety schools score higher)
    // But we also consider student strength
    if (acceptanceRate >= 0.7) {
      // Very safe schools (70%+ acceptance) - good for most students
      acceptanceRateScore = 75 + (acceptanceRate - 0.7) * 50; // 75-90 range
    } else if (acceptanceRate >= 0.5) {
      // Moderate schools (50-70% acceptance) - target schools
      acceptanceRateScore = 60 + (acceptanceRate - 0.5) * 75; // 60-75 range
    } else if (acceptanceRate >= 0.3) {
      // Competitive schools (30-50% acceptance) - target/reach
      acceptanceRateScore = 40 + (acceptanceRate - 0.3) * 100; // 40-60 range
    } else if (acceptanceRate >= 0.15) {
      // Very competitive schools (15-30% acceptance) - reach schools
      acceptanceRateScore = 20 + (acceptanceRate - 0.15) * 133; // 20-40 range
    } else {
      // Highly selective schools (<15% acceptance) - extreme reach
      acceptanceRateScore = Math.max(0, 20 * (acceptanceRate / 0.15)); // 0-20 range
    }
  }
  
  // Adjust based on difficulty match
  let difficultyAdjustment = 0;
  if (Math.abs(difficultyDiff) <= 0.3) {
    // Very close match - bonus
    difficultyAdjustment = 15;
  } else if (Math.abs(difficultyDiff) <= 0.7) {
    // Close match - small bonus
    difficultyAdjustment = 5;
  } else if (difficultyDiff > 1.0) {
    // College is much harder - significant penalty
    difficultyAdjustment = -20;
  } else if (difficultyDiff > 0.7) {
    // College is harder - penalty
    difficultyAdjustment = -10;
  } else if (difficultyDiff < -1.0) {
    // College is much easier - small bonus (safety schools)
    difficultyAdjustment = 10;
  }
  
  // Combine acceptance rate score with difficulty adjustment
  const finalScore = acceptanceRateScore + difficultyAdjustment;
  
  // Also factor in base GPA score for additional differentiation
  const combinedScore = (finalScore * 0.7) + (baseGpaScore * 0.3);
  
  return Math.max(0, Math.min(100, Math.round(combinedScore)));
}

// Calculate preference fit score (0-100)
// This score differentiates between colleges even after filtering
function calculatePreferenceFit(
  college: College,
  answers: OnboardingAnswer[]
): number {
  let score = 0; // Start from 0, build up based on matches
  
  // Check region and city preference - give higher scores for exact matches
  const regionAnswer = answers.find((a) => a.questionId === 'geographic-preference');
  if (regionAnswer) {
    const preferences = Array.isArray(regionAnswer.value) ? regionAnswer.value : [regionAnswer.value];
    
    if (preferences.includes('no-preference')) {
      score += 30; // Base score if no preference
    } else {
      // Normalize city names for matching
      const normalizeCity = (city: string): string => {
        return city.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
      };
      
      const collegeCityNormalized = normalizeCity(college.location.city);
      const collegeRegionLower = college.location.region.toLowerCase();
      
      let locationScore = 0;
      let exactCityMatch = false;
      
      // Check for exact city matches first (highest score)
      const cityMappings: Record<string, string[]> = {
        'nyc': ['new york', 'new-york', 'nyc'],
        'boston': ['boston'],
        'los-angeles': ['los angeles', 'los-angeles', 'la'],
        'san-francisco': ['san francisco', 'san-francisco', 'sf'],
        'seattle': ['seattle'],
      };
      
      for (const [prefValue, cityVariants] of Object.entries(cityMappings)) {
        if (preferences.includes(prefValue)) {
          const matchesCity = cityVariants.some(variant => 
            collegeCityNormalized.includes(variant.replace(/-/g, ' ')) ||
            collegeCityNormalized === variant.replace(/\s+/g, '-')
          );
          // Seattle also matches Washington state colleges
          if (prefValue === 'seattle' && college.location.state === 'WA') {
            exactCityMatch = true;
            locationScore = 40; // Exact city match gets highest score
            break;
          }
          if (matchesCity) {
            exactCityMatch = true;
            locationScore = 40; // Exact city match gets highest score
            break;
          }
        }
      }
      
      // If no exact city match, check region matches with more granularity
      if (!exactCityMatch) {
        if (preferences.includes(collegeRegionLower)) {
          // Check if it's a primary region preference (first in list = more important)
          const regionIndex = preferences.indexOf(collegeRegionLower);
          locationScore = 35 - (regionIndex * 2); // 35 for first preference, decreasing
        } else if (preferences.includes('pacific-northwest') && 
                   (college.location.state === 'WA' || college.location.state === 'OR')) {
          locationScore = 28; // Pacific Northwest match
        } else {
          // Check if state matches any city preference's state
          const cityToStateMap: Record<string, string> = {
            'seattle': 'WA',
            'nyc': 'NY',
            'boston': 'MA',
            'los-angeles': 'CA',
            'san-francisco': 'CA',
          };
          const matchingState = Object.entries(cityToStateMap).find(([city, state]) => 
            preferences.includes(city) && college.location.state === state
          );
          if (matchingState) {
            locationScore = 20; // Same state as preferred city
          } else {
            locationScore = 10; // State match but not exact region
          }
        }
      }
      
      score += locationScore;
    }
  }

  // Check campus environment - handle multi-choice with granular scoring
  const environmentAnswer = answers.find((a) => a.questionId === 'campus-environment');
  if (environmentAnswer && college.environment) {
    const environmentPreferences = Array.isArray(environmentAnswer.value) 
      ? environmentAnswer.value 
      : [environmentAnswer.value];
    
    if (environmentPreferences.includes('no-preference')) {
      score += 15; // Base score
    } else if (environmentPreferences.includes(college.environment)) {
      // Check if it's the first/preferred environment
      const envIndex = environmentPreferences.indexOf(college.environment);
      score += 30 - (envIndex * 3); // 30 for first preference, decreasing
    } else {
      score += 5; // Different environment (shouldn't happen after filtering)
    }
  }

  // Check school size - handle multi-choice with granular scoring
  const sizeAnswer = answers.find((a) => a.questionId === 'school-size');
  if (sizeAnswer) {
    const sizePreferences = Array.isArray(sizeAnswer.value) 
      ? sizeAnswer.value 
      : [sizeAnswer.value];
    
    if (sizePreferences.includes('no-preference')) {
      score += 15; // Base score
    } else {
      const sizeMap: Record<string, { min: number; max: number }> = {
        small: { min: 0, max: 5000 },
        medium: { min: 5000, max: 15000 },
        large: { min: 15000, max: Infinity },
      };
      
      let matchedSizeIndex = -1;
      for (let i = 0; i < sizePreferences.length; i++) {
        const sizePref = sizePreferences[i];
        const sizeRange = sizeMap[sizePref];
        if (sizeRange && college.size >= sizeRange.min && college.size < sizeRange.max) {
          matchedSizeIndex = i;
          break;
        }
      }
      
      if (matchedSizeIndex >= 0) {
        score += 30 - (matchedSizeIndex * 3); // 30 for first preference, decreasing
      } else {
        score += 5; // Size mismatch (shouldn't happen after filtering)
      }
    }
  }

  // Add bonus for colleges that match multiple preferences with higher granularity
  let matchBonus = 0;
  const hasLocationMatch = score > 0 && regionAnswer;
  const hasEnvironmentMatch = environmentAnswer && college.environment && 
    (Array.isArray(environmentAnswer.value) ? environmentAnswer.value : [environmentAnswer.value])
      .includes(college.environment);
  const hasSizeMatch = sizeAnswer && (() => {
    const sizePreferences = Array.isArray(sizeAnswer.value) ? sizeAnswer.value : [sizeAnswer.value];
    const sizeMap: Record<string, { min: number; max: number }> = {
      small: { min: 0, max: 5000 },
      medium: { min: 5000, max: 15000 },
      large: { min: 15000, max: Infinity },
    };
    return sizePreferences.some(sp => {
      const range = sizeMap[sp];
      return range && college.size >= range.min && college.size < range.max;
    });
  })();
  
  const matchCount = (hasLocationMatch ? 1 : 0) + (hasEnvironmentMatch ? 1 : 0) + (hasSizeMatch ? 1 : 0);
  if (matchCount === 3) {
    matchBonus = 15; // Perfect match on all preferences
  } else if (matchCount === 2) {
    matchBonus = 8; // Match on 2 preferences
  }
  
  score += matchBonus;

  return Math.min(100, Math.max(0, score));
}

// Map major preferences to keywords for matching
const MAJOR_KEYWORDS: Record<string, string[]> = {
  'engineering': ['engineering', 'engineer', 'mechanical', 'electrical', 'civil', 'chemical', 'aerospace', 'biomedical'],
  'medicine': ['medicine', 'medical', 'pre-med', 'premed', 'health', 'biology', 'biochemistry', 'neuroscience', 'pharmacy', 'nursing'],
  'business': ['business', 'management', 'finance', 'accounting', 'marketing', 'economics', 'entrepreneurship'],
  'computer-science': ['computer', 'computing', 'software', 'programming', 'information', 'technology', 'cs', 'it'],
  'arts-design': ['art', 'arts', 'design', 'fine arts', 'visual', 'graphic', 'fashion', 'architecture'],
  'education': ['education', 'teaching', 'pedagogy', 'curriculum'],
  'law': ['law', 'legal', 'pre-law', 'prelaw', 'jurisprudence'],
  'psychology': ['psychology', 'psychology', 'counseling', 'clinical'],
  'biology': ['biology', 'biological', 'life sciences', 'biochemistry', 'molecular', 'genetics'],
  'mathematics': ['mathematics', 'math', 'statistics', 'applied math'],
  'communications': ['communications', 'communication', 'journalism', 'media', 'broadcasting'],
  'social-sciences': ['sociology', 'anthropology', 'political science', 'international relations', 'social work'],
  'humanities': ['english', 'history', 'philosophy', 'literature', 'classics', 'languages'],
  'environmental-science': ['environmental', 'ecology', 'sustainability', 'conservation'],
  'other': [], // No specific keywords
};

// Check if a college offers a specific major
function collegeOffersMajor(college: College, majorPreference: string): boolean {
  // If college has no major data, check college name for indicators
  if (!college.academics?.popularMajors || college.academics.popularMajors.length === 0) {
    // Check college name for major-specific indicators
    const collegeNameLower = college.name.toLowerCase();
    
    // Medicine/Health: Medical schools, health sciences, etc.
    if (majorPreference === 'medicine') {
      if (collegeNameLower.includes('medical') || 
          collegeNameLower.includes('health') ||
          collegeNameLower.includes('medicine')) {
        return true;
      }
    }
    
    // Engineering: Tech schools, engineering schools
    if (majorPreference === 'engineering') {
      if (collegeNameLower.includes('tech') ||
          collegeNameLower.includes('engineering') ||
          collegeNameLower.includes('institute of technology')) {
        return true;
      }
    }
    
    // If no data and no name indicators, be conservative and include it
    // (Better to show some irrelevant colleges than exclude relevant ones)
    return true;
  }
  
  const majorKeywords = MAJOR_KEYWORDS[majorPreference] || [];
  if (majorKeywords.length === 0) {
    return true; // If no keywords defined, don't filter
  }
  
  // Check if any popular major matches the keywords
  const collegeMajorsLower = college.academics.popularMajors.map(m => m.toLowerCase());
  const matchesKeyword = majorKeywords.some(keyword => 
    collegeMajorsLower.some(major => major.includes(keyword.toLowerCase()))
  );
  
  // Also check college name for additional indicators
  if (!matchesKeyword) {
    const collegeNameLower = college.name.toLowerCase();
    if (majorPreference === 'medicine' && 
        (collegeNameLower.includes('medical') || collegeNameLower.includes('health'))) {
      return true;
    }
    if (majorPreference === 'engineering' && 
        (collegeNameLower.includes('tech') || collegeNameLower.includes('engineering'))) {
      return true;
    }
  }
  
  return matchesKeyword;
}

// Filter colleges by geographic preferences
function filterCollegesByLocation(
  colleges: College[],
  geographicPreferences: string[]
): College[] {
  if (!geographicPreferences || geographicPreferences.length === 0 || geographicPreferences.includes('no-preference')) {
    return colleges; // No filtering if no preference
  }
  
  const normalizeCity = (city: string): string => {
    return city.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
  };
  
  return colleges.filter(college => {
    const collegeCityNormalized = normalizeCity(college.location.city);
    const collegeRegionLower = college.location.region.toLowerCase();
    
    // Check region matches
    if (geographicPreferences.some(pref => 
      pref.toLowerCase() === collegeRegionLower ||
      pref === 'no-preference'
    )) {
      return true;
    }
    
    // Check Pacific Northwest (WA, OR states)
    if (geographicPreferences.includes('pacific-northwest') && 
        (college.location.state === 'WA' || college.location.state === 'OR')) {
      return true;
    }
    
    // Check city matches
    const cityMappings: Record<string, string[]> = {
      'nyc': ['new york', 'new-york', 'nyc'],
      'boston': ['boston'],
      'los-angeles': ['los angeles', 'los-angeles', 'la'],
      'san-francisco': ['san francisco', 'san-francisco', 'sf'],
      'seattle': ['seattle'],
    };
    
    for (const [prefValue, cityVariants] of Object.entries(cityMappings)) {
      if (geographicPreferences.includes(prefValue)) {
        // Seattle also matches Washington state colleges
        if (prefValue === 'seattle' && college.location.state === 'WA') {
          return true;
        }
        // Check if city matches
        const matchesCity = cityVariants.some(variant => 
          collegeCityNormalized.includes(variant.replace(/-/g, ' ')) ||
          collegeCityNormalized === variant.replace(/\s+/g, '-')
        );
        if (matchesCity) {
          return true;
        }
      }
    }
    
    return false;
  });
}

// Filter colleges by major preferences
function filterCollegesByMajor(
  colleges: College[],
  majorPreferences: string[]
): College[] {
  if (!majorPreferences || majorPreferences.length === 0) {
    return colleges; // No filtering if no major preference
  }
  
  return colleges.filter(college => {
    // College must offer at least one of the selected majors
    return majorPreferences.some(major => collegeOffersMajor(college, major));
  });
}

// Filter colleges by campus environment preferences
function filterCollegesByEnvironment(
  colleges: College[],
  environmentPreferences: string[]
): College[] {
  if (!environmentPreferences || environmentPreferences.length === 0 || environmentPreferences.includes('no-preference')) {
    return colleges; // No filtering if no preference
  }
  
  return colleges.filter(college => {
    // College must match at least one of the selected environments
    if (!college.environment) {
      return true; // If college doesn't have environment data, include it (conservative)
    }
    return environmentPreferences.includes(college.environment);
  });
}

// Filter colleges by school size preferences
function filterCollegesBySize(
  colleges: College[],
  sizePreferences: string[]
): College[] {
  if (!sizePreferences || sizePreferences.length === 0 || sizePreferences.includes('no-preference')) {
    return colleges; // No filtering if no preference
  }
  
  const sizeMap: Record<string, { min: number; max: number }> = {
    small: { min: 0, max: 5000 },
    medium: { min: 5000, max: 15000 },
    large: { min: 15000, max: Infinity },
  };
  
  return colleges.filter(college => {
    // College must match at least one of the selected size ranges
    return sizePreferences.some(sizePref => {
      const sizeRange = sizeMap[sizePref];
      if (!sizeRange) return true; // Unknown size preference, include it
      return college.size >= sizeRange.min && college.size < sizeRange.max;
    });
  });
}

// Calculate EC fit score (0-100)
function calculateECFit(extracurricularStrength: number): number {
  // Simple linear mapping: 1-5 → 20-100
  return 20 + (extracurricularStrength - 1) * 20;
}

// Generate explanation text
function generateExplanation(
  college: College,
  _fitScore: number, // Used for category determination, prefixed with _ to avoid unused warning
  category: 'reach' | 'target' | 'safety',
  academicFit: number,
  preferenceFit: number
): string {
  const parts: string[] = [];

  // Academic fit explanation
  if (academicFit >= 70) {
    parts.push(`Your academic profile aligns well with ${college.name}'s admitted students.`);
  } else if (academicFit >= 50) {
    parts.push(`Your academics are competitive for ${college.name}, though it may be a stretch.`);
  } else {
    parts.push(`${college.name} is academically competitive, making this a reach school.`);
  }

  // Preference fit explanation
  if (preferenceFit >= 70) {
    parts.push(`The ${college.location.region} location and ${college.environment || 'campus'} environment match your preferences.`);
  }

  // Category-specific explanation
  if (category === 'safety') {
    parts.push(`With an acceptance rate of ${Math.round((college.acceptanceRate || 0) * 100)}%, this is a strong safety option for you.`);
  } else if (category === 'target') {
    parts.push(`This school represents a good target match based on your profile.`);
  } else {
    parts.push(`This is a reach school, but still worth considering if it aligns with your goals.`);
  }

  return parts.join(' ');
}

// Main match function (Simple Mode)
// Can accept colleges from API or use sample data
// Note: If colleges are already filtered, pass skipFiltering=true to avoid double filtering
export function matchColleges(
  answers: OnboardingAnswer[],
  colleges: College[] = SAMPLE_COLLEGES,
  skipFiltering: boolean = false
): CollegeFitResult[] {
  let filteredColleges = [...colleges];
  
  // Only filter if not already filtered (skipFiltering flag)
  if (!skipFiltering) {
    // Filter colleges by ALL preferences BEFORE matching
    const geographicAnswer = answers.find((a) => a.questionId === 'geographic-preference');
    const majorAnswer = answers.find((a) => a.questionId === 'major-selection');
    const environmentAnswer = answers.find((a) => a.questionId === 'campus-environment');
    const sizeAnswer = answers.find((a) => a.questionId === 'school-size');
    
    // Filter by geographic preferences
    if (geographicAnswer) {
      const geographicPreferences = Array.isArray(geographicAnswer.value) 
        ? geographicAnswer.value 
        : [geographicAnswer.value];
      if (geographicPreferences.length > 0 && !geographicPreferences.includes('no-preference')) {
        filteredColleges = filterCollegesByLocation(filteredColleges, geographicPreferences);
      }
    }
    
    // Filter by major preferences
    if (majorAnswer) {
      const majorPreferences = Array.isArray(majorAnswer.value) 
        ? majorAnswer.value 
        : [majorAnswer.value];
      if (majorPreferences.length > 0) {
        filteredColleges = filterCollegesByMajor(filteredColleges, majorPreferences);
      }
    }
    
    // Filter by campus environment preferences
    if (environmentAnswer) {
      const environmentPreferences = Array.isArray(environmentAnswer.value) 
        ? environmentAnswer.value 
        : [environmentAnswer.value];
      if (environmentPreferences.length > 0) {
        filteredColleges = filterCollegesByEnvironment(filteredColleges, environmentPreferences);
      }
    }
    
    // Filter by school size preferences
    if (sizeAnswer) {
      const sizePreferences = Array.isArray(sizeAnswer.value) 
        ? sizeAnswer.value 
        : [sizeAnswer.value];
      if (sizePreferences.length > 0) {
        filteredColleges = filterCollegesBySize(filteredColleges, sizePreferences);
      }
    }
  }
  
  // If filtering resulted in no colleges, return empty array
  if (filteredColleges.length === 0) {
    console.warn('⚠️ No colleges to match. filteredColleges.length === 0');
    return [];
  }
  
  console.log(`matchColleges: Processing ${filteredColleges.length} colleges (skipFiltering: ${skipFiltering})`);
  console.log('Sample college in matchColleges:', filteredColleges[0] ? {
    id: filteredColleges[0].id,
    name: filteredColleges[0].name,
    type: typeof filteredColleges[0].id
  } : 'none');
  
  // Extract key answers
  const academicAnswer = answers.find((a) => a.questionId === 'academic-confidence');
  const ecAnswer = answers.find((a) => a.questionId === 'extracurricular-confidence');

  const academicStrength = academicAnswer?.value ?? 3; // Default to 3
  const extracurricularStrength = ecAnswer?.value ?? 3; // Default to 3

  console.log('Academic strength:', academicStrength, 'EC strength:', extracurricularStrength);

  // Map filtered colleges to results with temporary fields for redistribution
  const resultsWithMetadata = filteredColleges.map((college) => {
    console.log(`Processing college: ${college.id} (${college.name})`);
    const collegeDifficulty = getCollegeDifficulty(college.acceptanceRate);
    const academicFit = calculateAcademicFit(academicStrength, collegeDifficulty, college.acceptanceRate);
    const preferenceFit = calculatePreferenceFit(college, answers);
    const ecFit = calculateECFit(extracurricularStrength);
    
    // Calculate major fit score (0-20) - more granular than just a bonus
    let majorFitScore = 0;
    const majorAnswer = answers.find((a) => a.questionId === 'major-selection');
    if (majorAnswer) {
      const majorPreferences = Array.isArray(majorAnswer.value) 
        ? majorAnswer.value 
        : [majorAnswer.value];
      // Check if college offers the selected major(s)
      const offersSelectedMajor = majorPreferences.some(major => collegeOffersMajor(college, major));
      if (offersSelectedMajor) {
        // Check competitiveness match for major
        const competitiveness = college.academics?.competitiveness || 'medium';
        if (competitiveness === 'high' && majorPreferences.includes('medicine')) {
          majorFitScore = 20; // High competitiveness + medicine = perfect match
        } else if (competitiveness === 'high' || majorPreferences.length > 1) {
          majorFitScore = 15; // Multiple majors or high competitiveness
        } else {
          majorFitScore = 10; // Basic match
        }
      }
    }
    
    // Calculate competitiveness bonus/penalty based on student strength
    let competitivenessAdjustment = 0;
    const competitiveness = college.academics?.competitiveness || 'medium';
    if (competitiveness === 'high' && academicStrength >= 4) {
      competitivenessAdjustment = 5; // High competitiveness matches strong students
    } else if (competitiveness === 'high' && academicStrength <= 2) {
      competitivenessAdjustment = -10; // High competitiveness penalizes weak students
    } else if (competitiveness === 'low' && academicStrength >= 4) {
      competitivenessAdjustment = -5; // Low competitiveness penalizes strong students
    }

    // Combine scores with wider differentiation
    // academicFit: 60%, preferenceFit: 25%, ecFit: 8%, majorFit: 5%, competitiveness: 2%
    const fitScore = Math.round(
      academicFit * 0.60 + 
      preferenceFit * 0.25 + 
      ecFit * 0.08 + 
      majorFitScore * 0.05 + 
      competitivenessAdjustment
    );

    // Use acceptance rate directly for categorization (more reliable)
    const acceptanceRate = college.acceptanceRate || 0.5; // Default to 50% if unknown
    
    // Initial category assignment - will be adjusted by percentile distribution
    let category: 'reach' | 'target' | 'safety';
    
    // Check Reach FIRST (most selective) - More inclusive threshold
    // Low acceptance rate (< 40%) OR poor academic fit OR college significantly harder
    if (acceptanceRate < 0.4 || academicFit < 60 || collegeDifficulty > academicStrength + 1) {
      category = 'reach';
    }
    // Safety: High acceptance rate (>= 55%) AND good academic fit (>= 65) AND college not harder than student
    else if (acceptanceRate >= 0.55 && academicFit >= 65 && collegeDifficulty <= academicStrength) {
      category = 'safety';
    }
    // Target: Everything else - Moderate acceptance rate (40-55%) OR good fit with matching difficulty
    else if (
      (acceptanceRate >= 0.4 && acceptanceRate < 0.55) ||
      (academicFit >= 60 && academicFit < 75 && Math.abs(collegeDifficulty - academicStrength) <= 1)
    ) {
      category = 'target';
    }
    // Fallback: Use fit score thresholds
    else if (fitScore >= 70 && collegeDifficulty <= academicStrength) {
      category = 'safety';
    } else if (fitScore >= 50) {
      category = 'target';
    } else {
      category = 'reach';
    }

    // Generate explanation (fitScore is used in generateExplanation)
    const explanation = generateExplanation(college, fitScore, category, academicFit, preferenceFit);

    const result = {
      collegeId: String(college.id), // Ensure ID is a string for consistent matching
      fitScore,
      category,
      explanation,
      acceptanceRate, // Temporary field for redistribution
      inputsUsed: {
        academicStrength,
        extracurricularStrength,
        preferencesMatchScore: preferenceFit,
        advancedModeUsed: false,
      },
      breakdown: {
        academicFit: Math.round(academicFit),
        preferenceFit: Math.round(preferenceFit),
        ecFit: Math.round(ecFit),
        majorFit: majorFitScore,
        competitivenessAdjustment,
      },
    };
    console.log(`Created match result for ${college.id}:`, { collegeId: result.collegeId, fitScore: result.fitScore });
    return result;
  });

  // Sort by fit score (descending) for percentile-based redistribution
  const sortedResults = resultsWithMetadata.sort((a, b) => b.fitScore - a.fitScore);
  
  // Redistribute categories using percentiles to ensure balanced distribution
  // Goal: Top 25-30% = Reach, Middle 40-50% = Target, Bottom 25-30% = Safety
  const total = sortedResults.length;
  if (total > 0) {
    // Calculate thresholds for balanced distribution
    const reachThreshold = Math.floor(total * 0.30); // Top 30% as Reach
    const safetyThreshold = Math.floor(total * 0.70); // Bottom 30% as Safety
    // Middle 40% as Target
    
    sortedResults.forEach((result, index) => {
      // Type assertion for temporary field
      const resultWithMetadata = result as typeof result & { acceptanceRate: number };
      
      // Redistribute based on percentile position and acceptance rate
      if (index < reachThreshold) {
        // Top 30% - prioritize Reach if acceptance rate < 50%
        if (resultWithMetadata.acceptanceRate < 0.5) {
          result.category = 'reach';
        } else if (resultWithMetadata.acceptanceRate >= 0.6) {
          // Very safe schools in top 30% should be Target, not Reach
          result.category = 'target';
        }
      } else if (index >= safetyThreshold) {
        // Bottom 30% - prioritize Safety if acceptance rate >= 50%
        if (resultWithMetadata.acceptanceRate >= 0.5) {
          result.category = 'safety';
        } else if (resultWithMetadata.acceptanceRate < 0.3) {
          // Very selective schools in bottom 30% should be Target, not Safety
          result.category = 'target';
        }
      } else {
        // Middle 40% - keep as Target, but adjust extremes
        if (resultWithMetadata.acceptanceRate < 0.25) {
          // Very selective -> Reach
          result.category = 'reach';
        } else if (resultWithMetadata.acceptanceRate >= 0.65) {
          // Very safe -> Safety
          result.category = 'safety';
        } else {
          // Otherwise Target
          result.category = 'target';
        }
      }
    });
  }

  // Remove temporary fields before returning
  return sortedResults.map(({ acceptanceRate, ...result }) => result);
}

// Export sample colleges and filtering functions for use in other modules
export { 
  SAMPLE_COLLEGES, 
  filterCollegesByLocation, 
  filterCollegesByMajor, 
  filterCollegesByEnvironment,
  filterCollegesBySize,
  collegeOffersMajor 
};

