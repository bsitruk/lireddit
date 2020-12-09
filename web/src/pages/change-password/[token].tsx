import { Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useLoginMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";

export type ChangePasswordProps = {};

const ChangePasswordSchema = Yup.object().shape({
  password: Yup.string().required(),
});

export const ChangePassword: React.FC<ChangePasswordProps> = ({}) => {
  const router = useRouter();
  const { token } = router.query;
  console.log("🚀 ~ file: [token].tsx ~ line 19 ~ token", token);

  const [login] = useLoginMutation({
    update: (cache, { data }) => {
      if (data?.login.errors) return;
      const userId = cache.identify(data?.login.user!)!;
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
        initialValues={{ usernameOrEmail: "", password: "" }}
        validationSchema={ChangePasswordSchema}
        onSubmit={async (values, { setErrors }) => {
          console.log(JSON.stringify(values, null, 2));
          const resp = await login({
            variables: values,
          });
          if (resp.data?.login.errors) {
            setErrors(toErrorMap(resp.data.login.errors));
          } else if (resp.data?.login.user) {
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
