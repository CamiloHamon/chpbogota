// controllers/userController.js
import User from '../models/user.model.js';

// Roles permitidos
const validRoles = ['admin', 'superadmin'];

// Método para actualizar un usuario
export const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, email, password, passwordConfirm, role } = req.body;
    const errors = [];

    if (!validRoles.includes(role)) {
        errors.push({ text: 'Rol inválido' });
    }

    // Validar si las contraseñas coinciden
    if (password && password !== passwordConfirm) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: errors[0].text,
        });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        // Actualizar campos
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        if (password) {
            user.password = password;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
        });
    }
};

// Método para eliminar un usuario
export const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
        });
    }
};

export const createNewUser = async (req, res) => {
    const { name, email, password, passwordConfirm, role } = req.body;
    const errors = [];

    if (!validRoles.includes(role)) {
        errors.push({ text: 'Rol inválido' });
    }

    if (password != passwordConfirm) {
        errors.push({ text: 'Las passwords no coinciden' });
    }

    if (password.length < 6) {
        errors.push({ text: 'La password debe tener al menos 6 caracteres' });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Error, los datos no cumplen los requisitos',
            errors
        });
    } else {
        // Verificar si el email ya está registrado
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está en uso',
            });
        } else {
            const newUser = new User({ name, email, password, role });
            await newUser.save();
            return res.status(201).json({
                success: true,
                message: 'Usuario creado exitosamente',
            });
        }
    }
};

export const getAllUsers = async (req, res) => {
    const users = await User.find().lean();
    return res.status(201).json({
        success: true,
        data: users
    });
};

export const getUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrada' });
      }
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
  

