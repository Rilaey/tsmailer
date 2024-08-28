import type { NextPage } from 'next'
import { withAuth } from 'hocs/withAuth'
import { withSettings } from 'hocs/withSettings'
import Subscriptions from 'components/Settings/Subscriptions/Subscriptions'

const SubscriptionPage: NextPage = () => {
  return <Subscriptions />
}

export default withAuth(withSettings(SubscriptionPage))
