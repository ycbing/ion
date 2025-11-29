import {
  Badge,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputProps,
} from "@chakra-ui/react";
import { forwardRef, useId } from "react";

type FormTextFieldProps = InputProps & {
  label: string;
  helperText?: string;
  error?: string;
  optional?: boolean;
};

export const FormTextField = forwardRef<HTMLInputElement, FormTextFieldProps>(
  ({ label, helperText, error, optional, id, ...rest }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    return (
      <FormControl isInvalid={Boolean(error)}>
        <FormLabel htmlFor={fieldId} fontWeight="semibold">
          {label}
          {optional ? (
            <Badge ml={2} colorScheme="brand" variant="subtle">
              Optional
            </Badge>
          ) : null}
        </FormLabel>
        <Input id={fieldId} ref={ref} {...rest} />
        {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
        {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
      </FormControl>
    );
  },
);

FormTextField.displayName = "FormTextField";
