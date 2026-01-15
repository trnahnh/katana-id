import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis } from "recharts";
import {
  IconFingerprint,
  IconChartBar,
  IconMailCode,
  IconShieldCheck,
  IconShield,
  IconShieldLock,
  IconTrendingUp,
  IconActivity,
} from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import {
  useDashboardStats,
  SERVICE_COLORS,
  type TimeRange,
  type ServiceUsage,
} from "@/hooks/use-dashboard-stats";

// =============================================================================
// CONSTANTS
// =============================================================================

const SERVICE_ICONS: Record<string, typeof IconFingerprint> = {
  "generative-identity": IconFingerprint,
  "traffic-analytics": IconChartBar,
  "email-service": IconMailCode,
  "email-fraud": IconShieldCheck,
  "captcha": IconShield,
  "trust": IconShieldLock,
};

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  "7d": "7 Days",
  "30d": "30 Days",
  "90d": "90 Days",
};

// =============================================================================
// COMPONENTS
// =============================================================================

function StatsOverview({ totalCalls, activeServices }: { totalCalls: number; activeServices: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <IconActivity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total API Calls</p>
              <p className="text-2xl font-bold">{totalCalls.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <IconTrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Services</p>
              <p className="text-2xl font-bold">{activeServices}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <IconChartBar className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Services Available</p>
              <p className="text-2xl font-bold">6</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UsagePieChart({ services }: { services: ServiceUsage[] }) {
  const chartData = services
    .filter((s) => s.total_calls > 0)
    .map((service) => ({
      name: service.service_name,
      value: service.total_calls,
      fill: SERVICE_COLORS[service.service_key] || "hsl(var(--muted))",
    }));

  const chartConfig = services.reduce(
    (acc, service) => ({
      ...acc,
      [service.service_key]: {
        label: service.service_name,
        color: SERVICE_COLORS[service.service_key],
      },
    }),
    {}
  );

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Distribution</CardTitle>
          <CardDescription>No usage data available yet</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">Start using services to see your usage distribution</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Distribution</CardTitle>
        <CardDescription>API calls by service</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              strokeWidth={2}
              stroke="hsl(var(--background))"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-sm text-muted-foreground">{entry.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ServiceCard({ service }: { service: ServiceUsage }) {
  const Icon = SERVICE_ICONS[service.service_key] || IconActivity;
  const color = SERVICE_COLORS[service.service_key] || "hsl(var(--primary))";

  const chartConfig = {
    count: { label: "Calls", color },
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div>
              <CardTitle className="text-base">{service.service_name}</CardTitle>
              <CardDescription>{service.total_calls.toLocaleString()} calls</CardDescription>
            </div>
          </div>
          <Link
            to={`/dashboard/${service.service_key}`}
            className="text-sm text-primary hover:underline"
          >
            View →
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-[80px] w-full">
          <AreaChart data={service.recent_calls} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${service.service_key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Area
              type="monotone"
              dataKey="count"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${service.service_key})`}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[400px] rounded-xl" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[140px] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function DashboardPage() {
  const { authUser } = useAuthStore();
  const { stats, isLoading, error, fetchStats } = useDashboardStats();
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  useEffect(() => {
    fetchStats(timeRange);
  }, [fetchStats, timeRange]);

  const activeServices = stats?.services.filter((s) => s.total_calls > 0).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
          Welcome back, {authUser?.firstName && authUser?.lastName
            ? `${authUser.firstName} ${authUser.lastName}`
            : authUser?.username || "User"}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your service usage
          </p>
        </div>
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
          <TabsList>
            {(Object.keys(TIME_RANGE_LABELS) as TimeRange[]).map((range) => (
              <TabsTrigger key={range} value={range}>
                {TIME_RANGE_LABELS[range]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">Failed to load dashboard data</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <button
                onClick={() => fetchStats(timeRange)}
                className="text-sm text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Overview */}
          <StatsOverview
            totalCalls={stats?.total_calls || 0}
            activeServices={activeServices}
          />

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pie Chart */}
            <UsagePieChart services={stats?.services || []} />

            {/* Service Cards */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Service Activity</h2>
              <div className="grid gap-4">
                {stats?.services.slice(0, 4).map((service) => (
                  <ServiceCard key={service.service_key} service={service} />
                ))}
              </div>
            </div>
          </div>

          {/* All Services Grid */}
          <div>
            <h2 className="text-lg font-semibold mb-4">All Services</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats?.services.map((service) => (
                <ServiceCard key={service.service_key} service={service} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}