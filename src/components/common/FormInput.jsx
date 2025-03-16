import React, { useState } from 'react';

const FormInput = ({
  type = 'text',
  label,
  name,
  value,
  placeholder,
  onChange,
  onBlur,
  error,
  touched,
  disabled
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const showError = error && touched;
  const isPasswordError = type === 'password' && error?.includes('Password must be');
  
  // Map input types to appropriate autocomplete values
  const getAutocompleteValue = () => {
    switch (type) {
      case 'email':
        return 'email';
      case 'password':
        return name === 'confirmPassword' ? 'new-password' : 'current-password';
      case 'text':
        if (name === 'username') return 'username';
        if (name === 'fullName') return 'name';
        return 'off';
      default:
        return 'off';
    }
  };

  const checkPasswordCriteria = (password) => {
    if (!password) return {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    };

    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    console.debug('Password Validation:', {
      criteria,
      meetsAllCriteria: Object.values(criteria).every(Boolean)
    });

    return criteria;
  };

  const renderPasswordRequirements = () => {
    const criteria = checkPasswordCriteria(value);
    const allCriteriaMet = Object.values(criteria).every(Boolean);
    
    console.debug('Render State:', {
      isPasswordField: type === 'password',
      showError,
      isPasswordError,
      touched,
      allCriteriaMet
    });
    
    return (
      <div className="absolute right-0 top-0 -translate-y-2 translate-x-full ml-4 bg-gray-900 p-3 rounded-md border border-gray-700 shadow-lg w-72">
        <div className="relative">
          <div className="absolute top-4 -left-2 w-3 h-3 bg-gray-900 border-t border-l border-gray-700 transform rotate-45" />
        </div>
        <p className={`text-sm font-medium mb-2 ${allCriteriaMet ? 'text-green-500' : 'text-red-500'}`}>
          {allCriteriaMet ? 'Password meets all requirements!' : 'Password requirements:'}
        </p>
        <ul className="text-xs space-y-1 text-gray-300">
          <li className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${criteria.length ? 'bg-green-500' : 'bg-gray-400'}`} />
            At least 8 characters long
          </li>
          <li className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${criteria.uppercase ? 'bg-green-500' : 'bg-gray-400'}`} />
            One uppercase letter
          </li>
          <li className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${criteria.lowercase ? 'bg-green-500' : 'bg-gray-400'}`} />
            One lowercase letter
          </li>
          <li className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${criteria.number ? 'bg-green-500' : 'bg-gray-400'}`} />
            One number
          </li>
          <li className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${criteria.special ? 'bg-green-500' : 'bg-gray-400'}`} />
            One special character (!@#$%^&*(),.?&quot;:{}|&lt;&gt;)
          </li>
        </ul>
      </div>
    );
  };
  
  return (
    <div className="mb-7">
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={getAutocompleteValue()}
          className={`
            border ${showError ? 'border-red-500' : 'border-gray-400'}
            bg-gray-900 text-white px-4 py-3 rounded-sm w-full
            focus:outline-none focus:ring-2 
            ${showError ? 'focus:ring-red-500' : 'focus:ring-white/20'}
            hover:border-gray-300 transition-all duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          aria-invalid={showError}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        {showError && !isPasswordError && (
          <div 
            id={`${name}-error`}
            role="alert"
            className="absolute -bottom-6 left-0 text-red-500 text-sm font-medium"
          >
            {error}
          </div>
        )}
        {type === 'password' && value && isFocused && (
          renderPasswordRequirements()
        )}
      </div>
    </div>
  );
};

export default FormInput; 