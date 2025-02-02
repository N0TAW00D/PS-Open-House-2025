"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { Gift, GraduationCap, Stethoscope, Pill, PencilRuler, DraftingCompass, Cpu, BookOpenText, Dumbbell, Clapperboard, Palette, Coins, Scale, Globe, Sun, CloudSun, Bot, Heart, Earth, Component } from "lucide-react"
import { baseNames } from "@/utils/baseMapping"

const baseIcons = {
  'base0': Gift, // จุดรับของที่ระลึก
  'base2': GraduationCap, // 4 หลักสูตร (วิชาการ)
  'base3': Dumbbell, // แผนฯ เตรียมมนุษย์-ครุศาสตร์ การกีฬา
  'base4': Palette, // แผนฯ เตรียมศิลปกรรม
  'base5': Bot, // ห้องเรียนวิทย์-เทคโนโลยี #หุ่นยนต์
  'base6': Clapperboard, // แผนฯ เตรียมนิเทศ
  'base7': Component, // โครงการภาคภาษาอังกฤษ
  'base8': Scale, // แผนฯ เตรียมนิติ-รัฐศาสตร์
  'base9': BookOpenText, // แผนฯ เตรียมมนุษย์-ครุศาสตร์
  'base910': Heart, // ห้องเรียนเตรียมแพทย์ ม.ต้น
  'base911': Coins, // แผนฯ เตรียมบริหารธุรกิจ บัญชี และการบริการ
  'base912': Pill, // แผนฯ เตรียมเภสัช-สหเวช
  'base913': Stethoscope, // แผนฯ เตรียมแพทย์
  'base914': Cpu, // แผนฯ เตรียมวิทย์คอม
  'base915': PencilRuler, // แผนฯ เตรียมวิศวะ
  'base916': DraftingCompass, // แผนฯ เตรียมสถาปัตย์
  'base917': Earth, // ห้องเรียน Inter
  'basemeeting1': Sun, // IEP / GP รอบเช้า เวลา 10.00 - 12.00 น.
  'basemeeting2': CloudSun // IP / EP รอบเช้า เวลา 13.00 - 15.00 น.
} as const;


type BaseKey = keyof typeof baseIcons;

interface BaseCount {
  base_number: string;
  count: number;
}

interface ChartComponentProps {
  baseCounts10: BaseCount[];
  baseCounts11: BaseCount[];
  uniqueUsers10: number;
  uniqueUsers11: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }> | any;
  label?: BaseKey;
}

interface CustomXAxisTickProps {
  x?: number;
  y?: number;
  payload: {
    value: BaseKey;
  };
  visibleTicksCount?: number;
  tickFormatter?: (value: any) => any;
}

export function ChartComponent({
  baseCounts10,
  baseCounts11,
  uniqueUsers10,
  uniqueUsers11,
}: ChartComponentProps) {
  const chartData = Object.keys(baseNames)
    .sort((a, b) => {
      const numA = parseInt(a.replace('base', ''));
      const numB = parseInt(b.replace('base', ''));
      return numA - numB;
    })
    .map(baseKey => {
      const baseKeyTyped = baseKey as keyof typeof baseNames;
      const base910 = baseCounts10.find((b) => b.base_number === baseKey) || { count: 0 };
      const base911 = baseCounts11.find((b) => b.base_number === baseKey) || { count: 0 };

      return {
        base: baseKey,
        baseName: baseNames[baseKeyTyped],
        day10: base910.count,
        day11: base911.count,
      };
    });

  const chartConfig = {
    views: {
      label: "Base Counts",
    },
    day10: {
      label: "10 มกราคม 2568",
      color: "hsl(var(--chart-1))",
    },
    day11: {
      label: "11 มกราคม 2568",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const [activeChart, setActiveChart] = React.useState<"day10" | "day11">("day10");

  const total = React.useMemo(
    () => ({
      day10: uniqueUsers10,
      day11: uniqueUsers11,
    }),
    [uniqueUsers10, uniqueUsers11]
  );

  const CustomXAxisTick: React.FC<CustomXAxisTickProps> = ({ x, y, payload }) => {
    const IconComponent = baseIcons[payload.value];
    return (
      <g transform={`translate(${x},${y})`}>
        {IconComponent && <IconComponent className="h-4 w-4" x={-12} y={0} />}
      </g>
    );
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload?.length && label) {
      const baseName = baseNames[label];
      const IconComponent = baseIcons[label];

      return (
        <div className="bg-white p-2 rounded shadow-lg border">
          <div className="flex items-center gap-2 mb-2">
            {IconComponent && <IconComponent className="h-4 w-4" />}
            <span className="font-bold">{baseName}</span>
          </div>
          <p className="text-sm">
            จำนวนผู้เข้าชม: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomAxisTick = (props: CustomXAxisTickProps) => {
    const { x, y, payload } = props;
    const IconComponent = baseIcons[payload.value];
    return (
      <g transform={`translate(${x},${y})`}>
        {IconComponent && <IconComponent className="h-4 w-4" x={-12} y={0} />}
      </g>
    );
  };

  return (
    <Card className="flex-grow">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-blue-800">จำนวนผู้เข้าชม</CardTitle>
          <CardDescription>บูธนิทรรศการ กิจกรรม</CardDescription>
        </div>
        <div className="flex">
          {["day10", "day11"].map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key as "day10" | "day11")}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[key as "day10" | "day11"].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {total[key as "day10" | "day11"].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="mt-4 sm:p-6 flex items-center">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              bottom: 0
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="base"
              tickLine={false}
              axisLine={false}
              tick={renderCustomAxisTick}
              interval={0}
              height={60}
            />
            <ChartTooltip content={CustomTooltip} />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}