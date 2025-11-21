import { Card } from './Card';
import './FitScoreBreakdown.css';

interface FitScoreBreakdownProps {
  fitScore: number;
  breakdown?: {
    academicFit?: number;
    preferenceFit?: number;
    ecFit?: number;
    majorFit?: number;
    competitivenessAdjustment?: number;
  };
  college: {
    name: string;
    fullData?: {
      acceptanceRate?: number;
      competitiveness?: string;
      environment?: string;
      size?: number;
      popularMajors?: string[];
    };
  };
  userPreferences?: {
    geographic?: string[];
    major?: string[];
    environment?: string[];
    size?: string[];
    academicStrength?: number;
  };
}

export const FitScoreBreakdown = ({
  fitScore,
  breakdown,
  college,
  userPreferences,
}: FitScoreBreakdownProps) => {
  if (!breakdown) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'var(--color-success)';
    if (score >= 50) return 'var(--color-primary)';
    if (score >= 30) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Excellent';
    if (score >= 50) return 'Good';
    if (score >= 30) return 'Fair';
    return 'Poor';
  };

  // Calculate detailed academic fit explanation
  const getAcademicFitDetails = () => {
    const acceptanceRate = college.fullData?.acceptanceRate;
    const academicStrength = userPreferences?.academicStrength;
    
    if (!acceptanceRate || academicStrength === undefined) {
      return { explanation: 'Academic data not available', factors: [] };
    }

    const factors: string[] = [];
    let explanation = '';

    // Calculate synthetic GPA
    const syntheticGPA = 2.5 + (academicStrength - 1) * (4.0 - 2.5) / 4;
    factors.push(`Your academic strength (${academicStrength}/5) ≈ ${syntheticGPA.toFixed(2)} GPA`);

    // Calculate college difficulty
    const collegeDifficulty = 1 + (1 - acceptanceRate) * 4;
    const difficultyLabel = collegeDifficulty >= 4.5 ? 'Very High' :
                           collegeDifficulty >= 3.5 ? 'High' :
                           collegeDifficulty >= 2.5 ? 'Moderate' :
                           collegeDifficulty >= 1.5 ? 'Low' : 'Very Low';
    factors.push(`College difficulty: ${difficultyLabel} (${collegeDifficulty.toFixed(1)}/5)`);

    // Acceptance rate analysis
    const acceptancePercent = Math.round(acceptanceRate * 100);
    if (acceptanceRate >= 0.7) {
      factors.push(`Acceptance rate: ${acceptancePercent}% (Very accessible)`);
      explanation = 'This is a safety school with high acceptance rate, making it a strong match for your academic profile.';
    } else if (acceptanceRate >= 0.5) {
      factors.push(`Acceptance rate: ${acceptancePercent}% (Moderate)`);
      explanation = 'This is a target school with moderate competitiveness that aligns well with your academic strength.';
    } else if (acceptanceRate >= 0.3) {
      factors.push(`Acceptance rate: ${acceptancePercent}% (Competitive)`);
      explanation = 'This is a competitive school that may be a reach depending on your full academic profile.';
    } else if (acceptanceRate >= 0.15) {
      factors.push(`Acceptance rate: ${acceptancePercent}% (Very competitive)`);
      explanation = 'This is a highly competitive reach school that will be challenging to get into.';
    } else {
      factors.push(`Acceptance rate: ${acceptancePercent}% (Extremely selective)`);
      explanation = 'This is an extremely selective reach school - admission is highly competitive.';
    }

    // Difficulty match analysis
    const difficultyDiff = collegeDifficulty - academicStrength;
    if (Math.abs(difficultyDiff) <= 0.3) {
      factors.push(`✓ Excellent match: College difficulty closely matches your academic strength`);
    } else if (Math.abs(difficultyDiff) <= 0.7) {
      factors.push(`✓ Good match: College difficulty is close to your academic strength`);
    } else if (difficultyDiff > 1.0) {
      factors.push(`⚠ Challenge: College is significantly more difficult than your academic profile`);
    } else if (difficultyDiff > 0.7) {
      factors.push(`⚠ Moderate challenge: College is somewhat more difficult`);
    } else if (difficultyDiff < -1.0) {
      factors.push(`✓ Safety: College is easier than your academic profile (good safety option)`);
    }

    return { explanation, factors };
  };

  // Calculate detailed preference fit breakdown
  const getPreferenceFitDetails = () => {
    const factors: string[] = [];
    let locationScore = 0;
    let environmentScore = 0;
    let sizeScore = 0;

    // Location breakdown
    if (userPreferences?.geographic && userPreferences.geographic.length > 0) {
      const preferences = userPreferences.geographic;
      const collegeLocation = college.name.toLowerCase();
      
      // Check for exact city matches
      const cityMappings: Record<string, string[]> = {
        'seattle': ['seattle', 'washington'],
        'nyc': ['new york', 'nyc'],
        'boston': ['boston'],
        'los-angeles': ['los angeles', 'la'],
        'san-francisco': ['san francisco', 'sf'],
      };
      
      let hasCityMatch = false;
      for (const [pref, cities] of Object.entries(cityMappings)) {
        if (preferences.includes(pref)) {
          if (cities.some(city => collegeLocation.includes(city))) {
            factors.push(`✓ Exact city match: ${pref.replace('-', ' ').toUpperCase()}`);
            locationScore = 40;
            hasCityMatch = true;
            break;
          }
        }
      }
      
      if (!hasCityMatch) {
        factors.push(`Location: Region match (not exact city)`);
        locationScore = 25;
      }
    } else {
      factors.push(`Location: No specific preference`);
      locationScore = 30;
    }

    // Environment breakdown
    if (userPreferences?.environment && userPreferences.environment.length > 0) {
      const collegeEnv = college.fullData?.environment;
      if (collegeEnv && userPreferences.environment.includes(collegeEnv)) {
        factors.push(`✓ Campus environment: ${collegeEnv.charAt(0).toUpperCase() + collegeEnv.slice(1)} matches your preference`);
        environmentScore = 25;
      } else if (collegeEnv) {
        factors.push(`Campus environment: ${collegeEnv.charAt(0).toUpperCase() + collegeEnv.slice(1)} (may not match)`);
        environmentScore = 10;
      }
    } else {
      factors.push(`Campus environment: No specific preference`);
      environmentScore = 20;
    }

    // Size breakdown
    if (userPreferences?.size && userPreferences.size.length > 0) {
      const collegeSize = college.fullData?.size || 0;
      const sizeMap: Record<string, { min: number; max: number; label: string }> = {
        small: { min: 0, max: 5000, label: 'Small (<5K)' },
        medium: { min: 5000, max: 15000, label: 'Medium (5-15K)' },
        large: { min: 15000, max: Infinity, label: 'Large (15K+)' },
      };
      
      let matchedSize = false;
      for (const sizePref of userPreferences.size) {
        const range = sizeMap[sizePref];
        if (range && collegeSize >= range.min && collegeSize < range.max) {
          factors.push(`✓ School size: ${(collegeSize / 1000).toFixed(0)}K students matches your ${range.label} preference`);
          sizeScore = 25;
          matchedSize = true;
          break;
        }
      }
      
      if (!matchedSize && collegeSize > 0) {
        const sizeCategory = collegeSize < 5000 ? 'small' : collegeSize < 15000 ? 'medium' : 'large';
        factors.push(`School size: ${(collegeSize / 1000).toFixed(0)}K students (${sizeCategory}) may not match your preference`);
        sizeScore = 10;
      }
    } else {
      factors.push(`School size: No specific preference`);
      sizeScore = 20;
    }

    const totalScore = locationScore + environmentScore + sizeScore;
    return { factors, totalScore, locationScore, environmentScore, sizeScore };
  };

  // Calculate major fit details
  const getMajorFitDetails = () => {
    const factors: string[] = [];
    
    if (!userPreferences?.major || userPreferences.major.length === 0) {
      return { factors: ['No major preference specified'], score: 0 };
    }

    const collegeMajors = college.fullData?.popularMajors || [];
    const userMajors = userPreferences.major;
    
    const majorKeywords: Record<string, string[]> = {
      'medicine': ['medicine', 'medical', 'health', 'biology', 'biochemistry', 'neuroscience', 'pharmacy', 'nursing'],
      'engineering': ['engineering', 'engineer', 'mechanical', 'electrical', 'civil', 'chemical', 'aerospace', 'biomedical'],
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
    };

    let matchedMajors: string[] = [];
    for (const userMajor of userMajors) {
      const keywords = majorKeywords[userMajor] || [userMajor];
      const matchingCollegeMajors = collegeMajors.filter(cm => 
        keywords.some(kw => cm.toLowerCase().includes(kw.toLowerCase()))
      );
      
      if (matchingCollegeMajors.length > 0) {
        matchedMajors.push(...matchingCollegeMajors);
        factors.push(`✓ Offers ${userMajor.replace('-', ' ')}: ${matchingCollegeMajors.join(', ')}`);
      } else {
        factors.push(`⚠ May not offer ${userMajor.replace('-', ' ')} (not in popular majors)`);
      }
    }

    if (matchedMajors.length === 0 && collegeMajors.length > 0) {
      factors.push(`Available majors: ${collegeMajors.slice(0, 5).join(', ')}`);
    }

    const competitiveness = college.fullData?.competitiveness;
    if (competitiveness === 'high' && userMajors.includes('medicine')) {
      factors.push(`High competitiveness + Medicine = Strong program match`);
    }

    return { factors, score: breakdown?.majorFit || 0 };
  };

  // Calculate EC fit details
  const getECFitDetails = () => {
    const academicStrength = userPreferences?.academicStrength;
    if (academicStrength === undefined) {
      return { factors: ['EC strength not available'], score: 0 };
    }

    const ecFit = breakdown?.ecFit || 0;
    const ecStrength = Math.round((ecFit - 20) / 20) + 1; // Reverse calculate from score
    
    const factors: string[] = [];
    factors.push(`Your extracurricular strength: ${ecStrength}/5`);
    
    const strengthLabel = ecStrength >= 4 ? 'Very Strong' :
                         ecStrength >= 3 ? 'Strong' :
                         ecStrength >= 2 ? 'Moderate' : 'Building';
    factors.push(`EC Profile: ${strengthLabel}`);
    factors.push(`This score is constant across all colleges and reflects your overall EC strength`);

    return { factors, score: ecFit };
  };

  // Calculate what's matching and what's missing
  const getMatchDetails = () => {
    const matches: string[] = [];
    const missing: string[] = [];

    // Geographic match
    if (userPreferences?.geographic && userPreferences.geographic.length > 0) {
      const collegeLocation = college.name.toLowerCase();
      const hasCityMatch = userPreferences.geographic.some(pref => {
        const cityMap: Record<string, string[]> = {
          'seattle': ['seattle', 'washington'],
          'nyc': ['new york', 'nyc'],
          'boston': ['boston'],
          'los-angeles': ['los angeles', 'la'],
          'san-francisco': ['san francisco', 'sf'],
        };
        const cities = cityMap[pref] || [pref];
        return cities.some(city => collegeLocation.includes(city));
      });
      if (hasCityMatch) {
        matches.push('Location matches your preferences');
      } else {
        missing.push('Location may not match your preferred cities');
      }
    }

    // Major match
    if (userPreferences?.major && userPreferences.major.length > 0) {
      const collegeMajors = college.fullData?.popularMajors || [];
      const hasMajorMatch = userPreferences.major.some(major => {
        const majorKeywords: Record<string, string[]> = {
          'medicine': ['medicine', 'medical', 'health', 'biology'],
          'engineering': ['engineering', 'engineer'],
          'business': ['business', 'management', 'finance'],
          'computer-science': ['computer', 'computing', 'software'],
        };
        const keywords = majorKeywords[major] || [major];
        return collegeMajors.some(cm => 
          keywords.some(kw => cm.toLowerCase().includes(kw))
        );
      });
      if (hasMajorMatch) {
        matches.push('Offers your preferred major(s)');
      } else {
        missing.push('May not offer your preferred major(s)');
      }
    }

    // Environment match
    if (userPreferences?.environment && userPreferences.environment.length > 0) {
      const collegeEnv = college.fullData?.environment;
      if (collegeEnv && userPreferences.environment.includes(collegeEnv)) {
        matches.push(`Campus environment (${collegeEnv}) matches your preference`);
      } else if (collegeEnv) {
        missing.push(`Campus environment (${collegeEnv}) may not match your preference`);
      }
    }

    // Size match
    if (userPreferences?.size && userPreferences.size.length > 0) {
      const collegeSize = college.fullData?.size || 0;
      const sizeMap: Record<string, { min: number; max: number }> = {
        small: { min: 0, max: 5000 },
        medium: { min: 5000, max: 15000 },
        large: { min: 15000, max: Infinity },
      };
      const matchesSize = userPreferences.size.some(sizePref => {
        const range = sizeMap[sizePref];
        return range && collegeSize >= range.min && collegeSize < range.max;
      });
      if (matchesSize) {
        matches.push(`School size (${(collegeSize / 1000).toFixed(0)}K students) matches your preference`);
      } else {
        missing.push(`School size (${(collegeSize / 1000).toFixed(0)}K students) may not match your preference`);
      }
    }

    // Academic match
    if (userPreferences?.academicStrength && college.fullData?.acceptanceRate !== undefined) {
      const acceptanceRate = college.fullData.acceptanceRate;
      if (acceptanceRate >= 0.5 && userPreferences.academicStrength >= 3) {
        matches.push('Acceptance rate aligns with your academic profile');
      } else if (acceptanceRate < 0.3 && userPreferences.academicStrength < 3) {
        missing.push('Highly competitive - may be challenging for your academic profile');
      }
    }

    return { matches, missing };
  };

  const { matches, missing } = getMatchDetails();

  return (
    <Card className="fit-score-breakdown">
      <h2 className="fit-score-breakdown__title">Fit Score Breakdown</h2>
      
      <div className="fit-score-breakdown__overall">
        <div className="fit-score-breakdown__overall-score">
          <span className="fit-score-breakdown__overall-label">Overall Fit Score</span>
          <span 
            className="fit-score-breakdown__overall-value"
            style={{ color: getScoreColor(fitScore) }}
          >
            {fitScore}%
          </span>
        </div>
        <div className="fit-score-breakdown__overall-label-text">
          {getScoreLabel(fitScore)} Match
        </div>
      </div>

      <div className="fit-score-breakdown__components">
        {/* Academic Fit - Detailed */}
        <div className="fit-score-breakdown__component fit-score-breakdown__component--detailed">
          <div className="fit-score-breakdown__component-header">
            <div className="fit-score-breakdown__component-title-section">
              <span className="fit-score-breakdown__component-name">Academic Fit</span>
              <span className="fit-score-breakdown__component-weight">60% of total score</span>
            </div>
            <span 
              className="fit-score-breakdown__component-score"
              style={{ color: getScoreColor(breakdown.academicFit || 0) }}
            >
              {breakdown.academicFit || 0}%
            </span>
          </div>
          <div className="fit-score-breakdown__component-bar">
            <div 
              className="fit-score-breakdown__component-fill"
              style={{ 
                width: `${breakdown.academicFit || 0}%`,
                backgroundColor: getScoreColor(breakdown.academicFit || 0)
              }}
            />
          </div>
          {(() => {
            const academicDetails = getAcademicFitDetails();
            return (
              <div className="fit-score-breakdown__component-details">
                <div className="fit-score-breakdown__component-explanation">
                  {academicDetails.explanation}
                </div>
                <div className="fit-score-breakdown__component-factors">
                  {academicDetails.factors.map((factor, idx) => (
                    <div key={idx} className="fit-score-breakdown__factor-item">
                      {factor}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Preference Fit - Detailed */}
        <div className="fit-score-breakdown__component fit-score-breakdown__component--detailed">
          <div className="fit-score-breakdown__component-header">
            <div className="fit-score-breakdown__component-title-section">
              <span className="fit-score-breakdown__component-name">Preference Fit</span>
              <span className="fit-score-breakdown__component-weight">25% of total score</span>
            </div>
            <span 
              className="fit-score-breakdown__component-score"
              style={{ color: getScoreColor(breakdown.preferenceFit || 0) }}
            >
              {breakdown.preferenceFit || 0}%
            </span>
          </div>
          <div className="fit-score-breakdown__component-bar">
            <div 
              className="fit-score-breakdown__component-fill"
              style={{ 
                width: `${breakdown.preferenceFit || 0}%`,
                backgroundColor: getScoreColor(breakdown.preferenceFit || 0)
              }}
            />
          </div>
          {(() => {
            const preferenceDetails = getPreferenceFitDetails();
            return (
              <div className="fit-score-breakdown__component-details">
                <div className="fit-score-breakdown__component-sub-scores">
                  <div className="fit-score-breakdown__sub-score">
                    <span>Location:</span>
                    <span style={{ color: getScoreColor(preferenceDetails.locationScore) }}>
                      {preferenceDetails.locationScore} pts
                    </span>
                  </div>
                  <div className="fit-score-breakdown__sub-score">
                    <span>Environment:</span>
                    <span style={{ color: getScoreColor(preferenceDetails.environmentScore) }}>
                      {preferenceDetails.environmentScore} pts
                    </span>
                  </div>
                  <div className="fit-score-breakdown__sub-score">
                    <span>Size:</span>
                    <span style={{ color: getScoreColor(preferenceDetails.sizeScore) }}>
                      {preferenceDetails.sizeScore} pts
                    </span>
                  </div>
                </div>
                <div className="fit-score-breakdown__component-factors">
                  {preferenceDetails.factors.map((factor, idx) => (
                    <div key={idx} className="fit-score-breakdown__factor-item">
                      {factor}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Major Fit - Detailed */}
        <div className="fit-score-breakdown__component fit-score-breakdown__component--detailed">
          <div className="fit-score-breakdown__component-header">
            <div className="fit-score-breakdown__component-title-section">
              <span className="fit-score-breakdown__component-name">Major Fit</span>
              <span className="fit-score-breakdown__component-weight">5% of total score</span>
            </div>
            <span 
              className="fit-score-breakdown__component-score"
              style={{ color: getScoreColor((breakdown.majorFit || 0) * 5) }}
            >
              {breakdown.majorFit || 0}/20
            </span>
          </div>
          <div className="fit-score-breakdown__component-bar">
            <div 
              className="fit-score-breakdown__component-fill"
              style={{ 
                width: `${((breakdown.majorFit || 0) / 20) * 100}%`,
                backgroundColor: getScoreColor((breakdown.majorFit || 0) * 5)
              }}
            />
          </div>
          {(() => {
            const majorDetails = getMajorFitDetails();
            return (
              <div className="fit-score-breakdown__component-details">
                {college.fullData?.popularMajors && college.fullData.popularMajors.length > 0 && (
                  <div className="fit-score-breakdown__component-explanation">
                    Popular majors: {college.fullData.popularMajors.slice(0, 5).join(', ')}
                    {college.fullData.popularMajors.length > 5 && '...'}
                  </div>
                )}
                <div className="fit-score-breakdown__component-factors">
                  {majorDetails.factors.map((factor, idx) => (
                    <div key={idx} className="fit-score-breakdown__factor-item">
                      {factor}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Extracurricular Fit - Detailed */}
        <div className="fit-score-breakdown__component fit-score-breakdown__component--detailed">
          <div className="fit-score-breakdown__component-header">
            <div className="fit-score-breakdown__component-title-section">
              <span className="fit-score-breakdown__component-name">Extracurricular Fit</span>
              <span className="fit-score-breakdown__component-weight">8% of total score</span>
            </div>
            <span 
              className="fit-score-breakdown__component-score"
              style={{ color: getScoreColor(breakdown.ecFit || 0) }}
            >
              {breakdown.ecFit || 0}%
            </span>
          </div>
          <div className="fit-score-breakdown__component-bar">
            <div 
              className="fit-score-breakdown__component-fill"
              style={{ 
                width: `${breakdown.ecFit || 0}%`,
                backgroundColor: getScoreColor(breakdown.ecFit || 0)
              }}
            />
          </div>
          {(() => {
            const ecDetails = getECFitDetails();
            return (
              <div className="fit-score-breakdown__component-details">
                <div className="fit-score-breakdown__component-factors">
                  {ecDetails.factors.map((factor, idx) => (
                    <div key={idx} className="fit-score-breakdown__factor-item">
                      {factor}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Score Calculation Summary */}
        <div className="fit-score-breakdown__calculation-summary">
          <h3 className="fit-score-breakdown__calculation-title">How Your Score is Calculated</h3>
          <div className="fit-score-breakdown__calculation-formula">
            <div className="fit-score-breakdown__formula-item">
              <span>Academic Fit ({breakdown.academicFit || 0}%)</span>
              <span>× 60%</span>
              <span>= {Math.round((breakdown.academicFit || 0) * 0.60)} pts</span>
            </div>
            <div className="fit-score-breakdown__formula-item">
              <span>Preference Fit ({breakdown.preferenceFit || 0}%)</span>
              <span>× 25%</span>
              <span>= {Math.round((breakdown.preferenceFit || 0) * 0.25)} pts</span>
            </div>
            <div className="fit-score-breakdown__formula-item">
              <span>EC Fit ({breakdown.ecFit || 0}%)</span>
              <span>× 8%</span>
              <span>= {Math.round((breakdown.ecFit || 0) * 0.08)} pts</span>
            </div>
            <div className="fit-score-breakdown__formula-item">
              <span>Major Fit ({breakdown.majorFit || 0}/20)</span>
              <span>× 5%</span>
              <span>= {Math.round((breakdown.majorFit || 0) * 0.05)} pts</span>
            </div>
            {breakdown.competitivenessAdjustment !== undefined && breakdown.competitivenessAdjustment !== 0 && (
              <div className="fit-score-breakdown__formula-item">
                <span>Competitiveness Adjustment</span>
                <span></span>
                <span>{breakdown.competitivenessAdjustment > 0 ? '+' : ''}{breakdown.competitivenessAdjustment} pts</span>
              </div>
            )}
            <div className="fit-score-breakdown__formula-total">
              <span>Total Fit Score</span>
              <span>= {fitScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* What's Matching */}
      {matches.length > 0 && (
        <div className="fit-score-breakdown__section">
          <h3 className="fit-score-breakdown__section-title">
            <span className="fit-score-breakdown__check-icon">✓</span>
            What's Fitting
          </h3>
          <ul className="fit-score-breakdown__list fit-score-breakdown__list--matches">
            {matches.map((match, index) => (
              <li key={index}>{match}</li>
            ))}
          </ul>
        </div>
      )}

      {/* What's Missing */}
      {missing.length > 0 && (
        <div className="fit-score-breakdown__section">
          <h3 className="fit-score-breakdown__section-title">
            <span className="fit-score-breakdown__warning-icon">⚠</span>
            Considerations
          </h3>
          <ul className="fit-score-breakdown__list fit-score-breakdown__list--missing">
            {missing.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

