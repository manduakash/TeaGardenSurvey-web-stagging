"use client"

import { TrendingUp } from "lucide-react"
import {
  BarChart,
  Bar,
  CartesianGrid,
  Rectangle,
  XAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const defaultColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
]

export function SugarReportChart({
  title = "Blood Sugar Report",
  description = "Low & High Sugar by Gender",
  data,
}) {
  const chartData = data.map((d, i) => ({
    ...d,
    fill: d.fill ?? defaultColors[i % defaultColors.length],
  }))

  const chartConfig = {
    low: { label: "Low Sugar" },
    high: { label: "High Sugar" },
    ...Object.fromEntries(
      chartData.map((d) => [
        d.label.toLowerCase(),
        { label: d.label, color: d.fill },
      ])
    ),
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="low"
              fill="hsl(var(--chart-4))"
              radius={[6, 6, 0, 0]}
              activeBar={(props) => (
                <Rectangle
                  {...props}
                  stroke={props.fill}
                  fillOpacity={0.9}
                  strokeDasharray={4}
                />
              )}
            />
            <Bar
              dataKey="high"
              fill="hsl(var(--chart-2))"
              radius={[6, 6, 0, 0]}
              activeBar={(props) => (
                <Rectangle
                  {...props}
                  stroke={props.fill}
                  fillOpacity={0.9}
                  strokeDasharray={4}
                />
              )}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Blood Sugar status by gender over the recent survey
        </div>
      </CardFooter>
    </Card>
  )
}
