import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { PostFieldsFragment, useVoteMutation } from "../generated/graphql";

export type PostProps = {
  post: PostFieldsFragment;
};

type VoteMutationArg = Parameters<ReturnType<typeof useVoteMutation>[0]>[0];

function generateVoteArgs(
  post: PostFieldsFragment,
  value: number
): VoteMutationArg {
  return {
    variables: { value, postId: post.id },
    update: (cache) => {
      cache.modify({
        id: cache.identify(post),
        fields: {
          points(prevPoints) {
            const incValue = post.voteStatus == null ? value : 2 * value;
            return prevPoints + incValue;
          },
        },
      });
    },
  };
}

export const Post: React.FC<PostProps> = ({ post }) => {
  const [vote] = useVoteMutation({
    onError: (error) => console.log(error.message),
  });

  return (
    <Flex p={5} shadow="md" borderWidth={1}>
      <Flex
        flexDirection="column"
        mr={4}
        justifyContent="space-around"
        alignItems="center"
        flexShrink={0}
      >
        <IconButton
          aria-label="Up vote"
          icon={<ChevronUpIcon />}
          onClick={() => vote(generateVoteArgs(post, 1))}
        />
        <Text fontSize="lg" fontWeight="bold">
          {post.points}
        </Text>
        <IconButton
          aria-label="Down vote"
          icon={<ChevronDownIcon />}
          onClick={() => vote(generateVoteArgs(post, -1))}
        />
      </Flex>
      <Box>
        <Heading fontSize="xl">{post.title}</Heading>
        <Text mt={4}>{post.textSnippet}</Text>
        <Text mt={4} textColor="gray.500" fontStyle="italic">
          posted by {post.author.username}
        </Text>
      </Box>
    </Flex>
  );
};

export default Post;
