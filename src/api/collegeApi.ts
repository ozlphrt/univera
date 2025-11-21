// College Database API Integration
// Supports multiple providers with fallback to sample data

import { College } from '@/utils/matchEngine';
import { SAMPLE_COLLEGES } from '@/utils/matchEngine';

export interface CollegeApiResponse {
  colleges: College[];
  total: number;
  source: 'api' | 'sample';
}

// College Scorecard API (U.S. Department of Education)
// Documentation: https://collegescorecard.ed.gov/data/documentation/
const COLLEGE_SCORECARD_API_KEY = import.meta.env.VITE_COLLEGE_SCORECARD_API_KEY || '';
const COLLEGE_SCORECARD_BASE_URL = 'https://api.data.gov/ed/collegescorecard/v1/schools';

// Debug: Log API key status (only first 4 chars for security)
if (import.meta.env.DEV) {
  if (COLLEGE_SCORECARD_API_KEY) {
    console.info(`✓ College Scorecard API key loaded: ${COLLEGE_SCORECARD_API_KEY.substring(0, 4)}...`);
  } else {
    console.warn('⚠️ College Scorecard API key not found in import.meta.env.VITE_COLLEGE_SCORECARD_API_KEY');
  }
}

interface CollegeScorecardSchool {
  id: number;
  school: {
    name: string;
    city: string;
    state: string;
    zip: string;
    locale: number; // 11=city, 12=suburban, 13=rural, 21=town, 22=suburban, 23=rural
  };
  latest: {
    student: {
      size: number;
    };
    admissions: {
      admission_rate: {
        overall: number;
      };
    };
    cost: {
      tuition: {
        in_state: number;
        out_of_state: number;
      };
      avg_net_price: {
        overall: number;
      };
    };
    programs: {
      cip_4_digit: Array<{
        code: string;
        title: string;
      }>;
    };
  };
}

// Map locale codes to environment types
function mapLocaleToEnvironment(locale: number): 'urban' | 'suburban' | 'rural' {
  // 11, 12 = city/suburban (urban)
  // 13 = rural
  // 21, 22 = town/suburban (suburban)
  // 23 = rural
  if (locale === 11 || locale === 12) return 'urban';
  if (locale === 13 || locale === 23) return 'rural';
  return 'suburban';
}

// Map state to region
function mapStateToRegion(state: string): string {
  const regionMap: Record<string, string> = {
    // Northeast
    ME: 'Northeast', NH: 'Northeast', VT: 'Northeast', MA: 'Northeast',
    RI: 'Northeast', CT: 'Northeast', NY: 'Northeast', NJ: 'Northeast',
    PA: 'Northeast', DE: 'Northeast', MD: 'Northeast',
    // South
    VA: 'South', WV: 'South', KY: 'South', TN: 'South', NC: 'South',
    SC: 'South', GA: 'South', FL: 'South', AL: 'South', MS: 'South',
    AR: 'South', LA: 'South', OK: 'South', TX: 'South',
    // Midwest
    OH: 'Midwest', IN: 'Midwest', IL: 'Midwest', MI: 'Midwest',
    WI: 'Midwest', MN: 'Midwest', IA: 'Midwest', MO: 'Midwest',
    ND: 'Midwest', SD: 'Midwest', NE: 'Midwest', KS: 'Midwest',
    // West Coast
    WA: 'West Coast', OR: 'West Coast', CA: 'West Coast', AK: 'West Coast', HI: 'West Coast',
    // West (Mountain)
    MT: 'West', ID: 'West', WY: 'West', CO: 'West', NM: 'West',
    AZ: 'West', UT: 'West', NV: 'West',
  };
  return regionMap[state] || 'Other';
}

// Helper function to get nested value from flat object with dot notation keys
function getNestedValue(obj: any, path: string): any {
  // First try direct nested access
  const parts = path.split('.');
  let value = obj;
  for (const part of parts) {
    if (value && typeof value === 'object') {
      value = value[part];
    } else {
      return undefined;
    }
  }
  
  // If not found, try flat key access (e.g., 'latest.student.size')
  if (value === undefined && obj[path] !== undefined) {
    return obj[path];
  }
  
  return value;
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
  'Vanderbilt University': 'vanderbilt.edu',
  'Middle Tennessee State University': 'mtsu.edu',
  'University of North Carolina': 'unc.edu',
  'North Carolina State University': 'ncsu.edu',
  'Duke University': 'duke.edu',
  'Wake Forest University': 'wfu.edu',
  'East Carolina University': 'ecu.edu',
  'Appalachian State University': 'appstate.edu',
  'University of West Virginia': 'wvu.edu',
  'Marshall University': 'marshall.edu',
  'University of Virginia': 'virginia.edu',
  'Virginia Commonwealth University': 'vcu.edu',
  'James Madison University': 'jmu.edu',
  'George Mason University': 'gmu.edu',
  'Old Dominion University': 'odu.edu',
  'University of Richmond': 'richmond.edu',
  'College of William & Mary': 'wm.edu',
  'Washington and Lee University': 'wlu.edu',
  'University of Maryland': 'umd.edu',
  'Johns Hopkins University': 'jhu.edu',
  'Towson University': 'towson.edu',
  'University of Delaware': 'udel.edu',
  'Delaware State University': 'desu.edu',
};

// Generate college logo URL with comprehensive domain mapping
function generateCollegeLogo(collegeName: string, schoolUrl?: string): string {
  // First, check if we have a direct mapping
  if (COLLEGE_DOMAIN_MAP[collegeName]) {
    return `https://logo.clearbit.com/${COLLEGE_DOMAIN_MAP[collegeName]}`;
  }
  
  // Second, try to extract domain from URL if provided
  if (schoolUrl) {
    try {
      const urlObj = new URL(schoolUrl);
      const domain = urlObj.hostname.replace(/^www\./, '');
      return `https://logo.clearbit.com/${domain}`;
    } catch (e) {
      // URL parsing failed, continue to name-based approach
    }
  }
  
  // Third, try name-based domain generation with common patterns
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
  
  // Fourth, try to extract domain from name using common patterns
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
}

// Convert College Scorecard data to our College format
function convertScorecardToCollege(school: any): College | null {
  try {
    // The API returns flat keys like 'school.name', 'latest.student.size', etc.
    // Try to get school name from various possible locations
    const name = getNestedValue(school, 'school.name') || 
                 school['school.name'] || 
                 school.school?.name || 
                 school.name;
    
    if (!name) {
      // Skip if no name found
      return null;
    }
    
    const state = getNestedValue(school, 'school.state') || 
                  school['school.state'] || 
                  school.school?.state || 
                  school.state || '';
    const city = getNestedValue(school, 'school.city') || 
                 school['school.city'] || 
                 school.school?.city || 
                 school.city || '';
    const region = mapStateToRegion(state);
    
    // Access flat keys directly
    const size = getNestedValue(school, 'latest.student.size') || school['latest.student.size'] || 0;
    const acceptanceRate = getNestedValue(school, 'latest.admissions.admission_rate.overall') || 
                          school['latest.admissions.admission_rate.overall'];
    const tuitionInState = getNestedValue(school, 'latest.cost.tuition.in_state') || 
                          school['latest.cost.tuition.in_state'];
    const tuitionOutOfState = getNestedValue(school, 'latest.cost.tuition.out_of_state') || 
                              school['latest.cost.tuition.out_of_state'];
    const avgNetPrice = getNestedValue(school, 'latest.cost.avg_net_price.overall') || 
                       school['latest.cost.avg_net_price.overall'];
    const locale = getNestedValue(school, 'school.locale') || 
                   school['school.locale'] || 
                   school.school?.locale || 
                   12;
    
    // Get school website URL for logo generation
    const schoolUrl = getNestedValue(school, 'school.school_url') || 
                     school['school.school_url'] || 
                     school.school?.school_url || 
                     '';
    
    // Determine college type (simplified - would need more data for accuracy)
    const isPublic = name.toLowerCase().includes('university') || 
                     name.toLowerCase().includes('state') ||
                     name.toLowerCase().includes('public');
    const type = isPublic ? 'public' : 'private';
    
    // Get popular majors - programs data might not be available in flat structure
    // For now, skip majors or try to extract from programs if available
    const programsData = getNestedValue(school, 'latest.programs.cip_4_digit') || 
                        school['latest.programs.cip_4_digit'] ||
                        school.latest?.programs?.cip_4_digit || 
                        [];
    const popularMajors = Array.isArray(programsData) 
      ? programsData
          .slice(0, 3)
          .map((p: any) => (p.title || p)?.toString().split(' ')[0] || '')
          .filter((m: string) => m.length > 0)
      : [];
    
    // Determine competitiveness from acceptance rate
    let competitiveness: 'low' | 'medium' | 'high' = 'medium';
    if (acceptanceRate !== undefined && acceptanceRate !== null) {
      if (acceptanceRate > 0.7) competitiveness = 'low';
      else if (acceptanceRate < 0.3) competitiveness = 'high';
    }
    
    const environment = mapLocaleToEnvironment(locale);
    
    // Generate logo URL using comprehensive logo generation function
    const logo = generateCollegeLogo(name, schoolUrl);
    
    // Get school ID
    const schoolId = getNestedValue(school, 'id') || 
                     school['id'] || 
                     school.school?.id || 
                     Math.random().toString();
    
    return {
      id: schoolId.toString(),
      name,
      location: {
        city,
        state,
        region,
      },
      type,
      size: size || 0,
      acceptanceRate: acceptanceRate !== null ? acceptanceRate : undefined,
      cost: {
        tuitionInState: tuitionInState !== null ? tuitionInState : undefined,
        tuitionOutOfState: tuitionOutOfState !== null ? tuitionOutOfState : undefined,
        averageNetPrice: avgNetPrice !== null ? avgNetPrice : undefined,
      },
      academics: {
        popularMajors: popularMajors.length > 0 ? popularMajors : undefined,
        competitiveness,
      },
      environment,
      logo: logo || undefined,
    };
  } catch (error) {
    console.error('Error converting college data:', error, school);
    return null;
  }
}

// Fetch colleges from College Scorecard API
export async function fetchCollegesFromAPI(
  limit: number = 100,
  filters?: {
    state?: string;
    city?: string;
    type?: 'public' | 'private';
    minSize?: number;
    maxSize?: number;
  }
): Promise<CollegeApiResponse> {
  // If no API key, return sample data
  if (!COLLEGE_SCORECARD_API_KEY) {
    // Only show info in development mode
    if (import.meta.env.DEV) {
      console.info(
        'ℹ️ College Scorecard API key not configured. Using sample data (8 colleges). Get a free API key at https://api.data.gov/signup/ and set VITE_COLLEGE_SCORECARD_API_KEY in .env to access 100+ colleges.'
      );
    }
    return {
      colleges: SAMPLE_COLLEGES,
      total: SAMPLE_COLLEGES.length,
      source: 'sample',
    };
  }

  try {
    // Build query parameters
    // Note: College Scorecard API returns flat keys, not nested objects
    const params = new URLSearchParams({
      api_key: COLLEGE_SCORECARD_API_KEY,
      per_page: limit.toString(),
      fields: [
        'id',
        'school.name',
        'school.city',
        'school.state',
        'school.zip',
        'school.locale',
        'school.school_url',
        'latest.student.size',
        'latest.admissions.admission_rate.overall',
        'latest.cost.tuition.in_state',
        'latest.cost.tuition.out_of_state',
        'latest.cost.avg_net_price.overall',
        'latest.programs.cip_4_digit',
      ].join(','),
      _fields: 'id,school.name,school.city,school.state,school.zip,school.locale,school.school_url,latest.student.size,latest.admissions.admission_rate.overall,latest.cost.tuition.in_state,latest.cost.tuition.out_of_state,latest.cost.avg_net_price.overall',
    });

    // Add filters
    if (filters?.state) {
      params.append('school.state', filters.state);
    }
    if (filters?.city) {
      params.append('school.city', filters.city);
    }
    if (filters?.minSize) {
      params.append('latest.student.size__gte', filters.minSize.toString());
    }
    if (filters?.maxSize) {
      params.append('latest.student.size__lte', filters.maxSize.toString());
    }

    const response = await fetch(`${COLLEGE_SCORECARD_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    const schools: any[] = data.results || [];
    const totalAvailable = data.metadata?.total || schools.length;

    // Convert to our format
    const colleges = schools
      .map(convertScorecardToCollege)
      .filter((college): college is College => college !== null);
    
    // Log conversion stats
    if (import.meta.env.DEV) {
      console.info(
        `📊 College API: Fetched ${schools.length} schools, successfully converted ${colleges.length} colleges. ` +
        `Total available in database: ${totalAvailable.toLocaleString()}+ colleges`
      );
    }

    return {
      colleges,
      total: data.metadata?.total || colleges.length,
      source: 'api',
    };
  } catch (error) {
    console.error('Error fetching colleges from API:', error);
    // Fallback to sample data on error
    return {
      colleges: SAMPLE_COLLEGES,
      total: SAMPLE_COLLEGES.length,
      source: 'sample',
    };
  }
}

// Search colleges by name
export async function searchCollegesByName(
  query: string,
  limit: number = 50
): Promise<CollegeApiResponse> {
  if (!COLLEGE_SCORECARD_API_KEY) {
    // Fallback: filter sample data
    const filtered = SAMPLE_COLLEGES.filter((college) =>
      college.name.toLowerCase().includes(query.toLowerCase())
    );
    return {
      colleges: filtered,
      total: filtered.length,
      source: 'sample',
    };
  }

  try {
    const params = new URLSearchParams({
      api_key: COLLEGE_SCORECARD_API_KEY,
      per_page: limit.toString(),
      'school.name': query,
      fields: [
        'id',
        'school.name',
        'school.city',
        'school.state',
        'school.zip',
        'school.locale',
        'school.school_url',
        'latest.student.size',
        'latest.admissions.admission_rate.overall',
        'latest.cost.tuition.in_state',
        'latest.cost.tuition.out_of_state',
        'latest.cost.avg_net_price.overall',
        'latest.programs.cip_4_digit',
      ].join(','),
    });

    const response = await fetch(`${COLLEGE_SCORECARD_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const schools: CollegeScorecardSchool[] = data.results || [];

    const colleges = schools
      .map(convertScorecardToCollege)
      .filter((college): college is College => college !== null);

    return {
      colleges,
      total: data.metadata?.total || colleges.length,
      source: 'api',
    };
  } catch (error) {
    console.error('Error searching colleges:', error);
    // Fallback to sample data
    const filtered = SAMPLE_COLLEGES.filter((college) =>
      college.name.toLowerCase().includes(query.toLowerCase())
    );
    return {
      colleges: filtered,
      total: filtered.length,
      source: 'sample',
    };
  }
}

// Get a single college by ID
export async function getCollegeById(id: string): Promise<College | null> {
  if (!COLLEGE_SCORECARD_API_KEY) {
    // Fallback: find in sample data
    return SAMPLE_COLLEGES.find((c) => c.id === id) || null;
  }

  try {
    const params = new URLSearchParams({
      api_key: COLLEGE_SCORECARD_API_KEY,
      id,
      fields: [
        'id',
        'school.name',
        'school.city',
        'school.state',
        'school.zip',
        'school.locale',
        'school.school_url',
        'latest.student.size',
        'latest.admissions.admission_rate.overall',
        'latest.cost.tuition.in_state',
        'latest.cost.tuition.out_of_state',
        'latest.cost.avg_net_price.overall',
        'latest.programs.cip_4_digit',
      ].join(','),
    });

    const response = await fetch(`${COLLEGE_SCORECARD_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const schools: CollegeScorecardSchool[] = data.results || [];

    if (schools.length === 0) return null;

    return convertScorecardToCollege(schools[0]);
  } catch (error) {
    console.error('Error fetching college by ID:', error);
    // Fallback to sample data
    return SAMPLE_COLLEGES.find((c) => c.id === id) || null;
  }
}

