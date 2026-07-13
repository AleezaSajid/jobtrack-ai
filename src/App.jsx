import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import AddJob from './pages/AddJob'
import AddApplication from './pages/AddApplication'
import Settings from './pages/Settings'
import ApplicationsProvider from './hooks/ApplicationsProvider.jsx'
import ResumeManager from './pages/ResumeManager'
import AIAssistant from './pages/AIAssistant'
import ToastProvider from './hooks/ToastProvider.jsx'

export default function App(){
  return (
    <ToastProvider>
      <ApplicationsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout/>}>
              <Route index element={<Dashboard/>} />
              <Route path="applications" element={<Applications/>} />
              <Route path="add-job" element={<AddJob/>} />
              <Route path="add-application" element={<AddApplication/>} />
              <Route path="settings" element={<Settings/>} />
              <Route path="resume" element={<ResumeManager/>} />
              <Route path="ai" element={<AIAssistant/>} />
              <Route path="*" element={<Dashboard/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ApplicationsProvider>
    </ToastProvider>
  )
}
