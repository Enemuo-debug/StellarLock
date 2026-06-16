import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, Wallet, Layers } from "lucide-react"
import { useWallet } from "@/hooks/useWallet"
import { useMyLocks } from "@/hooks/useLocks"
import { Tabs } from "@/components/ui/Tabs"
import { Button } from "@/components/ui/Button"
import { StatCard } from "@/components/ui/StatCard"
import { LockCard } from "@/components/locks/LockCard"
import { ConnectGate } from "@/components/layout/ConnectGate"
import { formatUsd } from "@/lib/utils"
import type { Lock } from "@/types/lock"

type Tab = "created" | "received"

export function MyLocks() {
  const { address } = useWallet()
  const navigate = useNavigate()
  const { data, loading, error, reload } = useMyLocks(address)
  const [tab, setTab] = useState<Tab>("created")

  const created = data?.created ?? []
  const received = data?.received ?? []

  const stats = useMemo(() => {
    const now = Date.now()
    const totalValue = created.reduce((sum, l) => sum + l.usdValue, 0)
    const unlockable = created.filter((l) => l.unlockAt <= now && l.status !== "withdrawn").length
    return { count: created.length, totalValue, unlockable }
  }, [created])

  const list = tab === "created" ? created : received

  return (
    <ConnectGate title="Connect to view your locks">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">My Locks</h1>
            <p className="mt-2 text-muted-foreground">Manage and withdraw your locked positions.</p>
          </div>
          <Button onClick={() => navigate("/app/create")}>
            <Plus className="h-4 w-4" />
            New Lock
          </Button>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Locks Created" value={String(stats.count)} icon={<Layers className="h-4 w-4" />} />
          <StatCard label="Total Value Locked" value={formatUsd(stats.totalValue)} />
          <StatCard
            label="Ready to Withdraw"
            value={String(stats.unlockable)}
            hint={stats.unlockable > 0 ? "Action available" : "Nothing unlocked yet"}
          />
        </div>

        <div className="mt-8">
          <Tabs
            value={tab}
            onChange={(v) => setTab(v as Tab)}
            items={[
              { value: "created", label: "Created by me", count: created.length },
              { value: "received", label: "Beneficiary", count: received.length },
            ]}
          />
        </div>

        <LockGrid locks={list} loading={loading} error={error} onRetry={reload} tab={tab} />
      </div>
    </ConnectGate>
  )
}

function LockGrid({
  locks,
  loading,
  error,
  onRetry,
  tab,
}: {
  locks: Lock[]
  loading: boolean
  error: string | null
  onRetry: () => void
  tab: Tab
}) {
  if (loading) {
    return (
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-52 animate-pulse rounded-xl border border-border bg-card/50" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-10 rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">Failed to load your locks.</p>
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      </div>
    )
  }

  if (locks.length === 0) {
    return (
      <div className="mt-10 rounded-xl border border-dashed border-border bg-card/40 p-12 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Wallet className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-semibold">
          {tab === "created" ? "No locks here yet" : "No locks where you're the beneficiary"}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {tab === "created"
            ? "Create your first lock to prove your tokens or liquidity are secured."
            : "Locks created for you by others will appear here."}
        </p>
        {tab === "created" && (
          <Link to="/app/create">
            <Button className="mt-6">
              <Plus className="h-4 w-4" />
              Create a Lock
            </Button>
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {locks.map((lock) => (
        <LockCard key={lock.id} lock={lock} />
      ))}
    </div>
  )
}
