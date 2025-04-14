import { IconChartBar, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FcBusinesswoman } from "react-icons/fc";
import { FaChildReaching } from "react-icons/fa6";
import { BadgeCheck, HeartPulse, Hourglass, Landmark } from "lucide-react";

// Reusable skeleton loader component for a card.
// The layout approximates the header (description, title, badge) and footer (one or more lines of details).
const SkeletonCard = ({ footerLines = 2 }) => {
  const lineArray = Array(footerLines).fill(0);
  return (
    <div className="group p-0 m-0">
      <div className="border-2 border-slate-200 rounded-lg p-4 animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-2">
          {/* Simulated description */}
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
          {/* Simulated title */}
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
          {/* Optional badge placeholder */}
          <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        {/* Footer Skeleton: Render as many lines as needed */}
        <div className="space-y-2">
          {lineArray.map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export function SectionCards({ dashboardCount, isLoading }) {
  const cardData = [
    {
      description: "Total Households Surveyed",
      title: dashboardCount?.total_houses,
      footerText: "Last 30 days survey records",
      footerIcon: <IconTrendingUp className="size-4" />,
      footerStat: "Last month (+2.8%)",
      footerTextColor: "text-sm text-cyan-600 dark:text-slate-400",
      cardClass: "border-2 border-slate-200 hover:bg-cyan-100 hover:border-cyan-400",
      link: "/surveyed-households"
    },
    {
      description: "Number of Members",
      title: dashboardCount?.total_persons,
      footerText: null,
      footerIcon: null,
      footerStat: (
        <span className="flex flex-col justify-center items-center gap-0">
          <span className="flex gap-x-2 items-center">
            <FcBusinesswoman className="size-4" />
            Women: {dashboardCount?.total_women}
          </span>
          <span className="flex gap-x-2 items-center">
            <FaChildReaching className="size-4 text-gray-400" />
            Children: {dashboardCount?.total_children}
          </span>
        </span>
      ),
      footerTextColor: "text-sm text-amber-600 dark:text-slate-400",
      cardClass: "border-2 border-slate-200 hover:bg-amber-100 hover:border-amber-400",
      link: "/no-of-members",
      badge: {
        text: "-8%",
        className: "text-red-500 bg-red-50",
        icon: <IconTrendingDown />,
      },
    },
    {
      description: "Total SAM Cases",
      title: dashboardCount?.sam_all,
      footerText: null,
      footerIcon: null,
      footerStat: (
        <span className="flex flex-col justify-center items-center gap-0">
          <span className="flex gap-x-2 items-center">
            <FcBusinesswoman className="size-4" />
            Women: {dashboardCount?.sam_women}
          </span>
          <span className="flex gap-x-2 items-center">
            <FaChildReaching className="size-4 text-gray-400" />
            Children: {dashboardCount?.sam_children}
          </span>
        </span>
      ),
      footerTextColor: "text-sm text-violet-600",
      cardClass: "border-2 border-slate-200 hover:bg-violet-100 hover:border-violet-400",
      link: "/health-metrics",
      badge: {
        text: "+12.5%",
        className: "text-green-500 bg-green-50",
        icon: <IconTrendingUp />,
      },
    },
    {
      description: "Total MAM Cases",
      title: dashboardCount?.mam_all,
      footerText: null,
      footerIcon: null,
      footerStat: (
        <span className="flex flex-col justify-center items-center gap-0">
          <span className="flex gap-x-2 items-center">
            <FcBusinesswoman className="size-4" />
            Women: {dashboardCount?.mam_women}
          </span>
          <span className="flex gap-x-2 items-center">
            <FaChildReaching className="size-4 text-gray-400" />
            Children: {dashboardCount?.mam_children}
          </span>
        </span>
      ),
      footerTextColor: "text-sm text-teal-600",
      cardClass: "border-2 border-slate-200 hover:bg-teal-100 hover:border-teal-400",
      link: "/health-metrics",
      badge: {
        text: "+12.5%",
        className: "text-green-500 bg-green-50",
        icon: <IconTrendingUp />,
      },
    },
  ];

  return (
    <>
      {/* Primary Grid – Cards */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {isLoading
          ? cardData.map((_, index) => (
            // Render skeleton loader for each card (assuming 2 footer lines)
            <SkeletonCard key={index} footerLines={2} />
          ))
          : cardData.map((card, index) => (
            <Link href={`${card.link}`} key={index} className="group p-0 m-0">
              <Card className={`@container/card ${card.cardClass || ""}`}>
                <CardHeader>
                  <CardDescription className="font-bold">{card.description}</CardDescription>
                  <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
                    {card.title}
                  </CardTitle>
                  {card.badge && (
                    <CardAction>
                      <Badge variant="outline" className={card.badge.className}>
                        {card.badge.icon}
                        {card.badge.text}
                      </Badge>
                    </CardAction>
                  )}
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-sm">
                    {card.footerStat} {card.footerIcon}
                  </div>
                  <div className={card.footerTextColor}>{card.footerText}</div>
                </CardFooter>
              </Card>
            </Link>
          ))}
      </div>

      {/* Secondary Grid – Detailed Cards */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 mt-6">
        {isLoading ? (
          <>
            {/* Render 3 skeleton cards for the secondary grid.
                Here we use 4 footer lines to mimic detailed data layout. */}
            <SkeletonCard footerLines={4} />
            <SkeletonCard footerLines={4} />
            <SkeletonCard footerLines={4} />
          </>
        ) : (
          <>
            {/* High/Low BP Cases Card */}
            <div className="group p-0 m-0">
              <Card className="border-2 border-slate-200 bg-violet-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-2xl">
                    High/Low BP Cases
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex flex-col items-start gap-3 text-sm">
                  <div className="flex items-center gap-2 text-base font-medium">
                    <Landmark className="h-4 w-4 text-violet-600" />
                    High BP Female Cases: <span className="font-semibold">{dashboardCount?.high_bp_women ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base font-medium">
                    <BadgeCheck className="h-4 w-4 text-green-600" />
                    Low BP Female Cases: <span className="font-semibold">{dashboardCount?.low_bp_women ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base font-medium">
                    <HeartPulse className="h-4 w-4 text-red-600" />
                    High BP Male Cases: <span className="font-semibold">{dashboardCount?.high_bp_all ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base font-medium">
                    <Hourglass className="h-4 w-4 text-yellow-600" />
                    Low BP Male Cases: <span className="font-semibold">{dashboardCount?.low_bp_all ?? 0}</span>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* High/Low Sugar Cases Card */}
            <div className="group p-0 m-0">
              <Card className="border-2 border-slate-200 bg-violet-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-2xl">
                    High/Low Sugar Cases
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex flex-col items-start gap-3 text-sm">
                  <div className="flex items-center gap-2 text-base font-medium">
                    <Landmark className="h-4 w-4 text-violet-600" />
                    High Sugar Female Cases: <span className="font-semibold">{dashboardCount?.high_sugar_women ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base font-medium">
                    <BadgeCheck className="h-4 w-4 text-green-600" />
                    Low Sugar Female Cases: <span className="font-semibold">{dashboardCount?.low_sugar_women ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base font-medium">
                    <HeartPulse className="h-4 w-4 text-red-600" />
                    High Sugar Male Cases: <span className="font-semibold">{dashboardCount?.high_sugar_all ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base font-medium">
                    <Hourglass className="h-4 w-4 text-yellow-600" />
                    Low Sugar Male Cases: <span className="font-semibold">{dashboardCount?.low_sugar_all ?? 0}</span>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Govt. Schemes Report Card */}
            <div className="group p-0 m-0">
              <Card className="border-2 border-slate-200 bg-violet-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-2xl">
                    All Govt. Schemes Report
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex flex-col items-start gap-3 text-sm">
                  <div className="flex items-center gap-2 text-base font-medium">
                    <Landmark className="h-4 w-4 text-violet-600" />
                    Caste Certificate: <span className="font-semibold">{dashboardCount?.caste_certificate_women ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base font-medium">
                    <BadgeCheck className="h-4 w-4 text-green-600" />
                    Lakshmir Bhandar: <span className="font-semibold">{dashboardCount?.lakshmir_bhandar_women ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base font-medium">
                    <HeartPulse className="h-4 w-4 text-red-600" />
                    Swasthya Sathi: <span className="font-semibold">{dashboardCount?.swasthya_sathi_women ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base font-medium">
                    <Hourglass className="h-4 w-4 text-yellow-600" />
                    Old Age Pension: <span className="font-semibold">{dashboardCount?.old_age_pension_women ?? 0}</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}
