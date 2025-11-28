import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Switch,
  SwitchProps,
  Text,
} from "@chakra-ui/react";
import { forwardRef, useId } from "react";

interface FormSwitchFieldProps extends SwitchProps {
  label: string;
  helperText?: string;
  error?: string;
}

export const FormSwitchField = forwardRef<HTMLInputElement, FormSwitchFieldProps>(
  ({ label, helperText, error, id, ...rest }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    return (
      <FormControl isInvalid={Boolean(error)}>
        <HStack align="flex-start" spacing={4}>
          <Switch id={fieldId} ref={ref} mt={1} {...rest} />
          <Box>
            <FormLabel htmlFor={fieldId} mb={1} fontWeight="semibold">
              {label}
            </FormLabel>
            {helperText ? (
              <Text color="subtle" fontSize="sm">
                {helperText}
              </Text>
            ) : null}
          </Box>
        </HStack>
        {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
      </FormControl>
    );
  },
);

FormSwitchField.displayName = "FormSwitchField";
