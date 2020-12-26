import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Formik, Form } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { useTypedRouter } from "../../utils/useTypedRouter";

export type ChangePasswordProps = {};

const ChangePasswordSchema = Yup.object().shape({
  password: Yup.string().required(),
});

export const ChangePassword: React.FC<ChangePasswordProps> = ({}) => {
  const router = useTypedRouter<{ token: string }>();
  const { token } = router.query;
  const [tokenError, setTokenError] = useState("");

  const [changePassword] = useChangePasswordMutation({
    update: (cache, { data }) => {
      if (data?.changePassword.errors) return;
      const userId = cache.identify(data?.changePassword.user!)!;
      cache.modify({
        fields: {
          me(_, { toReference }) {
            return toReference(userId);
          },
        },
      });
    },
  });

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ password: "" }}
        validationSchema={ChangePasswordSchema}
        onSubmit={async ({ password }, { setErrors }) => {
          const resp = await changePassword({
            variables: { token, password },
          });
          if (resp.data?.changePassword.errors) {
            // Error Handling
            const errorMap = toErrorMap(resp.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            if ("password" in errorMap) {
              setErrors(errorMap);
            }
          } else if (resp.data?.changePassword.user) {
            // Success
            router.push("/");
          }
        }}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <InputField
              name="password"
              label="Password"
              placeholder="Your new password"
              type="password"
            />
            {tokenError && (
              <Box mt={4}>
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>{tokenError.toUpperCase()}</AlertTitle>
                  <AlertDescription>
                    <NextLink href="/forgot-password">
                      <Link>Go forget your password</Link>
                    </NextLink>
                  </AlertDescription>
                </Alert>
              </Box>
            )}
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!isValid}
              colorScheme="teal"
              mt="4"
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default ChangePassword;
