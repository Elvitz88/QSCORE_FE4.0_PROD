import React, { useState, useEffect } from 'react';
import columnMapping from '../assets/ColumnKey';
import useFetchQScore from '../services/FetchQScore';

const TextInput = ({ onProcessText, onClearExternal, apiUrl }) => {
    const [text, setText] = useState('');
    const { fetchQScore, result, isLoading, error } = useFetchQScore(apiUrl);

    useEffect(() => {
        if (result) {
            const processedData = processText(text);
            const combinedData = { ...processedData, ...result };
            onProcessText(combinedData);
        }
    }, [result, text, onProcessText]);

    const handleTextChange = (event) => setText(event.target.value);
    const handleClear = () => {
        setText('');
        onClearExternal();
    };

    const handleSubmit = async () => {
        const processedData = processText(text);
        console.log('text after processedData :', processedData);
        if (processedData.Vendor && processedData.Material) {
            await fetchQScore({
                instlot: processedData.InspectionLot,
                batch: processedData.Batch,
                plant: processedData.ReceivingPlant,
                vendor: processedData.Vendor,
                material: processedData.Material,
            });
        } else {
            console.log("Required data is missing");
        }
    };

    const processText = (text) => {
        const lines = text.split('\n');
        let dataDict = {};
        lines.forEach(line => {
            if (line.includes('\t')) {
                let [key, value] = line.split('\t').map(item => item.trim());
                let modifiedKey = columnMapping[key] || key.replace(/\s+/g, '');
                dataDict[modifiedKey] = value;
            }
        });
        return dataDict;
    };

    return (
        <div>
            <div className="flex justify-center font-custom text-input-section">
                <textarea
                    style={{ height: '650px', width: '350px' }}
                    className="textarea textarea-secondary"
                    placeholder="insert Queue in here"
                    value={text}
                    onChange={handleTextChange}
                />
            </div>
            <div className="flex gap-2 justify-center w-full mt-2 mb-2">
                <button
                    className="btn btn-active btn-primary hover:bg-blue-900 text-white font-bold py-1 px-4 rounded-xl mt-2 text-input-section"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : 'Process Text'}
                </button>
                <button
                    className="btn btn-secondary hover:bg-magenta-900 text-white font-bold py-1 px-4 rounded-xl mt-2 text-input-section"
                    onClick={handleClear}
                >
                    Clear
                </button>
            </div>
            {error && <p className="text-red-500">Error: {error}</p>}
        </div>
    );
};

export default TextInput;
