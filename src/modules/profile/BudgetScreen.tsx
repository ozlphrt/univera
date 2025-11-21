import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { useProfileStore } from '@/stores/profileStore';
import { formatCurrency } from '@/utils';
import './ProfileSectionScreen.css';
import './BudgetScreen.css';

export const BudgetScreen = () => {
  const navigate = useNavigate();
  const { budget, updateBudget, calculateCompletion } = useProfileStore();

  const [maxCost, setMaxCost] = useState(budget.maxCost?.toString() || '');
  const [needsAid, setNeedsAid] = useState(budget.needsAid || false);
  const [saving, setSaving] = useState(false);

  // Autosave on change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timer);
  }, [maxCost, needsAid]);

  const handleSave = async () => {
    setSaving(true);
    updateBudget({
      maxCost: maxCost ? parseInt(maxCost) : undefined,
      needsAid,
    });
    calculateCompletion();
    setSaving(false);
  };

  const handleBack = () => {
    navigate('/profile');
  };

  const budgetRanges = [
    { label: 'Under $20,000/year', value: 20000 },
    { label: '$20,000 - $40,000/year', value: 40000 },
    { label: '$40,000 - $60,000/year', value: 60000 },
    { label: 'Over $60,000/year', value: 80000 },
  ];

  return (
    <ScreenContainer className="profile-section-screen" data-page="profile-budget">
      <div className="profile-section-screen__content">
        <div className="profile-section-screen__header">
          <Button variant="ghost" onClick={handleBack} className="profile-section-screen__back">
            ← Back
          </Button>
          <h1 className="profile-section-screen__title">Budget & Financial</h1>
        </div>

        <Card className="profile-section-screen__form-card">
          <p className="budget-screen__intro">
            Understanding your budget helps us recommend colleges that are financially feasible for
            your family.
          </p>

          <div className="profile-section-screen__field">
            <label className="profile-section-screen__label">Maximum Annual Cost</label>
            <TextField
              label=""
              type="number"
              value={maxCost}
              onChange={(e) => setMaxCost(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="1000"
            />
            {maxCost && (
              <p className="budget-screen__formatted">
                {formatCurrency(parseInt(maxCost))} per year
              </p>
            )}
            <p className="profile-section-screen__helper">
              Or select a range below
            </p>
            <div className="budget-screen__ranges">
              {budgetRanges.map((range) => (
                <button
                  key={range.value}
                  className={`budget-screen__range-button ${
                    maxCost === range.value.toString()
                      ? 'budget-screen__range-button--selected'
                      : ''
                  }`}
                  onClick={() => setMaxCost(range.value.toString())}
                  type="button"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div className="profile-section-screen__field">
            <label className="profile-section-screen__label">Financial Aid</label>
            <div className="budget-screen__aid-options">
              <button
                className={`budget-screen__aid-button ${
                  needsAid ? 'budget-screen__aid-button--selected' : ''
                }`}
                onClick={() => setNeedsAid(true)}
                type="button"
              >
                Yes, I need financial aid
              </button>
              <button
                className={`budget-screen__aid-button ${
                  !needsAid ? 'budget-screen__aid-button--selected' : ''
                }`}
                onClick={() => setNeedsAid(false)}
                type="button"
              >
                No, I don't need aid
              </button>
            </div>
          </div>

          {saving && (
            <p className="profile-section-screen__saving">Saving...</p>
          )}
        </Card>
      </div>
    </ScreenContainer>
  );
};

