"use client";

import { useState } from 'react';
import { useDashboard } from "@/context/dashboard-context";
import classNames from "classnames";
import { FaCheck, FaSpinner } from "react-icons/fa";

export default function MedicalRecordUpload() {
    const { medicalRecord, setMedicalRecord } = useDashboard();
    const [isUploading, setIsUploading] = useState(false);

    const handleClick = () => {
        setMedicalRecord({ url: "/assets/medical-record.pdf" });
    }

    return(
        <div className="w-1/2 h-64 border border-4 border-gray-200 border-dashed rounded flex flex-row items-center justify-center relative">
            {isUploading && (
            <div className="absolute inset-0 bg-gray-200 opacity-50 flex items-center justify-center">
                <FaSpinner className="animate-spin text-blue-500 text-8xl" />
            </div>
            )}
            <button
                className={classNames(
                    "text-white font-medium py-2 px-4 rounded border border-2",
                    medicalRecord === null ? "bg-blue-500 border-blue-500" : "border-transparent text-green-600" 
                )}
                onClick={handleClick}
            >
                {medicalRecord === null && (<span>Simulate Medical Record Upload</span>)}
                {medicalRecord !== null && (
                    <span className="text-green-600 flex flex-row gap-1 items-center">
                        <FaCheck />
                        <span>Medical Record Uploaded</span>
                    </span>
                )}
            </button>
        </div>
    )
}