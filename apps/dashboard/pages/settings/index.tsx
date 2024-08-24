import type { NextPage } from 'next'
import { withAuth } from 'hocs/withAuth'
import { withSettings } from 'hocs/withSettings'
import General from 'components/Settings/General/General'

const SettingsPage: NextPage = () => {
  return <General />
}

export default withAuth(withSettings(SettingsPage))
