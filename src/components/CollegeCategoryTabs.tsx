import './CollegeCategoryTabs.css';

interface CollegeCategoryTabsProps {
  activeCategory: 'all' | 'reach' | 'target' | 'safety';
  onChange: (category: 'all' | 'reach' | 'target' | 'safety') => void;
}

export const CollegeCategoryTabs = ({ activeCategory, onChange }: CollegeCategoryTabsProps) => {
  const tabs = [
    { id: 'all' as const, label: 'All' },
    { id: 'reach' as const, label: 'Reach' },
    { id: 'target' as const, label: 'Target' },
    { id: 'safety' as const, label: 'Safety' },
  ];

  return (
    <div className="college-category-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`college-category-tabs__tab ${
            activeCategory === tab.id ? 'college-category-tabs__tab--active' : ''
          }`}
          onClick={() => onChange(tab.id)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

