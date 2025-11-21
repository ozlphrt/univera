import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollegesStore } from '@/stores/collegesStore';
import { useProfileStore } from '@/stores/profileStore';
import { useTasksStore } from '@/stores/tasksStore';
import { useUIStore } from '@/stores/uiStore';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ReadinessWidget } from '@/components/ReadinessWidget';
import { NextStepCard } from '@/components/NextStepCard';
import {
  calculateReadinessScore,
  calculateCollegeListBalance,
  getNextStep,
  ReadinessFactors,
} from '@/utils/readinessCalculator';
import { matchColleges, filterCollegesByLocation, filterCollegesByMajor, filterCollegesByEnvironment, filterCollegesBySize, SAMPLE_COLLEGES } from '@/utils/matchEngine';
import { fetchCollegesFromAPI } from '@/api/collegeApi';
import { OnboardingAnswer } from '@/modules/onboarding/types';
import './DashboardScreen.css';

export const DashboardScreen = () => {
  const navigate = useNavigate();
  const { colleges, setSelectedCollege, setColleges, toggleSave, savedColleges } = useCollegesStore();
  const { completionPercentage } = useProfileStore();
  const { tasks } = useTasksStore();
  const { isOnboardingComplete } = useUIStore();
  const [readinessScore, setReadinessScore] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<'reach' | 'target' | 'safety'>>(
    new Set(['reach', 'target', 'safety']) // All categories selected by default
  );

  // Regenerate colleges if onboarding is complete but colleges are missing
  useEffect(() => {
    console.log('Dashboard useEffect triggered', { 
      isOnboardingComplete, 
      collegesLength: colleges.length,
      willRun: isOnboardingComplete && colleges.length === 0
    });
    
    // Always try to load colleges if missing, even if onboarding not marked complete
    // (in case user navigated directly or onboarding state was lost)
    if (colleges.length === 0) {
      const regenerateColleges = async () => {
        const answersJson = localStorage.getItem('onboarding_answers');
        console.log('Checking for onboarding answers:', { 
          hasAnswers: !!answersJson,
          onboardingComplete: isOnboardingComplete 
        });
        
        if (answersJson) {
          try {
            setIsRefreshing(true);
            const answers: OnboardingAnswer[] = JSON.parse(answersJson);
            
            // Extract geographic preferences for API filtering
            const geographicAnswer = answers.find((a) => a.questionId === 'geographic-preference');
            const geographicPreferences = geographicAnswer 
              ? (Array.isArray(geographicAnswer.value) ? geographicAnswer.value : [geographicAnswer.value])
              : [];
            
            // Map geographic preferences to state filters for API
            const cityToState: Record<string, string> = {
              'seattle': 'WA',
              'nyc': 'NY',
              'boston': 'MA',
              'los-angeles': 'CA',
              'san-francisco': 'CA',
            };
            const stateFilter = geographicPreferences.find(p => cityToState[p]) 
              ? cityToState[geographicPreferences.find(p => cityToState[p])!]
              : undefined;
            
            console.log('Fetching colleges from API...', { stateFilter, limit: 200 });
            
            // Try to fetch from API, fallback to sample data
            const apiResponse = await fetchCollegesFromAPI(200, {
              state: stateFilter,
            });
            
            console.log('API response:', { 
              source: apiResponse.source, 
              count: apiResponse.colleges.length 
            });
            
            let collegesData = apiResponse.colleges;
            const originalCount = collegesData.length;
            
            // Apply ALL preference filters (geographic, major, environment, size)
            // Geographic filtering
            if (geographicPreferences.length > 0 && !geographicPreferences.includes('no-preference')) {
              const beforeCount = collegesData.length;
              collegesData = filterCollegesByLocation(collegesData, geographicPreferences);
              console.log(`Geographic filter: ${beforeCount} -> ${collegesData.length}`);
            }
            
            // Major filtering
            const majorAnswer = answers.find((a) => a.questionId === 'major-selection');
            if (majorAnswer) {
              const majorPreferences = Array.isArray(majorAnswer.value) 
                ? majorAnswer.value 
                : [majorAnswer.value];
              if (majorPreferences.length > 0) {
                const beforeCount = collegesData.length;
                collegesData = filterCollegesByMajor(collegesData, majorPreferences);
                console.log(`Major filter: ${beforeCount} -> ${collegesData.length}`);
              }
            }
            
            // Campus environment filtering
            const environmentAnswer = answers.find((a) => a.questionId === 'campus-environment');
            if (environmentAnswer) {
              const environmentPreferences = Array.isArray(environmentAnswer.value) 
                ? environmentAnswer.value 
                : [environmentAnswer.value];
              const beforeCount = collegesData.length;
              collegesData = filterCollegesByEnvironment(collegesData, environmentPreferences);
              console.log(`Environment filter: ${beforeCount} -> ${collegesData.length}`);
            }
            
            // School size filtering
            const sizeAnswer = answers.find((a) => a.questionId === 'school-size');
            if (sizeAnswer) {
              const sizePreferences = Array.isArray(sizeAnswer.value) 
                ? sizeAnswer.value 
                : [sizeAnswer.value];
              const beforeCount = collegesData.length;
              collegesData = filterCollegesBySize(collegesData, sizePreferences);
              console.log(`Size filter: ${beforeCount} -> ${collegesData.length}`);
            }
            
            // If filters are too restrictive and we have very few colleges, relax filters
            if (collegesData.length < 5 && originalCount > 0) {
              console.warn(`Filters too restrictive: ${collegesData.length} colleges. Relaxing filters...`);
              // Re-fetch without state filter and apply only major filter
              const relaxedResponse = await fetchCollegesFromAPI(200);
              collegesData = relaxedResponse.colleges;
              
              // Only apply major filter if specified
              if (majorAnswer) {
                const majorPreferences = Array.isArray(majorAnswer.value) 
                  ? majorAnswer.value 
                  : [majorAnswer.value];
                if (majorPreferences.length > 0) {
                  collegesData = filterCollegesByMajor(collegesData, majorPreferences);
                }
              }
              
              console.log(`After relaxing filters: ${collegesData.length} colleges`);
            }
            
            if (collegesData.length === 0) {
              console.error('No colleges found after filtering. Using sample data.');
              // Fallback: use sample data from matchEngine
              collegesData = SAMPLE_COLLEGES;
            }
            
            // Log college IDs before matching
            console.log('Colleges before matching:', collegesData.map(c => ({ id: c.id, name: c.name, type: typeof c.id })));
            console.log('Sample college structure:', collegesData[0] ? {
              id: collegesData[0].id,
              name: collegesData[0].name,
              hasAcceptanceRate: 'acceptanceRate' in collegesData[0],
              hasLocation: 'location' in collegesData[0]
            } : 'no colleges');
            
            // Skip filtering in matchColleges since we've already filtered
            const matchResults = matchColleges(answers, collegesData, true);
            console.log(`Matching ${collegesData.length} colleges, got ${matchResults.length} results`);
            if (matchResults.length > 0) {
              console.log('Match results:', matchResults.map(r => ({ collegeId: r.collegeId, fitScore: r.fitScore, type: typeof r.collegeId })));
            } else {
              console.warn('No match results! Checking why...');
              console.log('College IDs:', collegesData.map(c => c.id));
            }
            
            const collegesWithFit = collegesData.map((college) => {
              const collegeIdStr = String(college.id);
              const match = matchResults.find((r) => {
                const matchIdStr = String(r.collegeId);
                return matchIdStr === collegeIdStr;
              });
              if (!match) {
                console.warn(`No match found for college ${college.id} (${college.name}). Available match IDs:`, matchResults.map(r => r.collegeId));
              } else {
                console.log(`✓ Found match for ${college.name}: fitScore=${match.fitScore}`);
              }
              // Ensure logo is set - use existing logo or generate from name
              let logo = college.logo;
              if (!logo || logo === '') {
                // Generate logo URL from college name using Clearbit
                const domainMap: Record<string, string> = {
                  'University of Illinois Urbana-Champaign': 'illinois.edu',
                  'Amherst College': 'amherst.edu',
                  'Stanford University': 'stanford.edu',
                  'Georgia State University': 'gsu.edu',
                  'Reed College': 'reed.edu',
                  'University of Michigan': 'umich.edu',
                  'Arizona State University': 'asu.edu',
                  'Williams College': 'williams.edu',
                };
                const domain = domainMap[college.name] || '';
                if (domain) {
                  logo = `https://logo.clearbit.com/${domain}`;
                } else {
                  // Try to generate domain from name
                  const domainFromName = college.name.toLowerCase()
                    .replace(/university of /g, '')
                    .replace(/college/g, '')
                    .replace(/university/g, '')
                    .trim()
                    .replace(/\s+/g, '')
                    .replace(/[^a-z0-9]/g, '');
                  logo = domainFromName ? `https://logo.clearbit.com/${domainFromName}.edu` : undefined;
                }
              }
              
              // Generate website URL from logo domain
              let website = '';
              if (logo && logo.includes('logo.clearbit.com')) {
                const domainMatch = logo.match(/logo\.clearbit\.com\/([^/]+)/);
                if (domainMatch) {
                  website = `https://${domainMatch[1]}`;
                }
              }
              
              return {
                id: college.id,
                name: college.name,
                location: `${college.location.city}, ${college.location.state}`,
                type: college.type,
                fitScore: match?.fitScore,
                category: match?.category,
                fitExplanation: match?.explanation,
                logo: logo,
                website: website || undefined,
                breakdown: match?.breakdown,
                fullData: {
                  size: college.size,
                  acceptanceRate: college.acceptanceRate,
                  environment: college.environment,
                  competitiveness: college.academics?.competitiveness,
                  popularMajors: college.academics?.popularMajors,
                  cost: college.cost,
                },
              };
            });
            
            console.log(`Setting ${collegesWithFit.length} colleges in store`);
            setColleges(collegesWithFit);
            localStorage.setItem('colleges_source', apiResponse?.source || 'sample');
          } catch (error) {
            console.error('Error regenerating colleges:', error);
            // Fallback to sample data on error
            try {
              const answers: OnboardingAnswer[] = JSON.parse(answersJson);
              const matchResults = matchColleges(answers, SAMPLE_COLLEGES);
              const collegesWithFit = SAMPLE_COLLEGES.map((college) => {
                const match = matchResults.find((r) => r.collegeId === college.id);
                return {
                  id: college.id,
                  name: college.name,
                  location: `${college.location.city}, ${college.location.state}`,
                  type: college.type,
                  fitScore: match?.fitScore,
                  category: match?.category,
                  fitExplanation: match?.explanation,
                  logo: college.logo,
                  breakdown: match?.breakdown,
                  fullData: {
                    size: college.size,
                    acceptanceRate: college.acceptanceRate,
                    environment: college.environment,
                    competitiveness: college.academics?.competitiveness,
                    popularMajors: college.academics?.popularMajors,
                    cost: college.cost,
                  },
                };
              });
              setColleges(collegesWithFit);
              localStorage.setItem('colleges_source', 'sample-fallback');
              console.log('Using sample data as fallback');
            } catch (fallbackError) {
              console.error('Fallback also failed:', fallbackError);
            }
            } finally {
            setIsRefreshing(false);
          }
        } else {
          console.warn('No onboarding answers found in localStorage. Attempting to use sample data...');
          // Even without onboarding answers, try to show some sample colleges
          try {
            setIsRefreshing(true);
            const matchResults = matchColleges([], SAMPLE_COLLEGES);
            const collegesWithFit = SAMPLE_COLLEGES.map((college) => {
              const match = matchResults.find((r) => r.collegeId === college.id);
              return {
                id: college.id,
                name: college.name,
                location: `${college.location.city}, ${college.location.state}`,
                type: college.type,
                fitScore: match?.fitScore,
                category: match?.category,
                fitExplanation: match?.explanation,
                logo: college.logo,
                breakdown: match?.breakdown,
                fullData: {
                  size: college.size,
                  acceptanceRate: college.acceptanceRate,
                  environment: college.environment,
                  competitiveness: college.academics?.competitiveness,
                  popularMajors: college.academics?.popularMajors,
                  cost: college.cost,
                },
              };
            });
            console.log('Using sample colleges as fallback:', collegesWithFit.length);
            setColleges(collegesWithFit);
            localStorage.setItem('colleges_source', 'sample-no-onboarding');
          } catch (error) {
            console.error('Failed to load sample colleges:', error);
          } finally {
            setIsRefreshing(false);
          }
        }
      };
      
      regenerateColleges();
    } else {
      console.log('Skipping college regeneration:', { 
        reason: colleges.length > 0 ? 'colleges already exist' : 'onboarding not complete',
        collegesCount: colleges.length 
      });
    }
  }, [isOnboardingComplete, colleges.length, setColleges]);

  // Calculate category counts
  const reachCount = colleges.filter((c) => c.category === 'reach').length;
  const targetCount = colleges.filter((c) => c.category === 'target').length;
  const safetyCount = colleges.filter((c) => c.category === 'safety').length;

  // Calculate readiness score
  const [readinessBreakdown, setReadinessBreakdown] = useState<ReadinessFactors | null>(null);
  
  useEffect(() => {
    const collegeBalance = calculateCollegeListBalance(reachCount, targetCount, safetyCount);
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const taskProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    const factors: ReadinessFactors = {
      profileCompletion: completionPercentage,
      collegeListBalance: collegeBalance,
      taskProgress,
      hasMatches: colleges.length > 0,
    };

    const score = calculateReadinessScore(factors);
    setReadinessScore(score);
    setReadinessBreakdown(factors);
  }, [colleges, completionPercentage, tasks, reachCount, targetCount, safetyCount]);

  // Get next step (pass actual tasks array, not just count)
  const nextStep = getNextStep(completionPercentage, colleges.length, tasks);

  // Pull to refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In a real app, this would fetch fresh data
    setIsRefreshing(false);
  };

  // Pull to refresh detection
  useEffect(() => {
    let startY = 0;
    let isPulling = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;
      const currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;

      if (pullDistance > 50 && window.scrollY === 0) {
        handleRefresh();
        isPulling = false;
      }
    };

    const handleTouchEnd = () => {
      isPulling = false;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Toggle category filter
  const toggleCategory = (category: 'reach' | 'target' | 'safety') => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      // Ensure at least one category is always selected
      if (newSet.size === 0) {
        return new Set([category]);
      }
      return newSet;
    });
  };

  // Get top colleges by fit score, filtered by selected categories
  const topColleges = [...colleges]
    .filter((college) => {
      // If all categories are selected, show all
      if (selectedCategories.size === 3) return true;
      // Otherwise filter by selected categories
      return college.category && selectedCategories.has(college.category);
    })
    .sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0))
    .slice(0, 5);

  const getCategoryColor = (category?: string) => {
    switch (category) {
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

  const getCategoryLabel = (category?: string) => {
    switch (category) {
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
    <ScreenContainer className="dashboard-screen" data-page="dashboard">
      <div className={`dashboard-screen__content ${isRefreshing ? 'dashboard-screen__content--refreshing' : ''}`}>
        {isRefreshing && (
          <div className="dashboard-screen__refresh-indicator">Refreshing...</div>
        )}
        <h1 className="dashboard-screen__title">Welcome to Univera</h1>
        <p className="dashboard-screen__subtitle">Here's your starting point</p>

        {/* Readiness Widget */}
        <ReadinessWidget 
          score={readinessScore} 
          breakdown={readinessBreakdown || undefined}
          collegeCounts={{
            reach: reachCount,
            target: targetCount,
            safety: safetyCount,
          }}
          taskCounts={{
            total: tasks.length,
            completed: tasks.filter((t) => t.status === 'done').length,
          }}
        />

        {/* College Summary */}
        {colleges.length > 0 && (
          <Card className="dashboard-screen__summary-card">
            <h2 className="dashboard-screen__card-title">Your College Matches</h2>
            <div className="dashboard-screen__category-filters">
              <button
                className={`dashboard-screen__category-button ${
                  selectedCategories.has('reach') ? 'dashboard-screen__category-button--active' : ''
                }`}
                onClick={() => toggleCategory('reach')}
                style={{
                  '--category-color': getCategoryColor('reach'),
                } as React.CSSProperties}
              >
                <span className="dashboard-screen__category-button-label">Reach</span>
                <span className="dashboard-screen__category-button-count">{reachCount}</span>
              </button>
              <button
                className={`dashboard-screen__category-button ${
                  selectedCategories.has('target') ? 'dashboard-screen__category-button--active' : ''
                }`}
                onClick={() => toggleCategory('target')}
                style={{
                  '--category-color': getCategoryColor('target'),
                } as React.CSSProperties}
              >
                <span className="dashboard-screen__category-button-label">Target</span>
                <span className="dashboard-screen__category-button-count">{targetCount}</span>
              </button>
              <button
                className={`dashboard-screen__category-button ${
                  selectedCategories.has('safety') ? 'dashboard-screen__category-button--active' : ''
                }`}
                onClick={() => toggleCategory('safety')}
                style={{
                  '--category-color': getCategoryColor('safety'),
                } as React.CSSProperties}
              >
                <span className="dashboard-screen__category-button-label">Safety</span>
                <span className="dashboard-screen__category-button-count">{safetyCount}</span>
              </button>
            </div>
          </Card>
        )}

        {/* Top Recommended Colleges */}
        {topColleges.length > 0 && (
          <div className="dashboard-screen__colleges-section">
            <h2 className="dashboard-screen__section-title">Recommended Colleges</h2>
            <div className="dashboard-screen__colleges-list">
              {topColleges.map((college) => (
                <Card
                  key={college.id}
                  className="dashboard-screen__college-card"
                  interactive
                  onClick={() => {
                    setSelectedCollege(college);
                    navigate(`/colleges/${college.id}`);
                  }}
                >
                  <div className="dashboard-screen__college-header">
                    {college.logo && college.logo !== '' ? (
                      <img
                        src={college.logo}
                        alt={college.name}
                        className="dashboard-screen__college-logo"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.dashboard-screen__college-logo-fallback')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'dashboard-screen__college-logo-fallback';
                            const initials = college.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
                            fallback.textContent = initials;
                            parent.insertBefore(fallback, target);
                          }
                        }}
                      />
                    ) : (
                      <div className="dashboard-screen__college-logo-fallback">
                        {college.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="dashboard-screen__college-info">
                      <h3 className="dashboard-screen__college-name">{college.name}</h3>
                      <p className="dashboard-screen__college-location">{college.location}</p>
                    </div>
                    <div className="dashboard-screen__college-header-right">
                      <div
                        className="dashboard-screen__college-badge"
                        style={{ backgroundColor: getCategoryColor(college.category) }}
                      >
                        {getCategoryLabel(college.category)}
                      </div>
                      <div
                        className={`dashboard-screen__save-button ${
                          savedColleges.includes(college.id) ? 'dashboard-screen__save-button--saved' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(college.id);
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={savedColleges.includes(college.id) ? 'Remove from saved' : 'Save to my list'}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleSave(college.id);
                          }
                        }}
                      >
                        {savedColleges.includes(college.id) ? '✓' : '+'}
                      </div>
                    </div>
                  </div>
                  {college.fitScore !== undefined && (
                    <div className="dashboard-screen__college-score">
                      <span className="dashboard-screen__score-label">Fit Score:</span>
                      <span className="dashboard-screen__score-value">{college.fitScore}%</span>
                    </div>
                  )}
                  {college.fitExplanation && (
                    <p className="dashboard-screen__college-explanation">{college.fitExplanation}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State - Only show if onboarding not complete */}
        {colleges.length === 0 && !isOnboardingComplete && (
          <Card className="dashboard-screen__empty-card">
            <h2 className="dashboard-screen__card-title">No colleges found yet</h2>
            <p className="dashboard-screen__empty-text">
              Complete your onboarding to get personalized college recommendations.
            </p>
            <Button variant="primary" onClick={() => navigate('/onboarding')}>
              Start Onboarding
            </Button>
          </Card>
        )}

        {/* Empty State - Onboarding complete but no colleges (shouldn't happen, but handle gracefully) */}
        {colleges.length === 0 && isOnboardingComplete && (
          <Card className="dashboard-screen__empty-card">
            <h2 className="dashboard-screen__card-title">Loading colleges...</h2>
            <p className="dashboard-screen__empty-text">
              Your college matches are being generated. Please refresh the page.
            </p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </Card>
        )}

        {/* Next Step Card - Show if there's a meaningful next step */}
        {nextStep.ctaLabel !== 'View Dashboard' && (
          <NextStepCard
            title={nextStep.title}
            description={nextStep.description}
            ctaLabel={nextStep.ctaLabel}
            onClick={() => {
              // Handle task navigation with task ID
              if (nextStep.taskId) {
                navigate(`/tasks/${nextStep.taskId}`);
              } else {
                // Intercept navigation to use React Router instead of window.location
                const actionStr = nextStep.action.toString();
                if (actionStr.includes('/tasks')) {
                  navigate('/tasks');
                } else if (actionStr.includes('/profile')) {
                  navigate('/profile');
                } else if (actionStr.includes('/colleges')) {
                  navigate('/colleges');
                } else {
                  // Fallback to original action for other cases
                  nextStep.action();
                }
              }
            }}
            priority={nextStep.priority}
          />
        )}
      </div>
    </ScreenContainer>
  );
};

