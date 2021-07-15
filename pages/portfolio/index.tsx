import { FC } from 'react'
import Head from 'next/head'
import Header from '@/components/header'
import { GetStaticProps } from 'next'
import getNavigationLinks from '@/lib/navigation-links'
import { NavigationLinks } from '@/types/navigations-links'

type IndexPropTypes = {
  navLinks: NavigationLinks
}

const Index: FC<IndexPropTypes> = ({ navLinks }) => (
  <>
    <Head>
      <title>Portfolio - Michael Ward</title>
    </Head>
    <Header element="p" navLinks={navLinks} />
    <div className="container mx-auto">
      <h1>Under development</h1>
    </div>
  </>
)

export const getStaticProps: GetStaticProps = async () => {
  const navLinks = await getNavigationLinks()

  return {
    props: { navLinks },
  }
}

export default Index
