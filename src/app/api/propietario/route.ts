import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        message: "Propietario API Base",
        version: "1.0",
        status: "Development"
    });
}
