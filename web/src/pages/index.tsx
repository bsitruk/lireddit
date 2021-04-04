import {
  Box,
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
import { PostsDocument, usePostsQuery } from "../generated/graphql";
import { addApolloState, initializeApollo } from "../utils/apolloClient";

export default function Index() {
  const { data, loading, fetchMore } = usePostsQuery({
    variables: { limit: 5 },
    notifyOnNetworkStatusChange: true,
  });

  let Body;
  if (!loading && !data?.posts) {
    Body = <Text>There's no Posts to display</Text>;
  } else if (loading && !data?.posts) {
    Body = <Spinner />;
  } else {
    Body = (
      <>
        <Stack spacing={8}>
          {data?.posts.map((post) => (
            <Box key={post.id} p={5} shadow="md" borderWidth={1}>
              <Heading fontSize="xl">{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
        <Flex my={8} justifyContent="center">
          <Button
            isLoading={loading}
            onClick={() =>
              fetchMore({
                variables: { cursor: data?.posts[data.posts.length - 1].id },
              })
            }
          >
            Load More
          </Button>
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
    variables: { limit: 5 },
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
};
