import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { matchColleges, filterCollegesByLocation, filterCollegesByMajor, filterCollegesByEnvironment, filterCollegesBySize } from '@/utils/matchEngine';
import { fetchCollegesFromAPI } from '@/api/collegeApi';
import { useCollegesStore } from '@/stores/collegesStore';
import { OnboardingAnswer } from './types';
import './ProcessingScreen.css';

// Helper function to extract state code from geographic preferences
function extractStateFromPreferences(preferences: string[]): string | undefined {
  // Map city preferences to states
  const cityToState: Record<string, string> = {
    'seattle': 'WA',
    'nyc': 'NY',
    'boston': 'MA',
    'los-angeles': 'CA',
    'san-francisco': 'CA',
  };
  
  // Check for city preferences first
  for (const pref of preferences) {
    if (cityToState[pref]) {
      return cityToState[pref];
    }
  }
  
  // Check for region preferences that map to single states
  // (Most regions span multiple states, so we return undefined to fetch all and filter later)
  return undefined;
}

export const ProcessingScreen = () => {
  const navigate = useNavigate();
  const { setColleges } = useCollegesStore();
  const [status, setStatus] = useState('Loading colleges...');

  useEffect(() => {
    const processMatches = async () => {
      // Get onboarding answers from localStorage
      const answersJson = localStorage.getItem('onboarding_answers');
      if (!answersJson) {
        // No answers found, skip to dashboard
        navigate('/dashboard');
        return;
      }

      const answers: OnboardingAnswer[] = JSON.parse(answersJson);

      // Extract geographic preferences for API filtering
      const geographicAnswer = answers.find((a) => a.questionId === 'geographic-preference');
      const geographicPreferences = geographicAnswer 
        ? (Array.isArray(geographicAnswer.value) ? geographicAnswer.value : [geographicAnswer.value])
        : [];
      
      // Map geographic preferences to state filters for API
      // (API supports state filtering, but we'll do city filtering after fetch)
      const stateFilter = extractStateFromPreferences(geographicPreferences);
      
      // Try to fetch colleges from API, fallback to sample data
      setStatus('Fetching college data...');
      const apiResponse = await fetchCollegesFromAPI(200, {
        state: stateFilter, // Filter by state if we have a specific state preference
      });
      let colleges = apiResponse.colleges;
      
      // Apply ALL preference filters (geographic, major, environment, size)
      // Geographic filtering
      if (geographicPreferences.length > 0 && !geographicPreferences.includes('no-preference')) {
        colleges = filterCollegesByLocation(colleges, geographicPreferences);
      }
      
      // Major filtering
      const majorAnswer = answers.find((a) => a.questionId === 'major-selection');
      if (majorAnswer) {
        const majorPreferences = Array.isArray(majorAnswer.value) 
          ? majorAnswer.value 
          : [majorAnswer.value];
        if (majorPreferences.length > 0) {
          colleges = filterCollegesByMajor(colleges, majorPreferences);
        }
      }
      
      // Campus environment filtering
      const environmentAnswer = answers.find((a) => a.questionId === 'campus-environment');
      if (environmentAnswer) {
        const environmentPreferences = Array.isArray(environmentAnswer.value) 
          ? environmentAnswer.value 
          : [environmentAnswer.value];
        colleges = filterCollegesByEnvironment(colleges, environmentPreferences);
      }
      
      // School size filtering
      const sizeAnswer = answers.find((a) => a.questionId === 'school-size');
      if (sizeAnswer) {
        const sizePreferences = Array.isArray(sizeAnswer.value) 
          ? sizeAnswer.value 
          : [sizeAnswer.value];
        colleges = filterCollegesBySize(colleges, sizePreferences);
      }
      
      // Log filtering results
      if (import.meta.env.DEV) {
        console.info(`✅ Filtered to ${colleges.length} colleges matching all preferences`);
      }
      
      // Log college count
      if (import.meta.env.DEV) {
        console.info(`✅ Loaded ${colleges.length} colleges from ${apiResponse.source === 'api' ? 'College Scorecard API' : 'sample data'}`);
      }

      setStatus('Analyzing your profile...');
      // Generate initial matches using Simple Mode
      const matchResults = matchColleges(answers, colleges);

      setStatus('Calculating fit scores...');
      // Map results to college objects with fit data and breakdown
      const collegesWithFit = colleges.map((college) => {
        const match = matchResults.find((r) => r.collegeId === college.id);
        
        // Generate website URL from college name or use existing URL
        let website = '';
        if (college.logo && college.logo.includes('logo.clearbit.com')) {
          // Extract domain from logo URL
          const domainMatch = college.logo.match(/logo\.clearbit\.com\/([^/]+)/);
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
          logo: college.logo,
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

      // Store in colleges store
      setColleges(collegesWithFit);

      // Store match results in localStorage for offline access
      localStorage.setItem('initial_matches', JSON.stringify(matchResults));
      localStorage.setItem('colleges_source', apiResponse.source);

      setStatus('Complete!');
      // Navigate to dashboard after processing
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

      return () => clearTimeout(timer);
    };

    processMatches();
  }, [navigate, setColleges]);

  return (
    <ScreenContainer className="processing-screen" data-page="onboarding-processing">
      <div className="processing-screen__content">
        <div className="processing-screen__spinner" />
        <h1 className="processing-screen__title">We're preparing your matches</h1>
        <p className="processing-screen__description">{status}</p>
      </div>
    </ScreenContainer>
  );
};
