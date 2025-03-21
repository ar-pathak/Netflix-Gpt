// Email validation regex
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Password validation regex (min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Invalid email address';
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (!PASSWORD_REGEX.test(password)) {
    return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
  }
  return '';
};

export const validateName = (name) => {
  if (!name) {
    return 'Name is required';
  }
  if (name.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (name.length > 50) {
    return 'Name must be less than 50 characters';
  }
  return '';
};

export const validateSignInForm = (values) => {
  const errors = {};
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);

  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  return errors;
};

export const validateSignUpForm = (values) => {
  const errors = {};
  const nameError = validateName(values.name);
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);

  if (nameError) errors.name = nameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  return errors;
};

export const validateProfileForm = (values) => {
  const errors = {};

  // Display Name validation
  if (values.displayName) {
    const nameError = validateName(values.displayName);
    if (nameError) errors.displayName = nameError;
  }

  // Email validation
  if (values.email) {
    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;
  }

  // New Password validation
  if (values.newPassword) {
    const passwordError = validatePassword(values.newPassword);
    if (passwordError) errors.newPassword = passwordError;

    // Confirm Password validation
    if (values.confirmPassword !== values.newPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  // Current Password validation
  if ((values.newPassword || values.email !== values.originalEmail) && !values.currentPassword) {
    errors.currentPassword = 'Current password is required for this change';
  }

  return errors;
}; 