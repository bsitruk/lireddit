import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";
import InputField from "../components/InputField";
import { useCreatePostMutation } from "../generated/graphql";
import React from "react";
import Layout from "../components/Layout";
import { useIsAuth } from "../utils/useIsAuth";

const PostSchema = Yup.object().shape({
  title: Yup.string().required(),
  text: Yup.string().required(),
});

export const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();

  const [createPost] = useCreatePostMutation({
    update: (cache) => {
      cache.evict({ fieldName: "posts" });
      cache.gc();
    },
  });

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        validationSchema={PostSchema}
        onSubmit={async (values) => {
          console.log(JSON.stringify(values, null, 2));
          await createPost({
            variables: { input: values },
          });
          router.push("/");
        }}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <InputField
              name="title"
              label="Title"
              placeholder="The Post Title"
            />
            <Box mt={4}>
              <InputField
                name="text"
                label="Body"
                placeholder="text..."
                textarea
              />
            </Box>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!isValid}
              colorScheme="teal"
              mt="4"
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default CreatePost;
