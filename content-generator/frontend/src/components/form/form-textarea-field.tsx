import {
  Badge,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Textarea,
  TextareaProps,
} from "@chakra-ui/react";
import { forwardRef, useId } from "react";

interface FormTextareaFieldProps extends TextareaProps {
  label: string;
  helperText?: string;
  error?: string;
  optional?: boolean;
}

export const FormTextareaField = forwardRef<HTMLTextAreaElement, FormTextareaFieldProps>(
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
        <Textarea id={fieldId} ref={ref} {...rest} />
        {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
        {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
      </FormControl>
    );
  },
);

FormTextareaField.displayName = "FormTextareaField";
