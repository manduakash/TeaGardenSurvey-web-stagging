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
import { FcBusinessman, FcBusinesswoman } from "react-icons/fc";
import { FaChildReaching } from "react-icons/fa6";
import { ArrowRightIcon, BadgeCheck, HeartPulse, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { MdElderly } from "react-icons/md";
import { GrCertificate } from "react-icons/gr";
import { HiOutlineDocumentCurrencyRupee } from "react-icons/hi2";



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
      footerIcon: (dashboardCount?.total_household_change_percentage && dashboardCount?.total_household_change_percentage[0] == "+") ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />,
      footerStat: `Last month (${dashboardCount?.total_household_change_percentage}%)`,
      footerTextColor: "text-sm text-cyan-600 dark:text-slate-400",
      cardClass: "border-2 bg-cyan-100 hover:border-cyan-400 border-slate-300",
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
      cardClass: "border-2 bg-amber-100 hover:border-amber-400 border-slate-300",
      link: "/no-of-members",
      badge: null,
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
      footerTextColor: "text-sm text-green-600",
      cardClass: "border-2 bg-green-100 hover:border-green-400 border-slate-300",
      link: "/health-metrics/sam",
      badge: {
        text: `${dashboardCount?.sam_change_percentage}%`,
        className: (dashboardCount?.sam_change_percentage && dashboardCount?.sam_change_percentage[0] == "-") ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50",
        icon: (dashboardCount?.sam_change_percentage && dashboardCount?.sam_change_percentage[0] == "+") ? <IconTrendingUp /> : <IconTrendingDown />,
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
      footerTextColor: "text-sm text-indigo-600",
      cardClass: "border-2 bg-indigo-100 hover:border-indigo-400 border-slate-300",
      link: "/health-metrics/mam",
      badge: {
        text: `${dashboardCount?.mam_change_percentage}%`,
        className: (dashboardCount?.mam_change_percentage && dashboardCount?.mam_change_percentage[0] == "-") ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50",
        icon: (dashboardCount?.mam_change_percentage && dashboardCount?.mam_change_percentage[0] == "+") ? <IconTrendingUp /> : <IconTrendingDown />
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
            <div className="p-0 m-0">
              <Card className="border-2 border-slate-200 bg-violet-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-2xl">
                    High/Low BP Cases
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex flex-col items-start gap-1 text-sm">
                  <div className="flex items-center justify-between w-full gap-2 text-base font-medium">
                    <span className="flex relative justify-center items-center gap-2 text-sm"><FcBusinesswoman className="h-5 w-5 text-violet-600 z-1" /><TrendingUp className="left-2.5 absolute h-4 w-4 text-violet-600 z-0" />
                      High BP Female Cases:</span> <span className="font-semibold">{dashboardCount?.high_bp_women ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between w-full gap-2 text-base font-medium">
                    <span className="flex relative justify-center items-center gap-2 text-sm"><FcBusinesswoman className="h-5 w-5 text-green-600 z-1" /><TrendingDown className="left-2.5 absolute h-4 w-4 text-violet-600 z-0" />
                      Low BP Female Cases:</span> <span className="font-semibold">{dashboardCount?.low_bp_women ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between w-full gap-2 text-base font-medium">
                    <span className="flex relative justify-center items-center gap-2 text-sm"><FcBusinessman className="h-5 w-5 text-violet-600 z-1" /><TrendingUp className="left-2.5 absolute h-4 w-4 text-violet-600 z-0" />
                      High BP Male Cases:</span> <span className="font-semibold">{dashboardCount?.high_bp_all ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between w-full gap-2 text-base font-medium">
                    <span className="flex relative justify-center items-center gap-2 text-sm"><FcBusinessman className="h-5 w-5 text-green-600 z-1" /><TrendingDown className="left-2.5 absolute h-4 w-4 text-violet-600 z-0" />
                      Low BP Male Cases:</span> <span className="font-semibold">{dashboardCount?.low_bp_all ?? 0}</span>
                  </div>
                  <Button variant="outline" size={"sm"} className="group mx-auto p-0 rounded-2xl bg-violet-200 hover:bg-violet-200 border-slate-300 hover:ring-violet-500 hover:ring-1"><Link href="/health-metrics/bp-cases" className="m-0 p-2 flex justify-center items-center gap-2 text-xs">show more <ArrowRightIcon className="text-slate-400 group-hover:text-violet-700"/></Link></Button>
                </CardFooter>
              </Card>
            </div>

            {/* High/Low Sugar Cases Card */}
            <div className="p-0 m-0">
              <Card className="border-2 border-slate-200 bg-violet-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-2xl">
                    High/Low Sugar Cases
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex flex-col items-start gap-1 text-sm">
                  <div className="flex items-center justify-between w-full gap-2 relative text-base font-medium">
                    <span className="flex justify-center items-center gap-2 text-sm"><FcBusinesswoman className="h-5 w-5 text-violet-600 z-1" /><TrendingUp className="left-2.5 absolute h-4 w-4 text-violet-600 z-0" />
                    High Sugar Female Cases:</span> <span className="font-semibold">{dashboardCount?.high_sugar_women ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between w-full gap-2 relative text-base font-medium">
                    <span className="flex justify-center items-center gap-2 text-sm"><FcBusinesswoman className="h-5 w-5 text-green-600 z-1" /><TrendingDown className="left-2.5 absolute h-4 w-4 text-violet-600 z-0" />
                    Low Sugar Female Cases:</span> <span className="font-semibold">{dashboardCount?.low_sugar_women ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between w-full gap-2 relative text-base font-medium">
                    <span className="flex justify-center items-center gap-2 text-sm"><FcBusinessman className="h-5 w-5 text-violet-600 z-1" /><TrendingUp className="left-2.5 absolute h-4 w-4 text-violet-600 z-0" />
                    High Sugar Male Cases:</span> <span className="font-semibold">{dashboardCount?.high_sugar_all ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between w-full gap-2 relative text-base font-medium">
                    <span className="flex justify-center items-center gap-2 text-sm"><FcBusinessman className="h-5 w-5 text-green-600 z-1" /><TrendingDown className="left-2.5 absolute h-4 w-4 text-violet-600 z-0" />
                    Low Sugar Male Cases:</span> <span className="font-semibold">{dashboardCount?.low_sugar_all ?? 0}</span>
                  </div>
                  <Button variant="outline" size={"sm"} className="group mx-auto p-0 rounded-2xl bg-violet-200 hover:bg-violet-200 border-slate-300 hover:ring-violet-500 hover:ring-1"><Link href="/health-metrics/sugar-cases" className="m-0 p-2 flex justify-center items-center gap-2 text-xs">show more <ArrowRightIcon className="text-slate-400 group-hover:text-violet-700"/></Link></Button>
                </CardFooter>
              </Card>
            </div>

            {/* Govt. Schemes Report Card */}
            <div className="p-0 m-0">
              <Card className="border-2 border-slate-200 bg-violet-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-2xl">
                    All Govt. Schemes Report
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex flex-col items-start gap-1 text-sm">
                  <div className="flex items-center justify-between w-full gap-2 text-base font-medium">
                    <span className="flex justify-center items-center gap-2 text-sm"><GrCertificate className="h-4 w-4 text-violet-600" />
                      SC/ST Caste Certificate:</span> <span className="font-semibold">{dashboardCount?.caste_certificate_women ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between w-full gap-2 text-base font-medium">
                    <span className="flex justify-center items-center gap-2 text-sm"><HiOutlineDocumentCurrencyRupee className="h-4 w-4 text-green-600" />
                      Lakshmir Bhandar:</span> <span className="font-semibold">{dashboardCount?.lakshmir_bhandar_women ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between w-full gap-2 text-base font-medium">
                    <span className="flex justify-center items-center gap-2 text-sm"><HeartPulse className="h-4 w-4 text-red-500" />
                      Swasthya Sathi:</span> <span className="font-semibold">{dashboardCount?.swasthya_sathi_women ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between w-full gap-2 text-base font-medium">
                    <span className="flex justify-center items-center gap-2 text-sm"><MdElderly className="h-4 w-4 text-yellow-600" />
                      Old Age Pension:</span> <span className="font-semibold">{dashboardCount?.old_age_pension_women ?? 0}</span>
                  </div>

                  <Button variant="outline" size={"sm"} className="group mx-auto p-0 rounded-2xl bg-violet-200 hover:bg-violet-200 border-slate-300 hover:ring-violet-500 hover:ring-1"><Link href="/welfare" className="m-0 p-2 flex justify-center items-center gap-2 text-xs">show more <ArrowRightIcon className="text-slate-400 group-hover:text-violet-700"/></Link></Button>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}
