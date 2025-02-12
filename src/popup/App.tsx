// App.tsx
import { useState } from 'react';
import SettingsTab from '../popup/components/SettingsTab';
import GamesTab from '../popup/components/GamesTab';
import ChatTab from '../popup/components/ChatTab';
import { Tab } from '../types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('settings');

  return (
    <div className='container mx-auto p-4 w-96 min-h-[500px]'>
      {/* Tabs Navigation */}
      <div className='tabs tabs-boxed mb-4'>
        <button
          className={`tab ${activeTab === 'settings' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
        <button
          className={`tab ${activeTab === 'games' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          🎮 Games
        </button>
        <button
          className={`tab ${activeTab === 'chat' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Chat
        </button>
      </div>

      {/* Render Tab Content */}
      {activeTab === 'settings' && <SettingsTab />}

      {activeTab === 'games' && <GamesTab />}

      {activeTab === 'chat' && <ChatTab />}
    </div>
  );
};

export default App;
