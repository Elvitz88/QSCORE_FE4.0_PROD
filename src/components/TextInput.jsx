import React, { useState, useEffect, useCallback } from 'react';
import columnMapping from '../assets/ColumnKey';
import useFetchQScore from '../services/FetchQScore';

const TextInput = ({ onProcessText, onClearExternal, apiUrl }) => {
    const [text, setText] = useState('');
    const [shouldProcess, setShouldProcess] = useState(false);
    const { fetchQScore, result, isLoading, error, clearResult } = useFetchQScore(apiUrl);

    const handleTextChange = useCallback((event) => {
        setText(event.target.value);
    }, []);

    const handleClear = useCallback(() => {
        setText('');
        clearResult();
        setShouldProcess(false);
        onClearExternal();
    }, [clearResult, onClearExternal]);

    const handleSubmit = useCallback(async () => {
        const processedData = processText(text);
        console.log('text after processedData:', processedData);

        // Use processData.SupplyingPlant if Vendor is not found
        const vendor = processedData.Vendor || processedData.SupplyingPlant;

        if (vendor && processedData.Material) {
            console.log('Params:', {
                vendor,
                material: processedData.Material,
            });
            await fetchQScore({
                vendor,
                material: processedData.Material,
            });
            setShouldProcess(true); // Set the flag to true
        } else {
            console.log("Required data is missing");
        }
    }, [text, fetchQScore]);

    useEffect(() => {
        if (result && shouldProcess) {
            const processedData = processText(text);
            const combinedData = { ...processedData, ...result };
            onProcessText(combinedData);
            setShouldProcess(false); // Reset the flag
        }
    }, [result, shouldProcess, text, onProcessText]);

    const processText = useCallback((text) => {
        const lines = text.split('\n');
        let dataDict = {};
        console.log('Lines:', lines); // Debug log

        lines.forEach(line => {
            // Hardcoded mapping for problematic keys
            if (line.startsWith("Plate No. (Head)")) {
                dataDict["PlateNo_Head"] = line.replace("Plate No. (Head)", "").trim();
                return;
            }
            if (line.startsWith("Plate No. (Tail)")) {
                dataDict["PlateNo_Tail"] = line.replace("Plate No. (Tail)", "").trim();
                return;
            }

            for (let key in columnMapping) {
                let regex = new RegExp(`^${key}(\\s{1,}|\\s-\\s)`);
                if (regex.test(line)) {
                    let value = line.substring(key.length).trim();
                    if (key.includes("Description")) {
                        value = value.replace(/^Description\s*/, '');
                    }
                    let modifiedKey = columnMapping[key];

                    // Check if key is Material and exclude unwanted values
                    if (modifiedKey === "Material" && /document|Doc\.Item|Year/.test(value)) {
                        continue;
                    }

                    console.log('Original Key:', key, 'Value:', value); // Debug log
                    console.log('Mapping:', key, '->', modifiedKey); // Debug log
                    dataDict[modifiedKey] = value;
                    break;
                }
            }
        });

        console.log('Processed Data Dictionary:', dataDict); // Debug log
        return dataDict;
    }, []);

    return (
        <div>
            <div className="flex justify-center font-custom text-input-section">
                <textarea
                    style={{ height: '560px', width: '350px', resize: 'none' }}
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
