import { Alert, AlertIcon, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";

export type ForgotPasswordProps = {};

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email().required(),
});

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [success, setSuccess] = useState(false);

  return (
    <Wrapper variant="small">
      {!success ? (
        <Formik
          initialValues={{ email: "" }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={async (values) => {
            const resp = await forgotPassword({
              variables: { email: values.email },
            });
            if (resp.data?.forgotPassword) {
              setSuccess(true);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="email" label="Email" placeholder="Your email" />
              <Button
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
                mt="4"
              >
                Forget Password
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <Alert status="success">
          <AlertIcon />A message has been sent to your mailbox !
        </Alert>
      )}
    </Wrapper>
  );
};

export default ForgotPassword;
