import { Box, Container, makeStyles, Typography } from "@material-ui/core";
import Head from "next/head";
import Copyright from "../../components/copyright";
import Header from "../../components/header";
import PostHeaderImage from "../../components/post-header-image";
import { getAllPostsWithSlug, getPost } from "../../lib/api";
import Constants from "../../lib/consts";

const featuredImage = (post) => {
  return post ? (
    <PostHeaderImage
      url={post.featuredImage?.node.sourceUrl}
      height={post.featuredImage?.node.mediaDetails?.height}
      width={post.featuredImage?.node.mediaDetails?.width}
    />
  ) : (
    <></>
  );
};

const Post = ({ post, preview }) => {
  const useStyles = makeStyles(() => ({
    rootPosition: {
      position: "relative"
    },
    postHeading: {
      position: "absolute",
      top: "1em",
      left: "1em",
      width: "50%",
      lineHeight: "1.3"
    },
    postHeadingSpan: {
      backgroundColor: "red",
      color: "white"
    }
  }));
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>
          {post?.title} | {Constants.SITE_NAME}
        </title>
      </Head>
      <Header element="p" />
      <Container maxWidth="sm">
        <Box my={4} className={classes.rootPosition}>
          <Typography
            variant="h5"
            component="h1"
            className={classes.postHeading}
          >
            <span className={classes.postHeadingSpan}>{post?.title}</span>
          </Typography>
          {featuredImage(post)}
          <div dangerouslySetInnerHTML={{ __html: post?.content }}></div>
          <Copyright />
        </Box>
      </Container>
    </>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  const data = await getPost(params.slug, preview, previewData);

  return {
    props: {
      preview,
      post: data.post
    },
    revalidate: 60
  };
}

export async function getStaticPaths() {
  const allPosts = await getAllPostsWithSlug();

  return {
    paths: allPosts.edges.map(({ node }) => `/posts/${node.slug}`) || [],
    fallback: true
  };
}

export default Post;
