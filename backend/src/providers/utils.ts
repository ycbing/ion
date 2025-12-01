const TOKEN_REGEX = /{{\s*([\w.]+)\s*}}/g;

export const renderTemplate = (
  template: string,
  variables: Record<string, string | number | undefined>
): string => {
  return template.replace(TOKEN_REGEX, (_match, key) => {
    const value = variables[key];

    if (value === undefined || value === null) {
      return "";
    }

    return String(value);
  });
};
