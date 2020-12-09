import { Box } from "@chakra-ui/react";

export type WrapperProps = {
  variant?: "small" | "regular";
};

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box maxW={variant === "regular" ? "lg" : "sm"} mx="auto" mt={8} w="100%">
      {children}
    </Box>
  );
};

export default Wrapper;
