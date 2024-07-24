"use client";

import { useState } from "react";
import QRCode from "qrcode.react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [qrCodeData, setQrCodeData] = useState([]);
  const [message, setMessage] = useState("");

  const handleGenerateQRCode = async () => {
    if (!inputText) {
      setMessage("Please enter text to generate QR code.");
      return;
    }

    try {
      const qrData = [{ url: inputText }];

      setQrCodeData(qrData);

      const response = await fetch("/api/qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrData }),
      });

      if (!response.ok) {
        throw new Error("Failed to save QR data.");
      }

      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="py-5 text-5xl font-bold text-blue-500">QR Codes</h1>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to generate QR code"
        className="p-3 rounded-xl text-blue-500"
      />
      <button
        className="my-5 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        onClick={handleGenerateQRCode}
      >
        Generate QR Code
      </button>
      <p>{message}</p>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {qrCodeData.map((data, index) => (
          <div key={index} style={{ margin: 10 }}>
            <QRCode value={data.url} />
          </div>
        ))}
      </div>
    </div>
  );
}
