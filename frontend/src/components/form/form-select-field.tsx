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
import { useTranslation } from "react-i18next";

type FormSelectFieldOption = {
  label: string;
  value: string;
};

type FormSelectFieldProps = SelectProps & {
  label: string;
  options: FormSelectFieldOption[];
  helperText?: string;
  error?: string;
  optional?: boolean;
};

export const FormSelectField = forwardRef<HTMLSelectElement, FormSelectFieldProps>(
  ({ label, options, helperText, error, optional, id, placeholder, ...rest }, ref) => {
    const { t } = useTranslation("common");
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    return (
      <FormControl isInvalid={Boolean(error)}>
        <FormLabel htmlFor={fieldId} fontWeight="semibold">
          {label}
          {optional ? (
            <Badge ml={2} colorScheme="brand" variant="subtle">
              {t("form.optional")}
            </Badge>
          ) : null}
        </FormLabel>
        <Select
          id={fieldId}
          ref={ref}
          placeholder={placeholder ?? t("form.selectPlaceholder")}
          {...rest}
        >
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
