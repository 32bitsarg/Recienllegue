import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No se encontró ningún archivo" },
                { status: 400 }
            );
        }

        // Validar tipo de archivo
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: "Tipo de archivo no permitido. Solo PNG, JPG, WEBP y GIF." },
                { status: 400 }
            );
        }

        // Validar tamaño
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "El archivo excede el tamaño máximo de 5MB." },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generar nombre único
        const fileExtension = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExtension}`;

        // Asegurar que el directorio existe
        const uploadsDir = join(process.cwd(), "public", "uploads");
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        const path = join(uploadsDir, fileName);
        await writeFile(path, buffer);

        const url = `/uploads/${fileName}`;

        return NextResponse.json({ url });
    } catch (error) {
        console.error("Error en upload:", error);
        return NextResponse.json(
            { error: "Error al subir la imagen" },
            { status: 500 }
        );
    }
}
