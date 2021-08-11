export interface CallGraphCMS {
  (query: string): Promise<unknown>
}

export type PostsTotal = {
  data: {
    postsConnection: {
      aggregate: {
        count: number
      }
    }
  }
}

export type IndexPostsData = {
  data: {
    posts: {
      author: {
        name: string
      }
      excerpt: string
      slug: string
      title: string
      coverImage: iCoverImage
    }[]
    postsConnection: {
      aggregate: {
        count: number
      }
    }
  }
}
export type PostData = IndexPostsData & {
  data: {
    post: {
      content: {
        html: string
      }
    }
  }
}

export type PostSlugs = {
  data: {
    posts: {
      slug: string
    }[]
  }
}

export type Author = {
  name: string
}
export type PostExcerpt = {
  author: Author
  excerpt: string
  slug: string
  title: string
  coverImage: iCoverImage
}

export interface HomePageHeroes {
  data: {
    homePageHeroes: HomePageHero[]
  }
}

export interface HomePageHero {
  backgroundImage: {
    url: string
    width: number
    height: number
  }
  lineOneText: string
  lineTwoText: string
}

export interface HomePageCards {
  data: {
    homePageCards: HomePageCard[]
  }
}

export interface HomePageCard {
  image: {
    url: string
    width: number
    height: number
    caption: string
  }
  url: string
  text: string
}
