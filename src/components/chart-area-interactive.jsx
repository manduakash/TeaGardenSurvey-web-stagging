"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", survey: 222, health_camps: 150 },
  { date: "2024-04-02", survey: 97, health_camps: 180 },
  { date: "2024-04-03", survey: 167, health_camps: 120 },
  { date: "2024-04-04", survey: 242, health_camps: 260 },
  { date: "2024-04-05", survey: 373, health_camps: 290 },
  { date: "2024-04-06", survey: 301, health_camps: 340 },
  { date: "2024-04-07", survey: 245, health_camps: 180 },
  { date: "2024-04-08", survey: 409, health_camps: 320 },
  { date: "2024-04-09", survey: 59, health_camps: 110 },
  { date: "2024-04-10", survey: 261, health_camps: 190 },
  { date: "2024-04-11", survey: 327, health_camps: 350 },
  { date: "2024-04-12", survey: 292, health_camps: 210 },
  { date: "2024-04-13", survey: 342, health_camps: 380 },
  { date: "2024-04-14", survey: 137, health_camps: 220 },
  { date: "2024-04-15", survey: 120, health_camps: 170 },
  { date: "2024-04-16", survey: 138, health_camps: 190 },
  { date: "2024-04-17", survey: 446, health_camps: 360 },
  { date: "2024-04-18", survey: 364, health_camps: 410 },
  { date: "2024-04-19", survey: 243, health_camps: 180 },
  { date: "2024-04-20", survey: 89, health_camps: 150 },
  { date: "2024-04-21", survey: 137, health_camps: 200 },
  { date: "2024-04-22", survey: 224, health_camps: 170 },
  { date: "2024-04-23", survey: 138, health_camps: 230 },
  { date: "2024-04-24", survey: 387, health_camps: 290 },
  { date: "2024-04-25", survey: 215, health_camps: 250 },
  { date: "2024-04-26", survey: 75, health_camps: 130 },
  { date: "2024-04-27", survey: 383, health_camps: 420 },
  { date: "2024-04-28", survey: 122, health_camps: 180 },
  { date: "2024-04-29", survey: 315, health_camps: 240 },
  { date: "2024-04-30", survey: 454, health_camps: 380 },
  { date: "2024-05-01", survey: 165, health_camps: 220 },
  { date: "2024-05-02", survey: 293, health_camps: 310 },
  { date: "2024-05-03", survey: 247, health_camps: 190 },
  { date: "2024-05-04", survey: 385, health_camps: 420 },
  { date: "2024-05-05", survey: 481, health_camps: 390 },
  { date: "2024-05-06", survey: 498, health_camps: 520 },
  { date: "2024-05-07", survey: 388, health_camps: 300 },
  { date: "2024-05-08", survey: 149, health_camps: 210 },
  { date: "2024-05-09", survey: 227, health_camps: 180 },
  { date: "2024-05-10", survey: 293, health_camps: 330 },
  { date: "2024-05-11", survey: 335, health_camps: 270 },
  { date: "2024-05-12", survey: 197, health_camps: 240 },
  { date: "2024-05-13", survey: 197, health_camps: 160 },
  { date: "2024-05-14", survey: 448, health_camps: 490 },
  { date: "2024-05-15", survey: 473, health_camps: 380 },
  { date: "2024-05-16", survey: 338, health_camps: 400 },
  { date: "2024-05-17", survey: 499, health_camps: 420 },
  { date: "2024-05-18", survey: 315, health_camps: 350 },
  { date: "2024-05-19", survey: 235, health_camps: 180 },
  { date: "2024-05-20", survey: 177, health_camps: 230 },
  { date: "2024-05-21", survey: 82, health_camps: 140 },
  { date: "2024-05-22", survey: 81, health_camps: 120 },
  { date: "2024-05-23", survey: 252, health_camps: 290 },
  { date: "2024-05-24", survey: 294, health_camps: 220 },
  { date: "2024-05-25", survey: 201, health_camps: 250 },
  { date: "2024-05-26", survey: 213, health_camps: 170 },
  { date: "2024-05-27", survey: 420, health_camps: 460 },
  { date: "2024-05-28", survey: 233, health_camps: 190 },
  { date: "2024-05-29", survey: 78, health_camps: 130 },
  { date: "2024-05-30", survey: 340, health_camps: 280 },
  { date: "2024-05-31", survey: 178, health_camps: 230 },
  { date: "2024-06-01", survey: 178, health_camps: 200 },
  { date: "2024-06-02", survey: 470, health_camps: 410 },
  { date: "2024-06-03", survey: 103, health_camps: 160 },
  { date: "2024-06-04", survey: 439, health_camps: 380 },
  { date: "2024-06-05", survey: 88, health_camps: 140 },
  { date: "2024-06-06", survey: 294, health_camps: 250 },
  { date: "2024-06-07", survey: 323, health_camps: 370 },
  { date: "2024-06-08", survey: 385, health_camps: 320 },
  { date: "2024-06-09", survey: 438, health_camps: 480 },
  { date: "2024-06-10", survey: 155, health_camps: 200 },
  { date: "2024-06-11", survey: 92, health_camps: 150 },
  { date: "2024-06-12", survey: 492, health_camps: 420 },
  { date: "2024-06-13", survey: 81, health_camps: 130 },
  { date: "2024-06-14", survey: 426, health_camps: 380 },
  { date: "2024-06-15", survey: 307, health_camps: 350 },
  { date: "2024-06-16", survey: 371, health_camps: 310 },
  { date: "2024-06-17", survey: 475, health_camps: 520 },
  { date: "2024-06-18", survey: 107, health_camps: 170 },
  { date: "2024-06-19", survey: 341, health_camps: 290 },
  { date: "2024-06-20", survey: 408, health_camps: 450 },
  { date: "2024-06-21", survey: 169, health_camps: 210 },
  { date: "2024-06-22", survey: 317, health_camps: 270 },
  { date: "2024-06-23", survey: 480, health_camps: 530 },
  { date: "2024-06-24", survey: 132, health_camps: 180 },
  { date: "2024-06-25", survey: 141, health_camps: 190 },
  { date: "2024-06-26", survey: 434, health_camps: 380 },
  { date: "2024-06-27", survey: 448, health_camps: 490 },
  { date: "2024-06-28", survey: 149, health_camps: 200 },
  { date: "2024-06-29", survey: 103, health_camps: 160 },
  { date: "2024-06-30", survey: 446, health_camps: 400 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },

  survey: {
    label: "Surveyed Households",
    color: "#48A6A7",
  },

  health_camps: {
    label: "Health Camp Held",
    color: "#8F87F1",
  }
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    (<Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Surveyed Households & Health Camp Analytics</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex">
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-survey)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-survey)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-health_camps)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-health_camps)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }} />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot" />
              } />
            <Area
              dataKey="health_camps"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-health_camps)"
              stackId="a" />
            <Area
              dataKey="survey"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-survey)"
              stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>)
  );
}
