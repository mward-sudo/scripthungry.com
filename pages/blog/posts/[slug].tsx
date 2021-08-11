import { FC, useState, useEffect } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { sanitize as sanitizer } from 'isomorphic-dompurify'
import hljs from 'highlight.js'
import javascript from 'highlight.js/lib/languages/javascript'
import Button from '@/components/button'
import PostHeader from '@/components/blog/post-header'
import { getPostBySlug } from '@/lib/blog/post'
import { getAllPostSlugs } from '@/lib/blog/post-slugs'
import {
  iNavigationLinks,
  iPost,
  iPostData,
  iPostSlugs,
} from '@/types/graphcms-api'
import getNavigationLinks from '@/lib/navigation-links'
import Loader from '@/components/loader'
import PostLayout from '@/components/blog/layout'

hljs.registerLanguage('javascript', javascript)

const Disqus = dynamic(() => import('@/components/blog/disqus'), {
  loading: () => (
    <div className="text-center">
      <Loader />
    </div>
  ),
})

type PostProps = {
  post: iPost
  navLinks: iNavigationLinks
}

const Post: FC<PostProps> = ({ post, navLinks }) => {
  const [showComments, setShowComments] = useState(false)

  const router = useRouter()

  useEffect(() => {
    hljs.initHighlighting()
  }, [])

  return (
    <>
      <PostLayout post={post} navLinks={navLinks}>
        <div className="mt-8 overflow-hidden p-2">
          <div className="-m-2">
            <PostHeader title={post?.title} image={post?.coverImage} />
          </div>
        </div>
        <div className="flex items-center m-0 mt-8">
          <Image
            src={post?.author.picture.url}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="ml-4 font-extralight">{post?.author.name}</div>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: sanitizer(post?.content?.html) }}
        />
        <div className="my-16">
          {showComments ? (
            <Disqus
              key={post?.slug}
              pageTitle={post?.title}
              pageID={post?.slug}
              pageURL={`https://scripthungry.com${router.asPath}`}
            />
          ) : (
            <Button
              variant="secondary"
              onClick={() => setShowComments(true)}
              text="Show Comments"
              width="full"
            />
          )}
        </div>
      </PostLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const navLinks = await getNavigationLinks()

  let slug = ''
  if (params !== undefined && params.slug !== undefined) {
    if (typeof params.slug === 'string') {
      slug = params.slug
    } else if (typeof params.slug === 'object') {
      // eslint-disable-next-line prefer-destructuring
      slug = params.slug[0]
    }
  }

  const post: iPostData = await getPostBySlug(slug)
  return {
    props: {
      post: post?.data.post,
      navLinks,
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postSlugs: iPostSlugs | null = await getAllPostSlugs()
  const paths: Array<string> =
    postSlugs !== null
      ? postSlugs?.data.posts.map((post) => `/blog/posts/${post.slug}`)
      : []

  return {
    paths,
    fallback: true,
  }
}

export default Post
