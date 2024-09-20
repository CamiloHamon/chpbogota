// models/user.model.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superadmin'], required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
});

// Método para encriptar la password antes de guardar
UserSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
});

// Método para comparar la password ingresada con la almacenada
UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model('user', UserSchema, 'user');
