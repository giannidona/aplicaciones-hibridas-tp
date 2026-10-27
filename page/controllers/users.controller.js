import * as userService from "../../services/users.services.js";

export async function getUsers(req, res) {
  try {
    const usuarios = await userService.getUsers();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function saveUser(req, res) {
  try {
    const user = await userService.saveUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const user = await userService.login(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
