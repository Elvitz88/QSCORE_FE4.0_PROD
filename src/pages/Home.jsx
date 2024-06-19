import React, { useState } from "react";
import TextInput from "../components/TextInput";
import TextOutput from "../components/TextOutput";

function Home() {
  const [data, setData] = useState({
    Receiving_Plant: "",
    QueueDate: "",
    QueueNo: "",
    InspectionLot: "",
    Batch: "",
    Material: "",
    Material_Description: "",
    Vendor: "",
    SupplyingPlant: "",
    Vendor_Name: "",
    Moisture: "",
    PlateNoHead: "",
    PlateNoTail: "",
    qscore: "",
    evaluate: "",
    sampling: "",
    LastChangedBy: ""
  });

  const handleProcessText = (processedData) => {
    setData(processedData);
  };

  const [clearSignal, setClearSignal] = useState(false);

  const handleClearData = () => {
    setData({
      Receiving_Plant: "",
      QueueDate: "",
      QueueNo: "",
      InspectionLot: "",
      Batch: "",
      Material: "",
      Material_Description: "",
      Vendor: "",
      SupplyingPlant: "",
      Vendor_Name: "",
      Moisture: "",
      PlateNoHead: "",
      PlateNoTail: "",
      qscore: "",
      evaluate: "",
      sampling: "",
      LastChangedBy: ""
    });
    setClearSignal((prev) => !prev); // Toggle to trigger effect in child components
  };

  return (
    <div className="flex flex-col w-full lg:flex-row m-4 gap-4">
      {/* Text input */}
      <div className="grid w-50">
        <div>
          <TextInput
            onProcessText={handleProcessText}
            onClearExternal={handleClearData}
            apiUrl="/api/qscore"
          />
        </div>
      </div>

      {/* Text output  */}
      <div className="">
        <div>
          <TextOutput
            data={data}
            clearSignal={clearSignal}
            onClearData={handleClearData}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
