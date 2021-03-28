import { Input } from "@chakra-ui/input";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { FieldHookConfig, useField } from "formik";

export type InputFieldProps = FieldHookConfig<string> & {
  label: string;
  placeholder?: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder = "",
  textarea = false,
  ...props
}) => {
  const [field, { error, touched }] = useField(props);

  const InputOrTextarea = textarea ? Textarea : Input;

  return (
    <FormControl isInvalid={!!error && touched}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextarea
        {...field}
        id={field.name}
        placeholder={placeholder || field.name}
        type={props.type}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default InputField;
