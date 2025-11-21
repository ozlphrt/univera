import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { FitExplanationBlock } from '@/components/FitExplanationBlock';
import { FitScoreBreakdown } from '@/components/FitScoreBreakdown';
import { useCollegesStore } from '@/stores/collegesStore';
import { SAMPLE_COLLEGES } from '@/utils/matchEngine';
import { OnboardingAnswer } from '@/modules/onboarding/types';
import './CollegeDetailScreen.css';

export const CollegeDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { colleges, selectedCollege, setSelectedCollege, savedColleges, toggleSave } =
    useCollegesStore();

  // Find college by ID
  const college = selectedCollege || colleges.find((c) => c.id === id);

  useEffect(() => {
    if (!college && id) {
      // Try to find in sample colleges if not in store
      const sampleCollege = SAMPLE_COLLEGES.find((c) => c.id === id);
      if (sampleCollege) {
        const collegeWithFit = colleges.find((c) => c.id === id) || {
          id: sampleCollege.id,
          name: sampleCollege.name,
          location: `${sampleCollege.location.city}, ${sampleCollege.location.state}`,
          type: sampleCollege.type,
        };
        setSelectedCollege(collegeWithFit);
      }
    }
  }, [id, college, colleges, setSelectedCollege]);

  if (!college) {
    return (
      <ScreenContainer data-page="college-detail-error">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>College not found</p>
          <Button variant="primary" onClick={() => navigate('/colleges')}>
            Back to Colleges
          </Button>
        </div>
      </ScreenContainer>
    );
  }

  const isSaved = savedColleges.includes(college.id);
  const sampleCollege = SAMPLE_COLLEGES.find((c) => c.id === college.id);

  // Get user preferences from localStorage for breakdown
  const userPreferences = useMemo(() => {
    try {
      const answersJson = localStorage.getItem('onboarding_answers');
      if (!answersJson) return undefined;
      
      const answers: OnboardingAnswer[] = JSON.parse(answersJson);
      const geographicAnswer = answers.find((a) => a.questionId === 'geographic-preference');
      const majorAnswer = answers.find((a) => a.questionId === 'major-selection');
      const environmentAnswer = answers.find((a) => a.questionId === 'campus-environment');
      const sizeAnswer = answers.find((a) => a.questionId === 'school-size');
      const academicAnswer = answers.find((a) => a.questionId === 'academic-confidence');
      
      return {
        geographic: geographicAnswer 
          ? (Array.isArray(geographicAnswer.value) ? geographicAnswer.value : [geographicAnswer.value])
          : undefined,
        major: majorAnswer
          ? (Array.isArray(majorAnswer.value) ? majorAnswer.value : [majorAnswer.value])
          : undefined,
        environment: environmentAnswer
          ? (Array.isArray(environmentAnswer.value) ? environmentAnswer.value : [environmentAnswer.value])
          : undefined,
        size: sizeAnswer
          ? (Array.isArray(sizeAnswer.value) ? sizeAnswer.value : [sizeAnswer.value])
          : undefined,
        academicStrength: academicAnswer?.value as number | undefined,
      };
    } catch (e) {
      return undefined;
    }
  }, []);

  const getCategoryColor = () => {
    switch (college.category) {
      case 'reach':
        return 'var(--color-accent)';
      case 'target':
        return 'var(--color-primary)';
      case 'safety':
        return 'var(--color-success)';
      default:
        return 'var(--color-text-tertiary)';
    }
  };

  const getCategoryLabel = () => {
    switch (college.category) {
      case 'reach':
        return 'Reach';
      case 'target':
        return 'Target';
      case 'safety':
        return 'Safety';
      default:
        return 'Unknown';
    }
  };

  return (
    <ScreenContainer className="college-detail-screen" data-page="college-detail">
      <div className="college-detail-screen__content">
        <div className="college-detail-screen__header">
          <Button
            variant="ghost"
            onClick={() => navigate('/colleges')}
            className="college-detail-screen__back-button"
          >
            ← Back
          </Button>
        </div>

        {/* College Header */}
        <Card className="college-detail-screen__header-card">
          <div className="college-detail-screen__header-content">
            {college.logo ? (
              <img
                src={college.logo}
                alt={college.name}
                className="college-detail-screen__logo"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.college-detail-screen__logo-fallback')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'college-detail-screen__logo-fallback';
                    const initials = college.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
                    fallback.textContent = initials;
                    parent.insertBefore(fallback, target);
                  }
                }}
              />
            ) : (
              <div className="college-detail-screen__logo-fallback">
                {college.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="college-detail-screen__title-section">
              <h1 className="college-detail-screen__name">{college.name}</h1>
              <p className="college-detail-screen__location">{college.location}</p>
            </div>
            {college.category && (
              <div
                className="college-detail-screen__category-badge"
                style={{ backgroundColor: getCategoryColor() }}
              >
                {getCategoryLabel()}
              </div>
            )}
          </div>
          {college.fitScore !== undefined && (
            <div className="college-detail-screen__fit-score">
              <span className="college-detail-screen__fit-label">Fit Score</span>
              <span className="college-detail-screen__fit-value">{college.fitScore}%</span>
            </div>
          )}
        </Card>

        {/* Why This Fits You */}
        {college.fitExplanation && (
          <FitExplanationBlock explanation={college.fitExplanation} />
        )}

        {/* Fit Score Breakdown */}
        {college.fitScore !== undefined && (
          <FitScoreBreakdown
            fitScore={college.fitScore}
            breakdown={college.breakdown}
            college={{
              name: college.name,
              fullData: college.fullData,
            }}
            userPreferences={userPreferences}
          />
        )}

        {/* College Stats */}
        {(sampleCollege || college.fullData) && (
          <Card className="college-detail-screen__stats-card">
            <h2 className="college-detail-screen__section-title">College Information</h2>
            <div className="college-detail-screen__stats">
              <div className="college-detail-screen__stat">
                <span className="college-detail-screen__stat-label">Type</span>
                <span className="college-detail-screen__stat-value">
                  {(sampleCollege?.type || college.type)?.charAt(0).toUpperCase() + (sampleCollege?.type || college.type)?.slice(1)}
                </span>
              </div>
              {(sampleCollege?.size || college.fullData?.size) && (
                <div className="college-detail-screen__stat">
                  <span className="college-detail-screen__stat-label">Student Body Size</span>
                  <span className="college-detail-screen__stat-value">
                    {(sampleCollege?.size || college.fullData?.size || 0).toLocaleString()} students
                  </span>
                </div>
              )}
              {(sampleCollege?.acceptanceRate || college.fullData?.acceptanceRate) !== undefined && (
                <div className="college-detail-screen__stat">
                  <span className="college-detail-screen__stat-label">Acceptance Rate</span>
                  <span className="college-detail-screen__stat-value">
                    {Math.round((sampleCollege?.acceptanceRate || college.fullData?.acceptanceRate || 0) * 100)}%
                  </span>
                </div>
              )}
              {(sampleCollege?.environment || college.fullData?.environment) && (
                <div className="college-detail-screen__stat">
                  <span className="college-detail-screen__stat-label">Campus Environment</span>
                  <span className="college-detail-screen__stat-value">
                    {(sampleCollege?.environment || college.fullData?.environment)?.charAt(0).toUpperCase() + (sampleCollege?.environment || college.fullData?.environment)?.slice(1)}
                  </span>
                </div>
              )}
              {(sampleCollege?.academics?.competitiveness || college.fullData?.competitiveness) && (
                <div className="college-detail-screen__stat">
                  <span className="college-detail-screen__stat-label">Competitiveness</span>
                  <span className="college-detail-screen__stat-value">
                    {(sampleCollege?.academics?.competitiveness || college.fullData?.competitiveness)?.charAt(0).toUpperCase() + (sampleCollege?.academics?.competitiveness || college.fullData?.competitiveness)?.slice(1)}
                  </span>
                </div>
              )}
              {(sampleCollege?.cost?.tuitionInState || college.fullData?.cost?.tuitionInState) && (
                <div className="college-detail-screen__stat">
                  <span className="college-detail-screen__stat-label">In-State Tuition</span>
                  <span className="college-detail-screen__stat-value">
                    ${(sampleCollege?.cost?.tuitionInState || college.fullData?.cost?.tuitionInState || 0).toLocaleString()}/year
                  </span>
                </div>
              )}
              {(sampleCollege?.cost?.tuitionOutOfState || college.fullData?.cost?.tuitionOutOfState) && (
                <div className="college-detail-screen__stat">
                  <span className="college-detail-screen__stat-label">Out-of-State Tuition</span>
                  <span className="college-detail-screen__stat-value">
                    ${(sampleCollege?.cost?.tuitionOutOfState || college.fullData?.cost?.tuitionOutOfState || 0).toLocaleString()}/year
                  </span>
                </div>
              )}
              {(sampleCollege?.cost?.averageNetPrice || college.fullData?.cost?.averageNetPrice) && (
                <div className="college-detail-screen__stat">
                  <span className="college-detail-screen__stat-label">Average Net Price</span>
                  <span className="college-detail-screen__stat-value">
                    ${(sampleCollege?.cost?.averageNetPrice || college.fullData?.cost?.averageNetPrice || 0).toLocaleString()}/year
                  </span>
                </div>
              )}
              {college.website && (
                <div className="college-detail-screen__stat">
                  <span className="college-detail-screen__stat-label">Website</span>
                  <a 
                    href={college.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="college-detail-screen__website-link"
                  >
                    Visit College Website →
                  </a>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Majors */}
        {((sampleCollege?.academics.popularMajors && sampleCollege.academics.popularMajors.length > 0) ||
          (college.fullData?.popularMajors && college.fullData.popularMajors.length > 0)) && (
          <Card className="college-detail-screen__majors-card">
            <h2 className="college-detail-screen__section-title">Popular Majors & Programs</h2>
            <div className="college-detail-screen__majors">
              {(sampleCollege?.academics.popularMajors || college.fullData?.popularMajors || []).map((major, index) => (
                <span key={index} className="college-detail-screen__major-tag">
                  {major}
                </span>
              ))}
            </div>
            {(!sampleCollege?.academics.popularMajors || sampleCollege.academics.popularMajors.length === 0) && 
             (!college.fullData?.popularMajors || college.fullData.popularMajors.length === 0) && (
              <p className="college-detail-screen__majors-note">
                Major information not available. Check the college website for program details.
              </p>
            )}
          </Card>
        )}

        {/* Save/Unsave Button */}
        <div className="college-detail-screen__actions">
          <Button
            variant={isSaved ? 'secondary' : 'primary'}
            size="lg"
            fullWidth
            onClick={() => toggleSave(college.id)}
          >
            {isSaved ? '✓ Saved to My List' : 'Save to My List'}
          </Button>
        </div>
      </div>
    </ScreenContainer>
  );
};

