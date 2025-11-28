import {
  Badge,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Select,
  SelectProps,
} from "@chakra-ui/react";
import { forwardRef, useId } from "react";

interface Option {
  label: string;
  value: string;
}

interface FormSelectFieldProps extends SelectProps {
  label: string;
  options: Option[];
  helperText?: string;
  error?: string;
  optional?: boolean;
}

export const FormSelectField = forwardRef<HTMLSelectElement, FormSelectFieldProps>(
  ({ label, options, helperText, error, optional, id, placeholder, ...rest }, ref) => {
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
        <Select id={fieldId} ref={ref} placeholder={placeholder ?? "Select option"} {...rest}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
        {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
      </FormControl>
    );
  },
);

FormSelectField.displayName = "FormSelectField";
