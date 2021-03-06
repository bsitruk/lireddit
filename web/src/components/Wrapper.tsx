import { Box } from "@chakra-ui/react";

export type WrapperVariant = {
  variant?: "small" | "regular";
};

type WrapperProps = WrapperVariant & {};

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
