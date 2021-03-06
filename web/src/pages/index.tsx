import {
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { GetStaticProps } from "next";
import NextLink from "next/link";
import React from "react";
import Layout from "../components/Layout";
import Post from "../components/Post";
import { PostsDocument, usePostsQuery } from "../generated/graphql";
import { addApolloState, initializeApollo } from "../utils/apolloClient";

export default function Index() {
  const { data, loading, fetchMore } = usePostsQuery({
    variables: { limit: 10 },
    notifyOnNetworkStatusChange: true,
  });

  const { posts = [], hasMore = false } = data?.posts || {};

  let Body;
  if (!loading && !posts.length) {
    Body = <Text>There's no Posts to display</Text>;
  } else if (loading && !posts.length) {
    Body = <Spinner />;
  } else {
    Body = (
      <>
        <Stack spacing={8}>
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </Stack>

        <Flex my={8} justifyContent="center">
          {hasMore && (
            <Button
              isLoading={loading}
              onClick={() =>
                fetchMore({
                  variables: { cursor: posts[posts.length - 1].id },
                })
              }
            >
              Load More
            </Button>
          )}
        </Flex>
      </>
    );
  }

  return (
    <Layout>
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Heading>LiReddit</Heading>
        <NextLink href="/create-post">
          <Link>Create Post</Link>
        </NextLink>
      </Flex>
      <div>{Body}</div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: PostsDocument,
    variables: { limit: 10 },
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
};
