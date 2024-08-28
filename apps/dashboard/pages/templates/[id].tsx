import type { NextPage } from 'next'
import { withAuth } from 'hocs/withAuth'
import Page from 'components/common/Page/Page'
import { useRouter } from 'next/router'
import { useParams } from 'next/navigation'

const TemplateById: NextPage = () => {
    const {id} = useParams()
  return <Page>{id}</Page>
}

export default withAuth(TemplateById)
