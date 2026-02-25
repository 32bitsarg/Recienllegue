"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function registerUser(formData: any) {
    try {
        const { name, username, email, password, confirmPassword, role } = formData;

        if (!name || !username || !email || !password) {
            return { error: "Faltan campos obligatorios" };
        }

        if (password !== confirmPassword) {
            return { error: "Las contraseñas no coinciden" };
        }

        const existingEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (existingEmail) {
            return { error: "El email ya está registrado" };
        }

        const existingUsername = await prisma.user.findFirst({
            where: { username }
        });

        if (existingUsername) {
            return { error: "El nombre de usuario ya existe" };
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                username,
                email,
                avatarSeed: email,
                passwordHash,
                role: role || "ESTUDIANTE"
            }
        });

        return { success: true, user: { id: user.id, email: user.email } };
    } catch (error: any) {
        console.error("Error in registration:", error);
        return { error: "Error al registrar usuario" };
    }
}
export async function updateProfile(userId: string, data: {
    name?: string,
    bio?: string,
    campus?: string,
    gradYear?: number,
    phone?: string,
    avatarSeed?: string
}) {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                bio: data.bio,
                campus: data.campus,
                gradYear: data.gradYear,
                phone: data.phone,
                avatarSeed: data.avatarSeed
            }
        });

        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: "Error al actualizar el perfil" };
    }
}
