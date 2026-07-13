import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import OnboardingFlow from '../components/OnboardingFlow'
import RouteErrorBoundary from '../components/RouteErrorBoundary'
import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { useApplications } from '../hooks/useApplications.jsx'
import { useToast } from '../hooks/useToast'

export default function MainLayout(){
  const location = useLocation()
  const { onboardingComplete, completeOnboarding } = useApplications()
  const { showToast } = useToast()

  const finishOnboarding = () => {
    completeOnboarding()
    showToast('Workspace onboarding complete. Everything you do now updates live.', 'success')
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content">
          <RouteErrorBoundary resetKey={location.pathname}>
            <motion.div
              key={location.pathname}
              initial={{opacity: 0, y: 12}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -8}}
              transition={{duration: 0.22, ease: 'easeOut'}}
            >
              <Outlet />
            </motion.div>
          </RouteErrorBoundary>
        </div>
      </div>
      <OnboardingFlow open={!onboardingComplete} onComplete={finishOnboarding} />
    </div>
  )
}
