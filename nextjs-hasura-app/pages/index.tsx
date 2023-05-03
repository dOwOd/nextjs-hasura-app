import type { NextPage } from 'next'
import { Layout } from '../components/Layout'
import Image from 'next/image'
import CaroImage from '../public/images/IMG_4236.png'

const Home: NextPage = () => {
  return (
    <Layout title='top'>
      <Image src={CaroImage} alt='top image'/>
      <h1>
        top
      </h1>
    </Layout>
  )
}

export default Home
