import React, { useCallback } from 'react';
import TextInput from './TextInput'; // แก้ไขเส้นทางไปยังไฟล์ให้ถูกต้อง

function ParentComponent() {
    const onProcessText = useCallback((data) => {
        // ประมวลผลข้อมูลที่นี่
        console.log('Processed data:', data);
    }, []);

    return (
        <div>
            <TextInput onProcessText={onProcessText} />
            {/* คอมโพเนนต์อื่นๆ ถ้ามี */}
        </div>
    );
}

export default ParentComponent;
