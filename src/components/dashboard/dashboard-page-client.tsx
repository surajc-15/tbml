'use client';

import { useState } from 'react';
import { Navbar } from './navbar';
import { HomeSection } from './sections/home-section';
import { DashboardSection } from './sections/dashboard-section';
import { ContactUsSection } from './sections/contact-section';
import { AboutUsSection } from './sections/about-section';
import { NewUserRegistrationSection } from './sections/new-user-section';

interface UserData {
  email: string;
  role: string;
  username: string;
  name: string;
  bankName?: string;
}

interface DashboardPageClientProps {
  user: UserData;
  fraudSearch: string;
  fraudPage: number;
  fraudMinRisk: number;
}

export function DashboardPageClient({
  user,
  fraudSearch,
  fraudPage,
  fraudMinRisk,
}: DashboardPageClientProps) {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />;
      case 'dashboard':
        return (
          <DashboardSection
            userRole={user.role}
            userEmail={user.email}
            fraudSearch={fraudSearch}
            fraudPage={fraudPage}
            fraudMinRisk={fraudMinRisk}
          />
        );
      case 'contact-us':
        return <ContactUsSection />;
      case 'about-us':
        return <AboutUsSection />;
      case 'new-user':
        return <NewUserRegistrationSection createdBy={user.email} />;
      default:
        return (
          <DashboardSection
            userRole={user.role}
            userEmail={user.email}
            fraudSearch={fraudSearch}
            fraudPage={fraudPage}
            fraudMinRisk={fraudMinRisk}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1">{renderSection()}</div>
    </div>
  );
}
