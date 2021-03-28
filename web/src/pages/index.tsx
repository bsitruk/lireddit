import { Link, Spinner } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import NextLink from "next/link";
import React from "react";
import Layout from "../components/Layout";
import { PostsDocument, usePostsQuery } from "../generated/graphql";
import { addApolloState, initializeApollo } from "../utils/apolloClient";

export default function Index() {
  const { data, loading } = usePostsQuery();

  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>Create Post</Link>
      </NextLink>
      <div>
        {loading ? (
          <Spinner />
        ) : (
          data?.posts.map((post) => <p key={post.id}>{post.title}</p>)
        )}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: PostsDocument,
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
};
