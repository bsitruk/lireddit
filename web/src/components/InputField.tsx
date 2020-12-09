import { Input } from "@chakra-ui/input";
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { FieldHookConfig, useField } from "formik";

export type InputFieldProps = FieldHookConfig<string> & {
  label: string;
  placeholder?: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder = "",
  ...props
}) => {
  const [field, { error, touched }] = useField(props);

  return (
    <FormControl isInvalid={!!error && touched}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input
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
