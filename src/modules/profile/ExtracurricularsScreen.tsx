import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { useProfileStore } from '@/stores/profileStore';
import './ProfileSectionScreen.css';
import './ExtracurricularsScreen.css';

interface Extracurricular {
  id: string;
  name: string;
  type: string;
  hoursPerWeek?: number;
}

export const ExtracurricularsScreen = () => {
  const navigate = useNavigate();
  const { extracurriculars, updateExtracurriculars, calculateCompletion } = useProfileStore();

  const [activities, setActivities] = useState<Extracurricular[]>(extracurriculars);
  const [saving, setSaving] = useState(false);

  // Autosave on change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activities.length > 0) {
        handleSave();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [activities]);

  const handleSave = async () => {
    setSaving(true);
    updateExtracurriculars(activities);
    calculateCompletion();
    setSaving(false);
  };

  const handleBack = () => {
    navigate('/profile');
  };

  const handleAddActivity = () => {
    const newActivity: Extracurricular = {
      id: Date.now().toString(),
      name: '',
      type: '',
      hoursPerWeek: undefined,
    };
    setActivities([...activities, newActivity]);
  };

  const handleRemoveActivity = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const handleUpdateActivity = (id: string, field: keyof Extracurricular, value: any) => {
    setActivities(
      activities.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const activityTypes = [
    'Sports',
    'Arts',
    'STEM',
    'Community Service',
    'Leadership',
    'Work',
    'Research',
    'Other',
  ];

  return (
    <ScreenContainer className="profile-section-screen" data-page="profile-extracurriculars">
      <div className="profile-section-screen__content">
        <div className="profile-section-screen__header">
          <Button variant="ghost" onClick={handleBack} className="profile-section-screen__back">
            ← Back
          </Button>
          <h1 className="profile-section-screen__title">Extracurriculars</h1>
        </div>

        <Card className="profile-section-screen__form-card">
          <p className="extracurriculars-screen__intro">
            Add your activities, clubs, sports, and leadership roles. This helps us find colleges
            that value what you're passionate about.
          </p>

          {activities.map((activity, index) => (
            <Card key={activity.id} className="extracurriculars-screen__activity-card">
              <div className="extracurriculars-screen__activity-header">
                <h3 className="extracurriculars-screen__activity-number">Activity {index + 1}</h3>
                {activities.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveActivity(activity.id)}
                    className="extracurriculars-screen__remove-button"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <TextField
                label="Activity Name"
                value={activity.name}
                onChange={(e) => handleUpdateActivity(activity.id, 'name', e.target.value)}
                placeholder="e.g., Varsity Soccer, Student Council"
              />

              <div className="profile-section-screen__field">
                <label className="profile-section-screen__label">Category</label>
                <div className="profile-section-screen__chips">
                  {activityTypes.map((type) => (
                    <button
                      key={type}
                      className={`profile-section-screen__chip ${
                        activity.type === type ? 'profile-section-screen__chip--selected' : ''
                      }`}
                      onClick={() => handleUpdateActivity(activity.id, 'type', type)}
                      type="button"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <TextField
                label="Hours per Week (Optional)"
                type="number"
                value={activity.hoursPerWeek?.toString() || ''}
                onChange={(e) =>
                  handleUpdateActivity(
                    activity.id,
                    'hoursPerWeek',
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                placeholder="0"
                min="0"
                max="40"
              />
            </Card>
          ))}

          <Button variant="secondary" onClick={handleAddActivity} fullWidth>
            + Add Activity
          </Button>

          {saving && (
            <p className="profile-section-screen__saving">Saving...</p>
          )}
        </Card>
      </div>
    </ScreenContainer>
  );
};

