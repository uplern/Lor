export function renderTemplate(template: string, data: Record<string, string>): string {
  const normalizedData: Record<string, string> = {};

  Object.entries(data).forEach(([key, value]) => {
    normalizedData[key.toLowerCase()] = value;
  });

  // Supports {{Name}} style placeholders.
  let output = template.replace(/\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g, (_, rawKey: string) => {
    const key = rawKey.toLowerCase();
    return normalizedData[key] ?? "";
  });

  // Also supports legacy single-brace placeholders like {Tenure}.
  output = output.replace(/\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}/g, (_, rawKey: string) => {
    const key = rawKey.toLowerCase();
    return normalizedData[key] ?? `{${rawKey}}`;
  });

  return output;
}