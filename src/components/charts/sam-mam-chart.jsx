"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton";


const defaultColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function SamMamChart({
  title = "SAM/MAM Report",
  description = "Nutritional Status Overview",
  data,
  isLoading,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted || isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <Skeleton className="h-6 w-48 bg-slate-200" />
          <Skeleton className="h-5 w-60 mt-2" />
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center pb-0">
          {/* Circular skeleton placeholder */}
          <Skeleton className="rounded-full bg-slate-200" style={{ width: "250px", height: "250px" }} />
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <Skeleton className="h-4 w-72" />
        </CardFooter>
      </Card>
    );
  }

  const chartConfig = {
    value: {
      label: "Count",
    },
    ...Object.fromEntries(
      data.map((item, index) => [
        item.label.toLowerCase(),
        {
          label: item.label,
          color: item.fill ?? defaultColors[index % defaultColors.length],
        },
      ])
    ),
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="label" label />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Based on current nutrition status data
        </div>
      </CardFooter>
    </Card>
  )
}
