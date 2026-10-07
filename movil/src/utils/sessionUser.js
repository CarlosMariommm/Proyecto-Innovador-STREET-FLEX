/*
 * La forma del usuario que la app guarda como sesion. Login, verificacion de
 * correo y edicion de perfil reciben del servidor el mismo cliente; esto evita
 * armar el objeto a mano (y olvidar un campo) en cada pantalla.
 */

export const buildSessionUser = (res) => ({
  _id: res._id,
  username: res.username,
  email: res.email,
  full_name: res.full_name,
  phone_number: res.phone_number,
  age: res.age,
  favorites: res.favorites || [],
  image: res.image,
});
