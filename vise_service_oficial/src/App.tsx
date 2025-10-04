import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ClientRegistration from './components/ClientRegistration';
import PurchaseProcessing from './components/PurchaseProcessing';
import ClientsList from './components/ClientsList';

function App() {
  const [activeTab, setActiveTab] = useState<'register' | 'purchase' | 'clients'>('register');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'register':
        return <ClientRegistration />;
      case 'purchase':
        return <PurchaseProcessing />;
      case 'clients':
        return <ClientsList />;
      default:
        return <ClientRegistration />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="py-8">
        {renderActiveComponent()}
      </main>
    </div>
  );
}

export default App;