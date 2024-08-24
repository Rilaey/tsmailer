import React from "react";
import "@mantine/charts/styles.css";
import { Text, Flex } from "@mantine/core";
import { LineChart, AreaChart, BarChart } from "@mantine/charts";
import { useMediaQuery } from "@mantine/hooks";
import { ChartPaper } from "./ChartPaper/ChartPaper";
import { useStatistics } from "./useStatistics";
import { StatsRing } from "./StatsRing/StatsRing";

export default function Statistics() {
  const isTabletOrMobile = useMediaQuery("(max-width: 1200px)");
  const graphWidth = isTabletOrMobile ? "100%" : "32.5%";
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

  return (
    <>
      <StatsRing loading={platformStats.length === 0} stats={platformStats} />
      <Text>This months statistics</Text>
      <Flex justify="space-between" mt="md" wrap="wrap" gap="sm">
        <ChartPaper
          title="Emails"
          width={graphWidth}
          minWidth={graphMinWidth}
          loading={emailDeliveryData.length === 0}
        >
          <BarChart
            h={graphHeight}
            w="100%"
            data={emailDeliveryData}
            dataKey="Month"
            series={[
              { name: "Sent", color: "violet.6" },
              { name: "Delivered", color: "blue.6" },
              { name: "Failed", color: "red.6" }
            ]}
            tickLine="y"
          />
        </ChartPaper>

        <ChartPaper
          title="Traffic"
          width={graphWidth}
          minWidth={graphMinWidth}
          loading={trafficData.length === 0}
        >
          <LineChart
            h={graphHeight}
            w="100%"
            data={trafficData}
            dataKey="Name"
            withRightYAxis
            yAxisLabel="Uv"
            rightYAxisLabel="Pv"
            series={[
              { name: "Uv", color: "pink.6" },
              { name: "Pv", color: "violet.6", yAxisId: "right" }
            ]}
          />
        </ChartPaper>

        <ChartPaper
          title="Bounce Rate"
          width={graphWidth}
          minWidth={graphMinWidth}
          loading={bounceRateData.length === 0}
        >
          <AreaChart
            h={graphHeight}
            w="100%"
            data={bounceRateData}
            dataKey="Date"
            series={[{ name: "BounceRate", color: "indigo.6" }]}
            curveType="linear"
            connectNulls
          />
        </ChartPaper>

        <ChartPaper
          title="API Usage"
          width={graphWidth}
          minWidth={graphMinWidth}
          loading={apiUsageData.length === 0}
        >
          <BarChart
            h={graphHeight}
            w="100%"
            data={apiUsageData}
            dataKey="Period"
            series={[
              { name: "Requests", color: "teal.6" },
              { name: "Errors", color: "red.6" }
            ]}
            tickLine="y"
          />
        </ChartPaper>

        <ChartPaper
          title="Email Engagement"
          width={graphWidth}
          minWidth={graphMinWidth}
          loading={emailEngagementData.length === 0}
        >
          <LineChart
            h={graphHeight}
            w="100%"
            data={emailEngagementData}
            dataKey="Date"
            series={[
              { name: "OpenRate", color: "orange.6" },
              { name: "ClickRate", color: "green.6" }
            ]}
          />
        </ChartPaper>

        <ChartPaper
          title="Performance"
          width={graphWidth}
          minWidth={graphMinWidth}
          loading={performanceData.length === 0}
        >
          <LineChart
            h={graphHeight}
            w="100%"
            data={performanceData}
            dataKey="Time"
            series={[
              { name: "AvgResponseTime", color: "blue.6" },
              { name: "ServerErrors", color: "red.6" }
            ]}
          />
        </ChartPaper>

        <ChartPaper
          title="Provider Activity"
          width={graphWidth}
          minWidth={graphMinWidth}
          loading={providerActivityData.length === 0}
        >
          <BarChart
            h={graphHeight}
            w="100%"
            data={providerActivityData}
            dataKey="ProviderId"
            series={[{ name: "ApiCalls", color: "cyan.6" }]}
            tickLine="y"
          />
        </ChartPaper>

        <ChartPaper
          title="Cost"
          width={graphWidth}
          minWidth={graphMinWidth}
          loading={costData.length === 0}
        >
          <BarChart
            h={graphHeight}
            w="100%"
            data={costData}
            dataKey="Month"
            series={[
              { name: "Month", color: "violet.6" },
              { name: "Cost", color: "blue.6" }
            ]}
            tickLine="y"
          />
        </ChartPaper>
      </Flex>
    </>
  );
}
