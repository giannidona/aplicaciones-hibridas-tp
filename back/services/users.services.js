import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db/connection.js";

export async function getUsers() {
  return await db
    .collection("users")
    .find({}, { projection: { password: 0 } })
    .toArray();
}

export async function saveUser(user) {
  const existe = await db.collection("users").findOne({ email: user.email });
  if (existe) throw new Error("Ya existe un usuario con ese email");

  user.password = await bcrypt.hash(user.password, 10);
  delete user.confirmPassword;

  user._id = randomUUID();
  user.rol = user.rol || "customer";

  await db.collection("users").insertOne(user);

  const { password, ...userSinPassword } = user;
  return userSinPassword;
}

export async function login({ email, password }) {
  const user = await db.collection("users").findOne({ email });
  if (!user) throw new Error("Usuario o contraseña incorrecto");

  const valido = await bcrypt.compare(password, user.password);
  if (!valido) throw new Error("Usuario o contraseña incorrecto");

  const token = jwt.sign(
    { _id: user._id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: "2h" },
  );

  return { email: user.email, name: user.name, rol: user.rol, token };
}
