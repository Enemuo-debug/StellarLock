import { useEffect, useState } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { Layout } from "@/components/layout/Layout"
import { Landing } from "@/pages/Landing"
import { CreateLock } from "@/pages/CreateLock"
import { MyLocks } from "@/pages/MyLocks"
import { LockDetail } from "@/pages/LockDetail"
import { Explorer } from "@/pages/Explorer"
import { Discover } from "@/pages/Discover"
import { trackPageView } from "@/lib/analytics"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { KeyboardShortcutsModal } from "@/components/ui/KeyboardShortcutsModal"
import { PwaUpdatePrompt } from "@/components/ui/PwaUpdatePrompt"

export function App() {
  const location = useLocation()
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  useEffect(() => {
    trackPageView()
  }, [location.pathname])

  useKeyboardShortcuts({ onShowHelp: () => setShortcutsOpen(true) })

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: "#363636", color: "#fff" },
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/app/create" element={<CreateLock />} />
          <Route path="/app/locks" element={<MyLocks />} />
          <Route path="/app/lock/:id" element={<LockDetail />} />
          <Route path="/explore" element={<Discover />} />
          <Route path="/explore/:token" element={<Explorer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <PwaUpdatePrompt />
    </>
  )
}
