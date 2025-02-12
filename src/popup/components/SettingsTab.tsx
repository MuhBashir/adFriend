import React, { useState, useEffect } from 'react';
import { Mood, WidgetsProps } from '../../types';

const SettingsTab: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>('happy');

  const [widgets, setWidgets] = useState<WidgetsProps>({
    quotes: true,
    reminders: true,
    funFacts: false,
  });
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'cupcake'
  );

  const [apiKey, setApiKey] = useState('');

  const saveKey = () => {
    chrome.storage.sync.set({ openaiKey: apiKey }, () => {
      alert('API key saved!');
    });
  };

  useEffect(() => {
    // Load saved settings from Chrome storage
    chrome.storage.sync.get(['widgets'], (result) => {
      if (result.widgets) {
        setWidgets(result.widgets);
      }
    });
  }, []);

  const handleToggle = (widget: keyof WidgetsProps) => {
    const updatedWidgets = {
      ...widgets,
      [widget]: !widgets[widget],
    };
    setWidgets(updatedWidgets);
    chrome.storage.sync.set({ widgets: updatedWidgets });
  };
  // Load saved mood from localStorage
  useEffect(() => {
    chrome.storage.sync.get(['mood'], (result) => {
      setSelectedMood(result.mood || 'happy');
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const themeLocal = localStorage.getItem('theme');
    document
      .querySelector('html')!
      .setAttribute('data-theme', themeLocal || 'cupcake');
  }, [theme]);

  // toggle theme between cupcake and luxury
  const toggleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setTheme('luxury');
    } else {
      setTheme('cupcake');
    }
  };

  return (
    <div>
      <div className='card bg-base-200 mb-4'>
        <div className='card-body'>
          <h2 className='card-title'>Theme settings</h2>
          <div className='form-control'>
            <label className='label cursor-pointer'>
              <span className='label-text'>
                {theme === 'cupcake' ? 'Light' : 'Dark'}
              </span>
              <input
                type='checkbox'
                className='toggle toggle-primary theme-controller'
                onChange={toggleTheme}
              />
            </label>
          </div>
        </div>
      </div>
      <div className='card bg-base-200 mb-4'>
        <div className='card-body'>
          <h2 className='card-title'>Mood Settings</h2>
          <div className='grid grid-cols-3 gap-2'>
            {['happy', 'calm', 'sad'].map((mood) => (
              <button
                key={mood}
                className={`btn ${
                  selectedMood === mood ? 'btn-primary' : 'btn-ghost'
                }`}
                onClick={() => {
                  setSelectedMood(mood as Mood);
                  chrome.storage.sync.set({ mood });
                }}
              >
                {mood === 'happy' && '😊 Happy'}
                {mood === 'calm' && '🧘 Calm'}
                {mood === 'sad' && '😢 Sad'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='card bg-base-200 mb-4'>
        <div className='card-body'>
          <h2 className='card-title'>Widget Preferences</h2>
          <div className='form-control'>
            <label className='label cursor-pointer'>
              <span className='label-text'>Show Inspirational Quotes</span>
              <input
                type='checkbox'
                className='toggle toggle-primary'
                checked={widgets.quotes}
                onChange={() => handleToggle('quotes')}
              />
            </label>
            <label className='label cursor-pointer'>
              <span className='label-text'>Enable Reminders</span>
              <input
                type='checkbox'
                className='toggle toggle-primary'
                checked={widgets.reminders}
                onChange={() => handleToggle('reminders')}
              />
            </label>

            <label className='label cursor-pointer'>
              <span className='label-text'>Enable Fun Facts</span>
              <input
                type='checkbox'
                className='toggle toggle-primary'
                checked={widgets.funFacts}
                onChange={() => handleToggle('funFacts')}
              />
            </label>
          </div>
        </div>
      </div>
      <div className='card bg-base-200 p-4'>
        <h2 className='text-xl mb-4'>AI Settings</h2>
        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>OpenAI API Key</span>
          </label>
          <input
            type='password'
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className='input input-bordered'
            placeholder='Enter your Open Router API key'
          />
          <button onClick={saveKey} className='btn btn-primary mt-2'>
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
