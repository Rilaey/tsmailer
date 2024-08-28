import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export default async function statistics(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const data = {
    platformStats: [
      {
        label: 'API Requests',
        stats: '456,578',
        progress: 85,
        color: 'violet',
      },
      { label: 'Emails Sent', stats: '123,456', progress: 70, color: 'blue' },
      { label: 'Delivery Rate', stats: '98%', progress: 98, color: 'green' },
    ],
    trafficData: [
      { Name: 'Monday', Uv: 5000, Pv: 2400 },
      { Name: 'Tuesday', Uv: 3000, Pv: 1398 },
      { Name: 'Wednesday', Uv: 4000, Pv: 9800 },
      { Name: 'Thursday', Uv: 2780, Pv: 3908 },
      { Name: 'Friday', Uv: 1890, Pv: 4800 },
      { Name: 'Saturday', Uv: 2390, Pv: 3800 },
      { Name: 'Sunday', Uv: 3490, Pv: 4300 },
      { Name: 'Monday (Previous Week)', Uv: 4800, Pv: 2200 },
      { Name: 'Tuesday (Previous Week)', Uv: 3100, Pv: 1400 },
    ],
    emailDeliveryData: [
      { Month: 'January', Sent: 1200, Delivered: 1100, Failed: 100 },
      { Month: 'February', Sent: 1900, Delivered: 1800, Failed: 100 },
      { Month: 'March', Sent: 4000, Delivered: 3500, Failed: 500 },
      { Month: 'April', Sent: 5000, Delivered: 4800, Failed: 200 },
      { Month: 'May', Sent: 6000, Delivered: 5900, Failed: 100 },
      { Month: 'June', Sent: 7500, Delivered: 7400, Failed: 100 },
      { Month: 'July', Sent: 8000, Delivered: 7800, Failed: 200 },
      { Month: 'August', Sent: 8500, Delivered: 8400, Failed: 100 },
    ],
    bounceRateData: [
      { Date: 'Mar 22', BounceRate: 5 },
      { Date: 'Mar 23', BounceRate: 3 },
      { Date: 'Mar 24', BounceRate: 4 },
      { Date: 'Mar 25', BounceRate: null },
      { Date: 'Mar 26', BounceRate: null },
      { Date: 'Mar 27', BounceRate: 2 },
      { Date: 'Mar 28', BounceRate: 1 },
      { Date: 'Mar 29', BounceRate: 3 },
      { Date: 'Mar 30', BounceRate: 4 },
    ],
    apiUsageData: [
      { Period: 'Week 1', Requests: 1500, Errors: 20 },
      { Period: 'Week 2', Requests: 1800, Errors: 25 },
      { Period: 'Week 3', Requests: 2200, Errors: 15 },
      { Period: 'Week 4', Requests: 2000, Errors: 30 },
      { Period: 'Week 5', Requests: 2500, Errors: 35 },
    ],
    emailEngagementData: [
      { Date: '2024-08-01', OpenRate: 45, ClickRate: 10 },
      { Date: '2024-08-02', OpenRate: 50, ClickRate: 12 },
      { Date: '2024-08-03', OpenRate: 48, ClickRate: 11 },
      { Date: '2024-08-04', OpenRate: 52, ClickRate: 13 },
      { Date: '2024-08-05', OpenRate: 55, ClickRate: 15 },
    ],
    performanceData: [
      { Time: '08:00', AvgResponseTime: 120, ServerErrors: 2 },
      { Time: '12:00', AvgResponseTime: 110, ServerErrors: 3 },
      { Time: '16:00', AvgResponseTime: 100, ServerErrors: 1 },
      { Time: '20:00', AvgResponseTime: 130, ServerErrors: 4 },
      { Time: '00:00', AvgResponseTime: 140, ServerErrors: 5 },
    ],
    providerActivityData: [
      { Provider: 'Gmail(nickname)', ApiCalls: 1200, LastActive: '2024-08-23' },
      { Provider: 'Yahoo(nickname)', ApiCalls: 1500, LastActive: '2024-08-22' },
      { Provider: 'Outlook(nickname)', ApiCalls: 1000, LastActive: '2024-08-21' },
      { Provider: 'ICloud(nickname)', ApiCalls: 800, LastActive: '2024-08-20' },
      { Provider: 'Gmail(other acct)', ApiCalls: 600, LastActive: '2024-08-19' },
    ],
    costData: [
      { Month: 'August', Cost: 200 },
      { Month: 'September', Cost: 200 },
      { Month: 'October', Cost: 220 },
      { Month: 'November', Cost: 180 },
    ],
  }

  return res.status(200).json(data)
}
