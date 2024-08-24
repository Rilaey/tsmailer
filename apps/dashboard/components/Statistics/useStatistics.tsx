import { useState, useEffect } from 'react'
import {
  Stat,
  TrafficData,
  EmailDeliveryData,
  BounceRateData,
  APIUsageData,
  EmailEngagementData,
  PerformanceData,
  ProviderActivityData, // Updated import
  CostData,
} from './statistics.types'

// Custom Hook
export function useStatistics() {
  const [platformStats, setPlatformStats] = useState<Stat[]>([])
  const [trafficData, setTrafficData] = useState<TrafficData[]>([])
  const [emailDeliveryData, setEmailDeliveryData] = useState<
    EmailDeliveryData[]
  >([])
  const [bounceRateData, setBounceRateData] = useState<BounceRateData[]>([])
  const [apiUsageData, setApiUsageData] = useState<APIUsageData[]>([])
  const [emailEngagementData, setEmailEngagementData] = useState<
    EmailEngagementData[]
  >([])
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [providerActivityData, setProviderActivityData] = useState<ProviderActivityData[]>([]) // Updated state
  const [costData, setCostData] = useState<CostData[]>([])

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/example/statistics')
      const data = await response.json()

      setPlatformStats(data.platformStats)
      setTrafficData(data.trafficData)
      setEmailDeliveryData(data.emailDeliveryData)
      setBounceRateData(data.bounceRateData)
      setApiUsageData(data.apiUsageData)
      setEmailEngagementData(data.emailEngagementData)
      setPerformanceData(data.performanceData)
      setProviderActivityData(data.providerActivityData) // Updated data handling
      setCostData(data.costData)
    }

    fetchData()
  }, [])

  return {
    platformStats,
    trafficData,
    emailDeliveryData,
    bounceRateData,
    apiUsageData,
    emailEngagementData,
    performanceData,
    providerActivityData, // Updated return value
    costData,
  }
}
