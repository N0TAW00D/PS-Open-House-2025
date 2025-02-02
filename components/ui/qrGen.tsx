"use client"


interface QRCodeGeneratorProps {
  value: string // Allows value to be either a string or a number
}


// components/QRCodeGenerator.js
import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ value }) => {
  return (
    <div>
      <QRCodeCanvas value={value} size={256} />
    </div>
  );
};

export default QRCodeGenerator;
