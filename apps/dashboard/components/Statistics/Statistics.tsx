import React from "react";
import "@mantine/charts/styles.css";
import { Text, Flex } from "@mantine/core";
import { LineChart, AreaChart, BarChart } from "@mantine/charts";
import { useMediaQuery } from "@mantine/hooks";
import { ChartPaper } from "./ChartPaper/ChartPaper";
import { useStatistics } from "./useStatistics";
import { StatsRing } from "./StatsRing/StatsRing";

export default function Statistics() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1200px) and (min-width: 769px)");

  const graphWidth = isMobile ? "100%" : isTablet ? "48%" : "32.5%";
  const graphHeight = 200;
  const graphMinWidth = 200;

  const {
    platformStats,
    trafficData,
    emailDeliveryData,
    bounceRateData,
    apiUsageData,
    emailEngagementData,
    performanceData,
    providerActivityData,
    costData
  } = useStatistics();

  const chartConfigs = [
    {
      title: "Emails",
      data: emailDeliveryData,
      chartType: BarChart,
      dataKey: "Month",
      series: [
        { name: "Sent", color: "violet.6" },
        { name: "Delivered", color: "blue.6" },
        { name: "Failed", color: "red.6" }
      ]
    },
    {
      title: "Traffic",
      data: trafficData,
      chartType: LineChart,
      dataKey: "Name",
      series: [
        { name: "Uv", color: "pink.6" },
        { name: "Pv", color: "violet.6", yAxisId: "right" }
      ],
      extraProps: {
        withRightYAxis: true,
        yAxisLabel: "Uv",
        rightYAxisLabel: "Pv"
      }
    },
    {
      title: "Bounce Rate",
      data: bounceRateData,
      chartType: AreaChart,
      dataKey: "Date",
      series: [{ name: "BounceRate", color: "indigo.6" }],
      extraProps: { curveType: "linear", connectNulls: true }
    },
    {
      title: "API Usage",
      data: apiUsageData,
      chartType: BarChart,
      dataKey: "Period",
      series: [
        { name: "Requests", color: "teal.6" },
        { name: "Errors", color: "red.6" }
      ]
    },
    {
      title: "Email Engagement",
      data: emailEngagementData,
      chartType: LineChart,
      dataKey: "Date",
      series: [
        { name: "OpenRate", color: "orange.6" },
        { name: "ClickRate", color: "green.6" }
      ]
    },
    {
      title: "Performance",
      data: performanceData,
      chartType: LineChart,
      dataKey: "Time",
      series: [
        { name: "AvgResponseTime", color: "blue.6" },
        { name: "ServerErrors", color: "red.6" }
      ]
    },
    {
      title: "Provider Activity",
      data: providerActivityData,
      chartType: BarChart,
      dataKey: "ProviderId",
      series: [{ name: "ApiCalls", color: "cyan.6" }]
    },
    {
      title: "Cost",
      data: costData,
      chartType: BarChart,
      dataKey: "Month",
      series: [
        { name: "Month", color: "violet.6" },
        { name: "Cost", color: "blue.6" }
      ]
    }
  ];

  return (
    <>
      <StatsRing loading={platformStats.length === 0} stats={platformStats} />
      <Text>{`This month's statistics`}</Text>
      <Flex justify="space-between" mt="md" wrap="wrap" gap="sm">
        {chartConfigs.map(
          ({
            title,
            data,
            chartType: ChartType,
            dataKey,
            series,
            extraProps = {}
          }) => (
            <ChartPaper
              key={title}
              title={title}
              width={graphWidth}
              minWidth={graphMinWidth}
              loading={data.length === 0}
            >
              {/* @ts-expect-error todo: fix props spread */}
              <ChartType
                h={graphHeight}
                w="100%"
                data={data}
                dataKey={dataKey}
                series={series}
                {...extraProps}
              />
            </ChartPaper>
          )
        )}
      </Flex>
    </>
  );
}
