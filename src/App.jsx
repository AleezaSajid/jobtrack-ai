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
import AuthProvider from './hooks/AuthProvider.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import Login from './pages/Login'
import Signup from './pages/Signup'

export default function App(){
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={
              <ProtectedRoute>
                <ApplicationsProvider>
                  <MainLayout/>
                </ApplicationsProvider>
              </ProtectedRoute>
            }>
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
      </AuthProvider>
    </ToastProvider>
  )
}
