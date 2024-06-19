import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ data }) => {
    const { QueueNo, QueueDate, InspectionLot, Batch, Receiving_Plant, Material, Vendor } = data;

    // Directly construct QR code values for first and second inspections.
    const qrCodeValues = [
        `${QueueNo},${QueueDate},${InspectionLot},${Batch},${Receiving_Plant},${Material},${Vendor},0010`,
        `${QueueNo},${QueueDate},${InspectionLot},${Batch},${Receiving_Plant},${Material},${Vendor},0020`,
    ];

    return (
        <div className="qr-code-container">
            {qrCodeValues.map((value, index) => (
                <div key={index} className="qr-code flex justify-center items-center">
                    <QRCode value={value} size={70} />
                    {/* Optionally, you can uncomment the following line to add a label below each QR code. */}
                    {/* <p>QR Code {index + 1} Inspection</p> */}
                </div>
            ))}
        </div>
    );
};

export default QRCodeGenerator;
