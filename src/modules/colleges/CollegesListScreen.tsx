import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { CollegeListItem } from '@/components/CollegeListItem';
import { CollegeCategoryTabs } from '@/components/CollegeCategoryTabs';
import { Button } from '@/components/Button';
import { useCollegesStore } from '@/stores/collegesStore';
import './CollegesListScreen.css';

export const CollegesListScreen = () => {
  const navigate = useNavigate();
  const { colleges, filters, setFilters, setSelectedCollege } = useCollegesStore();

  const filteredColleges = useMemo(() => {
    let filtered = [...colleges];

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter((c) => c.category === filters.category);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.location.toLowerCase().includes(searchLower)
      );
    }

    // Sort by fit score (highest first)
    return filtered.sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0));
  }, [colleges, filters]);

  const handleCollegeClick = (college: typeof colleges[0]) => {
    setSelectedCollege(college);
    navigate(`/colleges/${college.id}`);
  };

  const handleCategoryChange = (category: 'all' | 'reach' | 'target' | 'safety') => {
    setFilters({ category });
  };

  const categoryCounts = {
    all: colleges.length,
    reach: colleges.filter((c) => c.category === 'reach').length,
    target: colleges.filter((c) => c.category === 'target').length,
    safety: colleges.filter((c) => c.category === 'safety').length,
  };

  return (
    <ScreenContainer className="colleges-list-screen" data-page="colleges-list">
      <div className="colleges-list-screen__content">
        <div className="colleges-list-screen__header">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="colleges-list-screen__back-button"
          >
            ← Dashboard
          </Button>
          <h1 className="colleges-list-screen__title">Colleges</h1>
        </div>

        <CollegeCategoryTabs
          activeCategory={filters.category || 'all'}
          onChange={handleCategoryChange}
        />

        {/* Category counts */}
        <div className="colleges-list-screen__counts">
          <span className="colleges-list-screen__count">
            {filteredColleges.length} college{filteredColleges.length !== 1 ? 's' : ''}
          </span>
          {filters.category === 'all' && (
            <span className="colleges-list-screen__count-breakdown">
              ({categoryCounts.reach} Reach • {categoryCounts.target} Target • {categoryCounts.safety} Safety)
            </span>
          )}
        </div>

        {/* Colleges list */}
        {filteredColleges.length > 0 ? (
          <div className="colleges-list-screen__list">
            {filteredColleges.map((college) => (
              <CollegeListItem
                key={college.id}
                name={college.name}
                location={college.location}
                category={college.category}
                fitScore={college.fitScore}
                logo={college.logo}
                onClick={() => handleCollegeClick(college)}
              />
            ))}
          </div>
        ) : (
          <div className="colleges-list-screen__empty">
            <p className="colleges-list-screen__empty-text">
              {filters.category === 'all'
                ? 'No colleges found. Complete onboarding to get recommendations.'
                : `No ${filters.category} colleges found.`}
            </p>
            {filters.category !== 'all' && (
              <Button variant="secondary" onClick={() => setFilters({ category: 'all' })}>
                View All Colleges
              </Button>
            )}
          </div>
        )}
      </div>
    </ScreenContainer>
  );
};

