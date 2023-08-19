import { Timer } from 'src/components/Timer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prototypes',
}

const Page = () => (
  <article>
    <h1>Timer</h1>
    <Timer />
  </article>
)

export default Page
