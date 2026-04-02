const EMAIL_PATTERN = /^(?=.{6,254}$)(?!\.)(?!.*\.\.)([A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]{1,64})@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
const PASSWORD_UPPER = /[A-Z]/;
const PASSWORD_LOWER = /[a-z]/;
const PASSWORD_DIGIT = /\d/;
const PASSWORD_SPECIAL = /[^\w\s]/;
const PASSWORD_WHITESPACE = /\s/;
const PASSWORD_REPEATED = /(.)\1{3,}/;
const PASSWORD_SEQUENTIAL_PATTERNS = ["12345", "abcdef", "qwerty", "password"];
const COMMON_WEAK_PASSWORDS = new Set([
  "password",
  "password123",
  "admin",
  "admin123",
  "qwerty",
  "qwerty123",
  "letmein",
  "welcome",
  "iloveyou",
  "12345678",
  "123456789",
]);

export interface PasswordValidationContext {
  username?: string;
  email?: string;
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function validateEmail(value: string): string | null {
  const email = normalizeEmail(value);
  if (!email) return "Email is required";
  if (email.length > 254) return "Email must be 254 characters or fewer";
  if (!EMAIL_PATTERN.test(email)) return "Invalid email format";
  return null;
}

export function validatePassword(value: string, context: PasswordValidationContext = {}): string | null {
  if (value.length < 12) return "Password must be at least 12 characters";
  if (value.length > 128) return "Password must be 128 characters or fewer";
  if (PASSWORD_WHITESPACE.test(value)) return "Password cannot contain whitespace";
  if (!PASSWORD_UPPER.test(value)) return "Password must include at least one uppercase letter";
  if (!PASSWORD_LOWER.test(value)) return "Password must include at least one lowercase letter";
  if (!PASSWORD_DIGIT.test(value)) return "Password must include at least one number";
  if (!PASSWORD_SPECIAL.test(value)) return "Password must include at least one special character";

  const lowered = value.toLowerCase();
  if (COMMON_WEAK_PASSWORDS.has(lowered)) return "Password is too common";
  if (PASSWORD_REPEATED.test(value)) return "Password cannot contain 4 or more repeated characters in sequence";
  if (PASSWORD_SEQUENTIAL_PATTERNS.some((p) => lowered.includes(p))) {
    return "Password cannot contain common sequential patterns";
  }

  const username = context.username?.trim().toLowerCase() ?? "";
  if (username.length >= 3 && lowered.includes(username)) {
    return "Password cannot contain username";
  }

  const email = normalizeEmail(context.email ?? "");
  const localPart = email.split("@", 1)[0] ?? "";
  if (localPart.length >= 3 && lowered.includes(localPart)) {
    return "Password cannot contain the email local-part";
  }

  return null;
}
