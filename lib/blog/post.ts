import { iPostData } from '@/types/graphcms-api'
import { callGraphCMS } from '@/lib/graphcms-api'
import narrowType from '@/lib/narrow-type'

/**
 * Gets data for a single blog post, referenced by its' slug. Async
 */
export const getPostBySlug = async (slug: string): Promise<iPostData> => {
  /** GraphQL query to be executed */
  const query = `
    query PostQuery {
      post(where: {slug: "${slug}"}, stage: PUBLISHED) {
        author {
          name
          twitterHandle
          picture {
            url(transformation: {image: {resize: {height: 100, width: 100}}})
            height
            width
          }
        }
        content {
          html
        }
        coverImage {
          url
          height
          width
        }
        date
        excerpt
        slug
        title
      }
    }  
  `

  /** GraphQL JSON response */
  const response = await callGraphCMS(query)

  /** Return response or throw error if response is undefined OR null */
  if (narrowType<iPostData>(response)) return response
  throw new Error('No response from CMS for getPostBySlug')
}
