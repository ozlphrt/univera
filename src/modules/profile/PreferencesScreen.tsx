import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { useProfileStore } from '@/stores/profileStore';
import './ProfileSectionScreen.css';
import './PreferencesScreen.css';

export const PreferencesScreen = () => {
  const navigate = useNavigate();
  const { preferences, updatePreferences, calculateCompletion } = useProfileStore();

  const [regions, setRegions] = useState<string[]>(preferences.location || []);
  const [environment, setEnvironment] = useState<string[]>(preferences.setting || []);
  const [schoolSize, setSchoolSize] = useState<string[]>(preferences.size || []);
  const [saving, setSaving] = useState(false);

  // Autosave on change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timer);
  }, [regions, environment, schoolSize]);

  const handleSave = async () => {
    setSaving(true);
    updatePreferences({
      location: regions,
      setting: environment.length > 0 ? environment : undefined,
      size: schoolSize.length > 0 ? schoolSize : undefined,
    });
    calculateCompletion();
    setSaving(false);
  };

  const handleBack = () => {
    navigate('/profile');
  };

  const toggleRegion = (region: string) => {
    if (regions.includes(region)) {
      setRegions(regions.filter((r) => r !== region));
    } else {
      setRegions([...regions, region]);
    }
  };

  const toggleEnvironment = (env: string) => {
    if (environment.includes(env)) {
      setEnvironment(environment.filter((e) => e !== env));
    } else {
      setEnvironment([...environment, env]);
    }
  };

  const toggleSize = (size: string) => {
    if (schoolSize.includes(size)) {
      setSchoolSize(schoolSize.filter((s) => s !== size));
    } else {
      setSchoolSize([...schoolSize, size]);
    }
  };

  const regionOptions = [
    'northeast',
    'south',
    'midwest',
    'west',
    'west-coast',
    'pacific-northwest',
    'mountain-west',
    'nyc',
    'boston',
    'los-angeles',
    'san-francisco',
    'seattle',
  ];
  
  const regionLabels: Record<string, string> = {
    'northeast': 'Northeast',
    'south': 'South',
    'midwest': 'Midwest',
    'west': 'West',
    'west-coast': 'West Coast',
    'pacific-northwest': 'Pacific Northwest',
    'mountain-west': 'Mountain West',
    'nyc': 'New York City (NYC)',
    'boston': 'Boston',
    'los-angeles': 'Los Angeles (LA)',
    'san-francisco': 'San Francisco',
    'seattle': 'Seattle',
  };

  const environmentOptions = ['urban', 'suburban', 'rural'];
  const sizeOptions = ['small', 'medium', 'large'];

  return (
    <ScreenContainer className="profile-section-screen" data-page="profile-preferences">
      <div className="profile-section-screen__content">
        <div className="profile-section-screen__header">
          <Button variant="ghost" onClick={handleBack} className="profile-section-screen__back">
            ← Back
          </Button>
          <h1 className="profile-section-screen__title">Preferences</h1>
        </div>

        <Card className="profile-section-screen__form-card">
          <div className="profile-section-screen__field">
            <label className="profile-section-screen__label">Preferred Regions</label>
            <p className="profile-section-screen__helper">
              Select all regions that interest you
            </p>
            <div className="preferences-screen__chips">
              {regionOptions.map((region) => (
                <Chip
                  key={region}
                  label={regionLabels[region] || region}
                  selected={regions.includes(region)}
                  onToggle={() => toggleRegion(region)}
                />
              ))}
            </div>
          </div>

          <div className="profile-section-screen__field">
            <label className="profile-section-screen__label">Campus Environment</label>
            <p className="profile-section-screen__helper">
              Select all that apply
            </p>
            <div className="profile-section-screen__chips">
              {environmentOptions.map((env) => (
                <Chip
                  key={env}
                  label={env.charAt(0).toUpperCase() + env.slice(1)}
                  selected={environment.includes(env)}
                  onToggle={() => toggleEnvironment(env)}
                />
              ))}
            </div>
          </div>

          <div className="profile-section-screen__field">
            <label className="profile-section-screen__label">School Size</label>
            <p className="profile-section-screen__helper">
              Select all that apply
            </p>
            <div className="profile-section-screen__chips">
              {sizeOptions.map((size) => (
                <Chip
                  key={size}
                  label={`${size.charAt(0).toUpperCase() + size.slice(1)}${
                    size === 'small' ? ' (<5,000)' :
                    size === 'medium' ? ' (5,000-15,000)' :
                    ' (15,000+)'
                  }`}
                  selected={schoolSize.includes(size)}
                  onToggle={() => toggleSize(size)}
                />
              ))}
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

