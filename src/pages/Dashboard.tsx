import { Clock, Calendar, Users, TrendingUp } from "lucide-react"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { RecentRequests } from "@/components/dashboard/RecentRequests"
import { UpcomingLeaves } from "@/components/dashboard/UpcomingLeaves"
import heroImage from "@/assets/hero-dashboard.jpg"

export default function Dashboard() {
  // Simuler des données utilisateur
  const userStats = {
    remainingDays: 18.5,
    usedDays: 6.5,
    plannedDays: 3,
    teamSize: 12
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero text-white">
        <div className="absolute inset-0 bg-black/20" />
        <img 
          src={heroImage} 
          alt="HR Dashboard" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative p-8 md:p-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
              Bienvenue sur HRFlow
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 animate-slide-up">
              Gérez vos congés et ceux de votre équipe en toute simplicité
            </p>
            <div className="flex items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Décembre 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{userStats.teamSize} collaborateurs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Congés restants"
          value={`${userStats.remainingDays}j`}
          subtitle="Sur 25 jours alloués"
          icon={Clock}
          trend={{ value: -12, isPositive: false }}
          className="animate-scale-in"
        />
        <StatsCard
          title="Congés utilisés"
          value={`${userStats.usedDays}j`}
          subtitle="Depuis janvier 2024"
          icon={Calendar}
          trend={{ value: 8, isPositive: true }}
          className="animate-scale-in [animation-delay:100ms]"
        />
        <StatsCard
          title="Congés planifiés"
          value={`${userStats.plannedDays}j`}
          subtitle="Ce mois-ci"
          icon={TrendingUp}
          className="animate-scale-in [animation-delay:200ms]"
        />
        <StatsCard
          title="Équipe"
          value={userStats.teamSize}
          subtitle="Collaborateurs actifs"
          icon={Users}
          trend={{ value: 15, isPositive: true }}
          className="animate-scale-in [animation-delay:300ms]"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <QuickActions />
          <RecentRequests />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <UpcomingLeaves />
        </div>
      </div>
    </div>
  )
}