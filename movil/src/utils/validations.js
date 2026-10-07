/*
 * Validaciones de formularios, compartidas por todas las pantallas (Login,
 * Registro, Perfil, Recuperar contrasena, Checkout, Valoraciones).
 * Cada validador recibe el valor y devuelve un mensaje de error (string) o
 * null si es valido.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Las mismas reglas que valida el servidor (backendST/clientController.js).
export const MIN_AGE = 13;
export const MAX_AGE = 100;

// Mensaje neutro en genero ("La ciudad es requerido" no concuerda): sirve igual
// para "El usuario" que para "La direccion".
export const validateRequired = (label) => (value) =>
  value && String(value).trim() ? null : `Campo obligatorio: ${label.charAt(0).toLowerCase()}${label.slice(1)}`;

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

// Edad: obligatoria, entera, sin signos (nada de negativos ni decimales) y
// dentro de un rango razonable.
export const validateAge = (value) => {
  const text = String(value ?? '').trim();
  if (!text) return 'La edad es requerida';
  if (!/^\d+$/.test(text)) return 'La edad debe ser un numero entero positivo';
  const age = Number(text);
  if (age < MIN_AGE) return `Debes tener al menos ${MIN_AGE} anos`;
  if (age > MAX_AGE) return `La edad no puede ser mayor a ${MAX_AGE}`;
  return null;
};

// Un valor numerico que no puede ser negativo (ej. codigo postal). Si es
// opcional y esta vacio, pasa.
export const validateNonNegativeNumber = (label, { required = false } = {}) => (value) => {
  const text = String(value ?? '').trim();
  if (!text) return required ? `${label} es requerido` : null;
  if (!/^\d+$/.test(text)) return `${label} debe ser un numero sin signos ni letras`;
  return null;
};

export const validateVerificationCode = (value) => {
  const text = String(value ?? '').trim();
  if (!text) return 'El codigo es requerido';
  if (!/^\d{6}$/.test(text)) return 'El codigo tiene 6 digitos';
  return null;
};

// Comentario de una valoracion: obligatorio y con un tope de largo.
export const validateReviewComment = (value) => {
  const text = String(value ?? '').trim();
  if (!text) return 'Escribe un comentario';
  if (text.length > 500) return 'El comentario no puede pasar de 500 caracteres';
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
