import { NextRequest, NextResponse } from "next/server";
import { Client, Storage, ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { v4 as uuidv4 } from "uuid";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No se encontró ningún archivo" }, { status: 400 });
        }

        // Initialize Appwrite Client
        const client = new Client();
        client
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
            .setKey(process.env.APPWRITE_API_KEY!);

        const storage = new Storage(client);

        // Convert the file to an InputFile as expected by the Node.js Appwrite SDK
        const buffer = Buffer.from(await file.arrayBuffer());
        const inputFile = InputFile.fromBuffer(buffer, file.name || 'image.webp');

        const fileId = ID.unique();
        const bucketId = process.env.APPWRITE_BUCKET_ID || "images";

        // 1. Upload to Appwrite Storage
        await storage.createFile(bucketId, fileId, inputFile);

        // 2. Generate the Public URL to display the image
        const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

        return NextResponse.json({ url: fileUrl });
    } catch (error: any) {
        console.error("Error en upload via Appwrite:", error.message || error);
        return NextResponse.json(
            { error: "Error al subir la imagen a la nube" },
            { status: 500 }
        );
    }
}
