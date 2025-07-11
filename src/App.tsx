import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { LayoutWithHeader } from '@/components/LayoutWithHeader'
import { HomePage } from '@/pages/HomePage'
import { ProfilePage } from '@/pages/ProfilePage'
import { HistoryPage } from '@/pages/HistoryPage'
import { NetworksPage } from '@/pages/NetworksPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { ArchivesPage } from '@/pages/ArchivesPage'
import { ActivityPage } from '@/pages/ActivityPage'

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider defaultTheme="system" storageKey="cyberlab-theme">
        <Router>
          <Routes>
            <Route path="/" element={<LayoutWithHeader />}>
              <Route index element={<HomePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="networks" element={<NetworksPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="archives" element={<ArchivesPage />} />
              <Route path="activity" element={<ActivityPage />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App