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

export async function updateUserRol(req, res) {
  try {
    const id = req.params.id;

    if (id === req.usuario._id) {
      return res
        .status(400)
        .json({ message: "No podés cambiar tu propio rol" });
    }

    const { rol } = req.body;
    if (!["customer", "admin"].includes(rol)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const user = await userService.updateUserRol(id, rol);
    res.status(202).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const id = req.params.id;

    if (id === req.usuario._id) {
      return res
        .status(400)
        .json({ message: "No podés eliminar tu propia cuenta" });
    }

    await userService.deleteUser(id);
    res.status(202).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
