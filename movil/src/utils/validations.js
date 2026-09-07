/*
 * Validaciones de formularios, compartidas por Login/Register/Checkout.
 * Cada validador recibe el valor y devuelve un mensaje de error (string) o
 * null si es valido.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRequired = (label) => (value) =>
  value && String(value).trim() ? null : `${label} es requerido`;

export const validateEmail = (value) => {
  if (!value || !value.trim()) return 'El correo es requerido';
  if (!EMAIL_REGEX.test(value.trim())) return 'El correo no tiene un formato valido';
  return null;
};

export const validatePassword = (value) => {
  if (!value) return 'La contrasena es requerida';
  if (value.length < 6) return 'La contrasena debe tener al menos 6 caracteres';
  return null;
};

export const validatePhone = (value) => {
  if (!value || !value.trim()) return 'El telefono es requerido';
  if (!/^[0-9+()\s-]{7,15}$/.test(value.trim())) return 'El telefono no es valido';
  return null;
};

// Corre cada validador sobre su campo y junta los errores encontrados.
// `validators` es { campo: (valor) => mensaje | null }.
export const validateForm = (values, validators) => {
  const errors = {};
  Object.entries(validators).forEach(([field, validate]) => {
    const message = validate(values[field]);
    if (message) errors[field] = message;
  });
  return errors;
};

export const hasNoErrors = (errors) => Object.keys(errors).length === 0;
