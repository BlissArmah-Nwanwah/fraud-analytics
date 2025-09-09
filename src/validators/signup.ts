export type ValidationResult = string | null;

export const isNonEmpty: (label: string) => (v: string) => ValidationResult =
  (label) => (v) =>
    !v.trim() ? `${label} is required` : null;

export const isEmail = (v: string): ValidationResult => {
  if (!v.trim()) return "Email is required";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Enter a valid email";
};

export const isStrongPassword = (v: string): ValidationResult => {
  if (!v || v.length < 8) return "Password must be at least 8 characters";
  return null;
};

export const isRegionSelected = (v: string): ValidationResult => {
  return v ? null : "Region is required";
};

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
}

export const validateSignupStep = (
  step: number,
  data: SignupData
): ValidationResult => {
  if (step === 1) {
    return (
      isNonEmpty("First name")(data.firstName) ||
      isNonEmpty("Last name")(data.lastName)
    );
  }
  if (step === 2) {
    return isEmail(data.email) || isStrongPassword(data.password);
  }
  if (step === 3) {
    return isRegionSelected(data.location);
  }
  return null;
};
