import { GetArticlesQuery } from 'src/gql/graphql'
import { GET_ARTICLES } from 'src/queries/queries'
import { Articles } from 'src/components/Articles'
import { isVerifyEmailAddress } from 'src/lib/utils/isVerifyEmailAddress'
import { initializeApollo } from 'src/lib/apolloClient'
import { getServerSession } from 'next-auth'

const Page = async () => {
  const session = await getServerSession()
  const { data } = await initializeApollo().query<GetArticlesQuery>({
    query: GET_ARTICLES,
    context: {
      fetchOptions: {
        next: { revalidate: 1 },
      },
    },
  })
  if (session === null) return 'Access Denied'

  if (!isVerifyEmailAddress(session.user?.email)) return 'Access Denied'


  return <Articles articles={data?.articles} />
}

export default Page
