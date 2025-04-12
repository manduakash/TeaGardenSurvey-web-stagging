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


export function SectionCards({ data }) {
  const cardData = [
    {
      description: "Total Households Surveyed",
      title: "2,736",
      footerText: "Last 30 days survey records",
      footerIcon: <IconTrendingUp className="size-4" />,
      footerStat: "Last month (+2.8%)",
      footerTextColor: "text-sm text-cyan-600 dark:text-slate-400",
      cardClass: "border-2 border-slate-200 hover:bg-cyan-100 hover:border-cyan-400",
      link: "/surveyed-households"
    },
    {
      description: "Number of Members",
      title: "9,234",
      footerText: null,
      footerIcon: null,
      footerStat: <span className="flex flex-col justify-center items-center gap-0">
        <span className="flex gap-x-2 gap-y-0 items-center"><FcBusinesswoman className="size-4" />Women: 673 </span>
        <span className="flex gap-x-2 gap-y-0 items-center"><FaChildReaching className="size-4 text-gray-400" />Children: 984</span>
      </span>,
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
      title: "3,678",
      footerText: null,
      footerIcon: null,
      footerStat: <span className="flex flex-col justify-center items-center gap-0">
        <span className="flex gap-x-2 gap-y-0 items-center"><FcBusinesswoman className="size-4" />Women: 673 </span>
        <span className="flex gap-x-2 gap-y-0 items-center"><FaChildReaching className="size-4 text-gray-400" />Children: 984</span>
      </span>,
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
      title: "3,678",
      footerText: null,
      footerIcon: null,
      footerStat: <span className="flex flex-col justify-center items-center gap-0">
        <span className="flex gap-x-2 gap-y-0 items-center"><FcBusinesswoman className="size-4" />Women: 673 </span>
        <span className="flex gap-x-2 gap-y-0 items-center"><FaChildReaching className="size-4 text-gray-400" />Children: 984</span>
      </span>,
      footerTextColor: "text-sm text-teal-600",
      cardClass: "border-2 border-slate-200 hover:bg-teal-100 hover:border-teal-400",
      link: "/health-metrics",
      badge: {
        text: "+12.5%",
        className: "text-green-500 bg-green-50",
        icon: <IconTrendingUp />,
      },
    },
    // {
    //   description: "Growth Rate",
    //   title: "4.5%",
    //   footerText: "Meets growth projections",
    //   footerIcon: <IconTrendingUp className="size-4" />,
    //   footerStat: "Performance increase",
    //   footerTextColor: "text-sm text-violet-600",
    //   cardClass: "border-2 border-slate-200 hover:bg-violet-100 hover:border-violet-400",
    //   link: "/growth-breakdowns",
    //   badge: {
    //     text: "+4.5%",
    //     className: "text-green-500 bg-green-50",
    //     icon: <IconTrendingUp />,
    //   },
    // },
  ];

  return (
    <>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {cardData.map((card, index) => (
          <Link href={`${card?.link}`} key={index} className="group p-0 m-0">
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

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {/* High/Low BP Cases */}
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
                High BP Female Cases: <span className="font-semibold">{data?.caste_certificate_women ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-base font-medium">
                <BadgeCheck className="h-4 w-4 text-green-600" />
                Low BP Female Cases: <span className="font-semibold">{data?.lakshmir_bhandar_women ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-base font-medium">
                <HeartPulse className="h-4 w-4 text-red-600" />
                High BP Male Cases: <span className="font-semibold">{data?.swasthya_sathi_women ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-base font-medium">
                <Hourglass className="h-4 w-4 text-yellow-600" />
                Low BP Female Cases: <span className="font-semibold">{data?.old_age_pension_women ?? 0}</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* High/Low Sugar Cases */}
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
                High Sugar Female Cases: <span className="font-semibold">{data?.caste_certificate_women ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-base font-medium">
                <BadgeCheck className="h-4 w-4 text-green-600" />
                Low Sugar Female Cases: <span className="font-semibold">{data?.lakshmir_bhandar_women ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-base font-medium">
                <HeartPulse className="h-4 w-4 text-red-600" />
                High Sugar Male Cases: <span className="font-semibold">{data?.swasthya_sathi_women ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-base font-medium">
                <Hourglass className="h-4 w-4 text-yellow-600" />
                Low Sugar Male Cases: <span className="font-semibold">{data?.old_age_pension_women ?? 0}</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Schemes */}
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
                Caste Certificate: <span className="font-semibold">{data?.caste_certificate_women ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-base font-medium">
                <BadgeCheck className="h-4 w-4 text-green-600" />
                Lakshmir Bhandar: <span className="font-semibold">{data?.lakshmir_bhandar_women ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-base font-medium">
                <HeartPulse className="h-4 w-4 text-red-600" />
                Swasthya Sathi: <span className="font-semibold">{data?.swasthya_sathi_women ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-base font-medium">
                <Hourglass className="h-4 w-4 text-yellow-600" />
                Old Age Pension: <span className="font-semibold">{data?.old_age_pension_women ?? 0}</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}