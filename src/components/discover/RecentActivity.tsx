import { useEffect, useState } from "react"
import { Activity, Lock, LogOut, GitBranch, UserCheck } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Card } from "@/components/ui/Card"
import { useContractEventContext, type ContractEvent } from "@/hooks/useContractEventContext"
import { formatDate, shortAddress } from "@/lib/utils"

interface ActivityEvent {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  timestamp: number
}

function eventToActivity(event: ContractEvent): ActivityEvent | null {
  const timestamp = event.timestamp
  const lockId = event.lockId

  switch (event.type) {
    case "lock_created":
      return {
        id: `${lockId}-created`,
        icon: <Lock className="h-4 w-4" />,
        title: "Lock Created",
        description: `Lock #${lockId} was created`,
        timestamp,
      }
    case "lock_withdrawn":
      return {
        id: `${lockId}-withdrawn`,
        icon: <LogOut className="h-4 w-4" />,
        title: "Tokens Withdrawn",
        description: `Tokens withdrawn from Lock #${lockId}`,
        timestamp,
      }
    case "lock_extended":
      return {
        id: `${lockId}-extended`,
        icon: <GitBranch className="h-4 w-4" />,
        title: "Lock Extended",
        description: `Lock #${lockId} unlock date was extended`,
        timestamp,
      }
    case "beneficiary_transferred":
      return {
        id: `${lockId}-beneficiary`,
        icon: <UserCheck className="h-4 w-4" />,
        title: "Beneficiary Changed",
        description: `Lock #${lockId} beneficiary was transferred`,
        timestamp,
      }
    case "lp_lock_created":
      return {
        id: `${lockId}-lp-created`,
        icon: <Lock className="h-4 w-4" />,
        title: "LP Lock Created",
        description: `LP Lock #${lockId} was created`,
        timestamp,
      }
    case "lp_lock_withdrawn":
      return {
        id: `${lockId}-lp-withdrawn`,
        icon: <LogOut className="h-4 w-4" />,
        title: "LP Withdrawn",
        description: `Liquidity withdrawn from LP Lock #${lockId}`,
        timestamp,
      }
    case "lp_lock_extended":
      return {
        id: `${lockId}-lp-extended`,
        icon: <GitBranch className="h-4 w-4" />,
        title: "LP Lock Extended",
        description: `LP Lock #${lockId} unlock date was extended`,
        timestamp,
      }
    case "lp_beneficiary_transferred":
      return {
        id: `${lockId}-lp-beneficiary`,
        icon: <UserCheck className="h-4 w-4" />,
        title: "LP Beneficiary Changed",
        description: `LP Lock #${lockId} beneficiary was transferred`,
        timestamp,
      }
    default:
      return null
  }
}

export function RecentActivity() {
  const { t } = useTranslation()
  const { events } = useContractEventContext()
  const [activities, setActivities] = useState<ActivityEvent[]>([])

  useEffect(() => {
    const newActivities = events
      .map((e) => eventToActivity(e))
      .filter((a) => a !== null)
      .slice(0, 10)
    setActivities(newActivities as ActivityEvent[])
  }, [events])

  if (activities.length === 0) {
    return (
      <section className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Activity className="h-5 w-5" />
          {t("discover.recentActivity")}
        </h2>
        <Card className="p-8 text-center text-muted-foreground">
          <p>{t("discover.noRecentActivity")}</p>
        </Card>
      </section>
    )
  }

  return (
    <section className="mt-8">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <Activity className="h-5 w-5" />
        {t("discover.recentActivity")}
      </h2>
      <Card className="divide-y divide-border">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 p-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              {activity.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.description}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatDate(activity.timestamp)}
            </span>
          </div>
        ))}
      </Card>
    </section>
  )
}
