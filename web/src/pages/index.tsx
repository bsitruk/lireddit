import { Spinner } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import NavBar from "../components/NavBar";
import { PostsDocument, usePostsQuery } from "../generated/graphql";
import { addApolloState, initializeApollo } from "../utils/apolloClient";

export default function Index() {
  const { data, loading } = usePostsQuery();

  return (
    <>
      <NavBar />
      <div>hello world</div>
      <div>
        {loading ? (
          <Spinner />
        ) : (
          data?.posts.map((post) => <p key={post.id}>{post.title}</p>)
        )}
      </div>
    </>
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
