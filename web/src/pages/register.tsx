import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

export type RegisterProps = {};

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  username: Yup.string().required(),
  password: Yup.string().required(),
});

export const Register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation({
    update: (cache, { data }) => {
      if (data?.register.errors) return;
      const userId = cache.identify(data?.register.user!)!;
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
        initialValues={{ email: "", username: "", password: "" }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setErrors }) => {
          console.log(JSON.stringify(values, null, 2));
          const resp = await register({
            variables: { options: values },
          });
          if (resp.data?.register.errors) {
            setErrors(toErrorMap(resp.data.register.errors));
          } else if (resp.data?.register.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <InputField name="email" label="Email" placeholder="Your email" />
            <Box mt={4}>
              <InputField
                name="username"
                label="Username"
                placeholder="Your username"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="Your password"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!isValid}
              colorScheme="teal"
              mt="4"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
