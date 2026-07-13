import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'

export default function AnimatedCounter({value, suffix = ''}){
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => `${Math.round(latest)}${suffix}`)

  useEffect(() => {
    const controls = animate(count, Number(value) || 0, {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    })
    return controls.stop
  }, [count, value])

  return <motion.span>{rounded}</motion.span>
}
