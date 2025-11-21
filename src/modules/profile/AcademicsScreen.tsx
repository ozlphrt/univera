import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { useProfileStore } from '@/stores/profileStore';
import './ProfileSectionScreen.css';

export const AcademicsScreen = () => {
  const navigate = useNavigate();
  const { academics, updateAcademics, calculateCompletion } = useProfileStore();

  const [gpa, setGpa] = useState(academics.gpa?.toString() || '');
  const [weightedGpa, setWeightedGpa] = useState(academics.weightedGpa?.toString() || '');
  const [courseRigor, setCourseRigor] = useState<'low' | 'medium' | 'high' | ''>(
    academics.courseRigor || ''
  );
  const [sat, setSat] = useState(academics.testScores?.sat?.toString() || '');
  const [act, setAct] = useState(academics.testScores?.act?.toString() || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    updateAcademics({
      gpa: gpa ? parseFloat(gpa) : undefined,
      weightedGpa: weightedGpa ? parseFloat(weightedGpa) : undefined,
      courseRigor: (courseRigor || undefined) as 'low' | 'medium' | 'high' | undefined,
      testScores: {
        sat: sat ? parseInt(sat) : undefined,
        act: act ? parseInt(act) : undefined,
      },
    });
    calculateCompletion();
    setSaving(false);
  };

  // Autosave on change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (gpa || sat || act || courseRigor) {
        handleSave();
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gpa, weightedGpa, sat, act, courseRigor]);

  const handleBack = () => {
    navigate('/profile');
  };

  return (
    <ScreenContainer className="profile-section-screen" data-page="profile-academics">
      <div className="profile-section-screen__content">
        <div className="profile-section-screen__header">
          <Button variant="ghost" onClick={handleBack} className="profile-section-screen__back">
            ← Back
          </Button>
          <h1 className="profile-section-screen__title">Academics</h1>
        </div>

        <Card className="profile-section-screen__form-card">
          <TextField
            label="Unweighted GPA"
            type="number"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            placeholder="0.00 - 4.00"
            min="0"
            max="4"
            step="0.01"
            helperText="Your unweighted GPA on a 4.0 scale"
          />

          <TextField
            label="Weighted GPA (Optional)"
            type="number"
            value={weightedGpa}
            onChange={(e) => setWeightedGpa(e.target.value)}
            placeholder="0.00 - 5.00"
            min="0"
            max="5"
            step="0.01"
            helperText="If your school uses weighted GPA"
          />

          <div className="profile-section-screen__field">
            <label className="profile-section-screen__label">Course Rigor</label>
            <div className="profile-section-screen__chips">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  className={`profile-section-screen__chip ${
                    courseRigor === level ? 'profile-section-screen__chip--selected' : ''
                  }`}
                  onClick={() => setCourseRigor(level)}
                  type="button"
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <p className="profile-section-screen__helper">
              How challenging are your courses? (AP, IB, Honors, etc.)
            </p>
          </div>

          <TextField
            label="SAT Score (Optional)"
            type="number"
            value={sat}
            onChange={(e) => setSat(e.target.value)}
            placeholder="400 - 1600"
            min="400"
            max="1600"
          />

          <TextField
            label="ACT Score (Optional)"
            type="number"
            value={act}
            onChange={(e) => setAct(e.target.value)}
            placeholder="1 - 36"
            min="1"
            max="36"
          />

          {saving && (
            <p className="profile-section-screen__saving">Saving...</p>
          )}
        </Card>
      </div>
    </ScreenContainer>
  );
};

