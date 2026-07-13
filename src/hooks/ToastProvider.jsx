import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useMemo, useRef, useState } from 'react'
import { ToastContext } from './toastContext'

export default function ToastProvider({children}){
  const [toasts, setToasts] = useState([])
  const nextId = useRef(1)

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    const id = nextId.current
    nextId.current += 1
    const toast = {id, message, type}
    setToasts((current) => [...current, toast])
    window.setTimeout(() => dismissToast(id), 3600)
  }, [dismissToast])

  const value = useMemo(() => ({showToast, dismissToast}), [showToast, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite" aria-label="Notifications">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              className={`toast toast-${toast.type}`}
              key={toast.id}
              initial={{opacity: 0, y: 18, scale: 0.96}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: 12, scale: 0.96}}
              transition={{type: 'spring', stiffness: 420, damping: 32}}
            >
              <span>{toast.type}</span>
              <p>{toast.message}</p>
              <button type="button" aria-label="Dismiss notification" onClick={() => dismissToast(toast.id)}>Dismiss</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
