import { FC } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getTotalPostsNumber } from '@/lib/blog/posts-total'
import { getIndexPosts } from '@/lib/blog/index-posts'
import Constants from '@/lib/consts'
import {
  iBlogCategories,
  iNavigationLinks,
  iPostExcerpt,
} from '@/types/graphcms-api'
import getNavigationLinks from '@/lib/navigation-links'
import BlogIndex from '@/components/blog'
import PostIndexLayout from '@/components/blog/post-index-layout'
import { getBlogCategories } from '@/lib/blog/categories'

type BlogIndexPageProps = {
  indexPosts: iPostExcerpt[]
  pagesTotal: number
  currentPage: number
  navLinks: iNavigationLinks
  categories: iBlogCategories
}

const BlogIndexPage: FC<BlogIndexPageProps> = ({
  indexPosts,
  pagesTotal,
  currentPage,
  navLinks,
  categories,
}) => (
  <PostIndexLayout
    pageTitle={`${Constants.SITE_NAME} Blog`}
    navLinks={navLinks}
  >
    <BlogIndex
      indexPosts={indexPosts}
      pagesTotal={pagesTotal}
      currentPage={currentPage}
      categories={categories}
    />
  </PostIndexLayout>
)

export const getStaticPaths: GetStaticPaths = async () => {
  const totalPosts = await getTotalPostsNumber()
  const totalPages = Math.ceil(totalPosts / Constants.POSTS_PER_PAGE)

  const paths = []

  /**
   * Start from page 2, so we don't replicate /blog
   * which is page 1
   */
  for (let page = 2; page <= totalPages; page += 1) {
    paths.push({ params: { page: page.toString() } })
  }

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Type wrangling
  let pageNo: number
  if (params?.page === typeof 'array') {
    pageNo = parseInt(params.page[0], 10)
  } else if (params?.page === typeof 'number') {
    pageNo = parseInt(params.page, 10)
  } else {
    pageNo = 2
  }

  const navLinks = await getNavigationLinks()
  const indexPosts = await getIndexPosts(pageNo)
  const postsTotal = indexPosts?.data.postsConnection.aggregate.count || 1
  const pagesTotal = Math.ceil(postsTotal / Constants.POSTS_PER_PAGE)
  const categoriesData = await getBlogCategories()
  const categories = categoriesData.data.blogCategories

  return {
    props: {
      indexPosts: indexPosts?.data.posts,
      pagesTotal,
      currentPage: pageNo,
      categories,
      navLinks,
    },
    revalidate: 60,
  }
}

export default BlogIndexPage
