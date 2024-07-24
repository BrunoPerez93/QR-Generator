import { dbConnect } from "@/utils/mongodb";
import { NextResponse } from "next/server";
import QR from "@/app/models/qrModel";

export async function GET() {
    const con = await dbConnect();
    return new NextResponse('connected')
}


export async function POST(request) {
    try {
      await dbConnect();
      const { qrData } = await request.json();
  
      if (!qrData || qrData.length === 0) {
        return new NextResponse('No data provided', { status: 400 });
      }
  
      const qr = new QR(qrData[0]);
      await qr.save();
  
      return new NextResponse(JSON.stringify({ message: 'QR code saved in the database' }), { status: 200 });
    } catch (error) {
      return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
  }