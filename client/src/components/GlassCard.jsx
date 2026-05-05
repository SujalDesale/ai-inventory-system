import { motion } from "framer-motion"

export default function GlassCard({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl border border-white/20 p-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}

