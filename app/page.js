"use client";

import { useState, useRef } from "react";
import QRCode from "qrcode.react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [qrCodeData, setQrCodeData] = useState([]);
  const [message, setMessage] = useState("");
  const qrCodeRefs = useRef({});

  const handleGenerateQRCode = async () => {
    if (!inputText) {
      setMessage("Please enter text to generate QR code.");
      return;
    }

    try {
      const qrData = [{ id: Date.now(), url: inputText }];

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

  const handlePrint = (id) => {
    const qrCodeElement = qrCodeRefs.current[id].querySelector("canvas");
    const qrCodeDataUrl = qrCodeElement.toDataURL("image/png");
    const printWindow = window.open('', '', 'width=600,height=400');
    printWindow.document.write('<html><head><title>Print QR Code</title></head><body>');
    printWindow.document.write(`<img src="${qrCodeDataUrl}" style="width: 400px; height: 400px;" />`);
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
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
        {qrCodeData.map((data) => (
          <div key={data.id} style={{ margin: 10 }} ref={(el) => (qrCodeRefs.current[data.id] = el)}>
            <QRCode value={data.url} />
            <button
              className="my-2 focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
              onClick={() => handlePrint(data.id)}
            >
              Print QR Code
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
