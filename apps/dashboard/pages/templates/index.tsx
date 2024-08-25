import type { NextPage } from 'next'
import { withTabs } from 'hocs/withTabs'
import { withAuth } from 'hocs/withAuth'
import EmailTemplates from 'components/EmailTemplates/EmailTemplates'

const Templates: NextPage = () => {
  return (
    <>
      <EmailTemplates />
    </>
  )
}

export default withTabs(withAuth(Templates))
