import React, { useState, useEffect, useRef } from "react";

import QRCodeGenerator from "./QRCodeGenerator";

import jsPDF from "jspdf";
import domToImage from "dom-to-image";

const AutoResizeTextarea = ({ data, clearSignal }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto"; // Reset height to recalculate
    textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
  }, [data]); // Depend on data to recalculate on change

  useEffect(() => {
    if (clearSignal) {
      // Clear logic here, reset data if needed
      textareaRef.current.value = ""; // Clear the textarea
    }
  }, [clearSignal]);

  return (
    <textarea
      ref={textareaRef}
      className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="PlateNoHead / PlateNoTail"
      value={`${data.PlateNoHead || ""} / ${data.PlateNoTail || ""}`}
      readOnly
      style={{ resize: "none", overflow: "hidden" }}
    />
  );
};

const TextOutput = ({ data, clearSignal, onClearData }) => {
  useEffect(() => {
    if (clearSignal) {
      onClearData(); // Call clear data to reset fields
      console.log("Fields should be cleared now"); // Debug output
    }
  }, [clearSignal, onClearData]);

  if (!data) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>Loading...</div>;
  }

  const handleCapture = () => {
    const printContent = document.querySelector('.print-content');
    domToImage.toPng(printContent)
      .then(dataUrl => {
        const pdf = new jsPDF('l', 'mm', 'a5');  // A4 แนวนอน
        const width = 210;  // กำหนดความกว้างที่ต้องการใน mm
        const height = 148;
  
        // ใส่ภาพใน PDF โดยมีขนาดตามที่คำนวณ
        pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
        pdf.save('captured.pdf');
        printPDF(pdf.output('datauristring'));
      })
      .catch(error => {
        console.error('Error capturing screen:', error);
      });
  };
  
  const printPDF = (pdfData) => {
    const pdfWindow = window.open("");
    pdfWindow.document.write('<iframe width="100%" height="100%" src="' + pdfData + '"></iframe>');
    pdfWindow.print();
    pdfWindow.close();
  };
  
  

  return (
    <>
      <div className="print-content px-1 py-1" style={{ width: '1000px', overflow: 'hidden' }} >
        <div className="container mx-auto y-10  ">
          <form className="border-2 border-black p-5  ">
            <div className="container mx-auto mt-1 mb-1">
              <div className="columns-2">
                <div className="flex justify-start text-xs">
                  <h5>โรงงานอาหารสัตว์เครือเบทาโกร</h5>
                </div>
                <div className="flex justify-end text-xs">
                  <h5>FM-FB-QA-01-01-09:16/03/67 Rev.6</h5>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-auto mt-1 mb-1 ">
              <div className="columns-1">
                <div className="flex justify-center mb-1 text-2xl">
                  <h1>ใบบันทึกการตรวจรับ</h1>
                </div>

                <div className="grid gap-2 mb-1 md:grid-cols-5">
                  <div className="flex items-center">
                    <label
                      htmlFor="ReceivingPlant"
                      className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      โรงงาน:
                    </label>
                    <input
                      type="text"
                      id="ReceivingPlant"
                      className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="ReceivingPlant"
                      value={data.ReceivingPlant || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center">
                    <label
                      htmlFor="QueueDate"
                      className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      วันที่:
                    </label>
                    <input
                      type="text"
                      id="QueueDate"
                      className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={data.QueueDate || ""}
                      placeholder="QueueDate"
                      readOnly
                    />
                  </div>
                  <div className="flex items-center">
                    <label
                      htmlFor="QueueNo"
                      className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      ลำดับคิว:
                    </label>
                    <input
                      type="text"
                      id="QueueNo"
                      className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="ReceivingPlant"
                      value={data.QueueNo || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center">
                    <label
                      htmlFor="InspectionLot"
                      className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      Ins. Lot:
                    </label>
                    <input
                      type="text"
                      id="InspectionLot"
                      className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="InspectionLot"
                      value={data.InspectionLot || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center">
                    <label
                      htmlFor="Batch"
                      className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      Batch:
                    </label>
                    <input
                      type="text"
                      id="Batch"
                      className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Batch"
                      value={data.Batch || ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <hr />
            </div>

            <div className="container  mx-auto mt-1 mb-1">
              <div className="columns-2 mx-auto">
                <div className="flex justify-center ">
                  <QRCodeGenerator data={data} />
                </div>
              </div>
            </div>

            <div className="container mx-auto  mt-1 mb-1">
              <div className="columns-2">
                <div className="flex justify-center text-base ">
                  <h5>--- ตรวจสอบรอบแรก ---</h5>
                </div>
                <div className="flex justify-center text-base">
                  <h5>--- ตรวจสอบรอบสอง ---</h5>
                </div>
              </div>
              <hr />
            </div>

            <div className="container mx-auto px-auto  mt-1 mb-1">
              <div className="grid gap-2 mb-1 md:grid-cols-2">
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="PlateNoHead"
                    className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    ทะเบียนรถ<br></br>(หัว/ท้าย):
                  </label>
                  <input
                    type="text"
                    id="PlateNoTail"
                    className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="PlateNoHead"
                    value={`${data.PlateNoHead || ""} / ${
                      data.PlateNoTail || ""
                    }`}
                    readOnly
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="ActualReceived"
                    className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    จำนวนที่รับจริง:
                  </label>
                  <input
                    type="text"
                    id="ActualReceived"
                    className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder=""
                    value=""
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label
                    htmlFor="MaterialDescription"
                    className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    ชื่อวัตถุดิบ:
                  </label>
                  <input
                    type="textarea"
                    id="MaterialDescription"
                    className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="MaterialDescription"
                    value={`${data.Material || ""}  /  ${
                      data.MaterialDescription || ""
                    }`}
                    style={{ resize: "none", overflow: "hidden" }}
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label
                    htmlFor="ReturnQuantity"
                    className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    จำนวนที่ส่งคืน:
                  </label>
                  <input
                    type="text"
                    id="ReturnQuantity"
                    className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder=""
                    value=""
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label
                    htmlFor="VendorName"
                    className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    ชื่อผู้ส่ง:
                  </label>
                  <input
                    type="textarea"
                    id="VendorName"
                    className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="VendorName"
                    value={`${data.Vendor || data.SupplyingPlant || ""}  /  ${
                      data.VendorName || ""
                    }`}
                    style={{ resize: "none", overflow: "hidden" }}
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label
                    htmlFor="Position"
                    className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    ตำแหน่ง:
                  </label>
                  <input
                    type="text"
                    id="Position"
                    className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder=""
                    value=""
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label
                    htmlFor="Moisture"
                    className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    ความชื้นข้าวโพด:
                  </label>
                  <input
                    type="text"
                    id="Moisture"
                    className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Moisture"
                    value={data.Moisture || ""}
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label
                    htmlFor="PalletCount"
                    className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    จำนวนพาเลท:
                  </label>
                  <input
                    type="text"
                    id="PalletCount"
                    className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder=""
                    value=""
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label
                    htmlFor="qscore"
                    className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Q-Score / Sampling:
                  </label>
                  <input
                    type="textarea"
                    id="qscore"
                    className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="qscore"
                    value={`${data.evaluate || ""}  /  ${data.sampling || ""} `}
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label
                    htmlFor="PalletWeight"
                    className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    น้ำหนักพาเลท:
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder=""
                    value=""
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label
                    htmlFor="remarksecond"
                    className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    หมายเหตุ:
                  </label>
                  <input
                    type="text"
                    id="remarksecond"
                    className="block w-full p-2 text-black bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 border-b border-gray-300 dark:border-gray-400"
                    placeholder=""
                    value=""
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <input
                      id="forklift-checkbox"
                      type="checkbox"
                      value=""
                      className="w-3 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="forklift-checkbox"
                      className="text-sm font-medium text-black-900 dark:text-black"
                    >
                      รถโฟร์คลิฟท์ตักลง
                    </label>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      id="betagro-checkbox"
                      type="checkbox"
                      value=""
                      className="w-3 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="betagro-checkbox"
                      className="text-sm font-medium text-black-900 dark:text-black"
                    >
                      พนง.เบทาโกรลงของ
                    </label>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      id="driver-checkbox"
                      type="checkbox"
                      value=""
                      className="w-3 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="driver-checkbox"
                      className="text-sm font-medium text-black-900 dark:text-black"
                    >
                      พนง.ขับรถลงของ
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label
                    htmlFor="remarksecond"
                    className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                  ></label>
                  <input
                    type="text"
                    id="remarksecond"
                    className="block w-full p-2 text-black bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 border-b border-gray-300 dark:border-gray-400"
                    placeholder=""
                    value=""
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label
                    htmlFor="remarksecond"
                    className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    หมายเหตุ:
                  </label>
                  <input
                    type="text"
                    id="remarksecond"
                    className="block w-full p-2 text-black bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 border-b border-gray-300 dark:border-gray-400"
                    placeholder=""
                    value=""
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label
                    htmlFor="singqcsecond"
                    className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    ลงชื่่อ(QC1):
                  </label>
                  <input
                    type="text"
                    id="singqcsecond"
                    className="block w-full p-2 text-black bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 border-b border-gray-300 dark:border-gray-400"
                    placeholder=""
                    value={data.LastChangedBy || ""}
                    readOnly
                  />
                </div>
                <div className="flex flex-wrap -mx-2">
                  <div className="flex items-center gap-4 px-2 w-1/2">
                    <label
                      htmlFor="singqcfirst"
                      className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      ลงชื่อ(QC2):
                    </label>
                    <input
                      type="text"
                      id="singqcfirst"
                      className="block w-full p-2 text-black bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 border-b border-gray-300 dark:border-gray-400"
                      placeholder=""
                      value=""
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-4 px-2 w-1/2">
                    <label
                      htmlFor="SignatureWH"
                      className="w-40 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      ลงชื่อ(WH):
                    </label>
                    <input
                      type="text"
                      id="SignatureWH"
                      className="block w-full p-2 text-black bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 border-b border-gray-300 dark:border-gray-400"
                      placeholder=""
                      value=""
                      readOnly
                    />
                  </div>
                </div>
              </div>{" "}
            
             
            </div>
          </form>
        </div>
      </div>
      <div className="flex justify-end w-full ">
        <button
          onClick={handleCapture}
          className="btn btn-active btn-primary hover:bg-blue-900 text-white font-bold py-1 px-4 rounded-xl mt-2 text-input-section"
        >
          PRINT FORM
        </button>
      </div>
    </>
  );
};

export default TextOutput;
