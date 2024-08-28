import type { NextPage } from 'next'
import { withAuth } from 'hocs/withAuth'
import CreateTemplate from 'components/EmailTemplates/CreateTemplate'

const Template: NextPage = () => {
  return <CreateTemplate />
}

export default withAuth(Template)
