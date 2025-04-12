import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

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

export function SectionCards() {
  const cardData = [
    {
      description: "Total Households Surveyed",
      title: "2,736",
      footerText: "Last 30 days survey records",
      footerIcon: <IconTrendingUp className="size-4" />,
      footerStat: "Last month (+2.8%)",
      footerTextColor: "text-cyan-600 dark:text-slate-400",
      cardClass: "border-2 border-slate-200 hover:bg-cyan-100 hover:border-cyan-400",
      link: "/surveyed-households"
    },
    {
      description: "Number of Members",
      title: "9,234",
      footerText: "Last 30 days survey records",
      footerIcon: <IconTrendingDown className="size-4" />,
      footerStat: "Down 8% this month",
      footerTextColor: "text-amber-600 dark:text-slate-400",
      cardClass: "border-2 border-slate-200 hover:bg-amber-100 hover:border-amber-400",
      link: "/no-of-members",
      badge: {
        text: "-8%",
        className: "text-red-500 bg-red-50",
        icon: <IconTrendingDown />,
      },
    },
    {
      description: "Health Metrics",
      title: "3,678",
      footerText: "For BP, Sugar, SAM/MAM Cases",
      footerIcon: <IconTrendingUp className="size-4" />,
      footerStat: "Health camps increases",
      footerTextColor: "text-teal-600",
      cardClass: "border-2 border-slate-200 hover:bg-teal-100 hover:border-teal-400",
      link: "/health-metrics",
      badge: {
        text: "+12.5%",
        className: "text-green-500 bg-green-50",
        icon: <IconTrendingUp />,
      },
    },
    {
      description: "Growth Rate",
      title: "4.5%",
      footerText: "Meets growth projections",
      footerIcon: <IconTrendingUp className="size-4" />,
      footerStat: "Performance increase",
      footerTextColor: "text-violet-600",
      cardClass: "border-2 border-slate-200 hover:bg-violet-100 hover:border-violet-400",
      link: "/growth-breakdowns",
      badge: {
        text: "+4.5%",
        className: "text-green-500 bg-green-50",
        icon: <IconTrendingUp />,
      },
    },
  ];

  return (
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
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.footerStat} {card.footerIcon}
              </div>
              <div className={card.footerTextColor}>{card.footerText}</div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}