import { Flex, Link, HStack, Box, Spinner } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

export type NavBarProps = {};

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const { data, loading } = useMeQuery();
  const [logout, { loading: logoutLoading }] = useLogoutMutation({
    update: (cache) => {
      cache.modify({
        fields: {
          me() {
            return null;
          },
        },
      });
    },
  });
  let body = null;

  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <>
        <Box>{data.me.username}</Box>
        <Link onClick={() => logout()}>logout</Link>
        {logoutLoading && <Spinner />}
      </>
    );
  }

  return (
    <Flex bg="yellowgreen" p={4}>
      <HStack spacing="24px" ml="auto">
        {body}
      </HStack>
    </Flex>
  );
};

export default NavBar;
