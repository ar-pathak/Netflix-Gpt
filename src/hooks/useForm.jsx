import { useState } from 'react';

const useForm = (initialState = {}, validate) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });

    // Validate single field on blur
    if (validate) {
      const fieldError = validate({
        ...values,
        [name]: values[name]
      });
      setErrors({
        ...errors,
        [name]: fieldError[name] || ''
      });
    }
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    
    // Validate all fields on submit
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      
      // Mark all fields as touched on submit
      const touchedFields = {};
      Object.keys(values).forEach(key => {
        touchedFields[key] = true;
      });
      setTouched(touchedFields);

      // Only call onSubmit if there are no errors
      if (Object.keys(validationErrors).length === 0) {
        onSubmit(values);
      }
    } else {
      onSubmit(values);
    }
  };

  const resetForm = () => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  };
};

export default useForm; 