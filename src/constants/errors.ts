export const getStatusCode = (err: unknown): number | string | undefined => {
  if (typeof err === "object" && err !== null && "status" in err) {
    const statusValue = (err as { status?: number | string }).status;
    return statusValue;
  }
  return undefined;
};

export const resolveFriendlyError = (err: unknown): string => {
  const status = getStatusCode(err);
  if (status === 401) return "Email or password is incorrect.";
  if (status === 400) return "Invalid input. Please review and try again.";
  if (status === "FETCH_ERROR" || status === 0)
    return "Network error. Please try again.";
  return "Unable to process your request right now. Please try again.";
};
