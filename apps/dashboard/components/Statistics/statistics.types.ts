// Types
export type Stat = {
  label: string
  stats: string
  progress: number
  color: string
}

export type TrafficData = {
  Name: string
  Uv: number
  Pv: number
}

export type EmailDeliveryData = {
  Month: string
  Sent: number
  Delivered: number
  Failed: number
}

export type BounceRateData = {
  Date: string
  BounceRate: number | null
}

export type APIUsageData = {
  Period: string
  Requests: number
  Errors: number
}

export type EmailEngagementData = {
  Date: string
  OpenRate: number
  ClickRate: number
}

export type PerformanceData = {
  Time: string
  AvgResponseTime: number
  ServerErrors: number
}

export type ProviderActivityData = { // New type
  ProviderId: string
  ApiCalls: number
  LastActive: string
}

export type CostData = {
  Month: string
  Cost: number
}
