import { NextResponse } from 'next/server';
import path from "path";
import fs from "fs";

const UPLOAD_DIR = "public/uploads";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const body = Object.fromEntries(formData);
        const file = body.pic;

        const buffer = Buffer.from(await file.arrayBuffer());
        if(!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR);
        }

        fs.writeFileSync(
            path.resolve(UPLOAD_DIR, file.name),
            buffer
        );

        return NextResponse.json({ success: true, fileName: file.name });
    } catch (error) {
        console.error('Error in update-pic API:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
      }
}

export async function GET() {
    return NextResponse.json({ success: false, message: 'Method GET not allowed' }, { status: 405 });
}