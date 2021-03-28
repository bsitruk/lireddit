import { Box } from "@chakra-ui/layout";
import NavBar from "./NavBar";
import Wrapper, { WrapperVariant } from "./Wrapper";

type LayoutProps = WrapperVariant;

export const Layout: React.FC<LayoutProps> = ({
  variant = "regular",
  children,
}) => {
  return (
    <>
      <Box pos="sticky" top={0} zIndex="sticky">
        <NavBar />
      </Box>
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

export default Layout;
