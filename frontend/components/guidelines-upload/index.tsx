"use client";

import { useState } from "react";
import { useDashboard} from "@/context/dashboard-context";
import classNames from "classnames";
import { FaCheck } from "react-icons/fa";

import LoadingOverlay from '../ui/LoadingOverlay';

import { ToastContainer, toast } from 'react-toast';

export default function GuidelinesUpload() {
    const { guidelinesFile, setGuidelinesFile } = useDashboard();
    const { medicalRecord, setMedicalRecord } = useDashboard();
    const { canContinue, setCanContinue} = useDashboard();
    const [isUploading, setIsUploading] = useState(false);

    const handleClick = () => {
        if (!medicalRecord) {
            toast("Please upload a medical record first");
        } else {
            setIsUploading(true);
            setTimeout(() => {
                setGuidelinesFile({ url: "/assets/guidelines.pdf" });
                setIsUploading(false);
            }, 3000);
        }
    };

    return(
        <div className="w-1/2 h-64 border border-4 border-gray-200 border-dashed rounded flex flex-row items-center justify-center relative">
            <LoadingOverlay isUploading={isUploading} />
            <button
                className={classNames(
                    "text-white font-medium py-2 px-4 rounded border border-2",
                    guidelinesFile === null ? "bg-orange-500 border-orange-500" : "border-transparent text-green-600" 
                )}
                onClick={handleClick}
            >
                {guidelinesFile === null && (<span>Simulate Guidelines Upload</span>)}
                {guidelinesFile !== null && (
                    <span className="text-green-600 flex flex-row gap-1 items-center">
                        <FaCheck />
                        <span>Guidelines File Uploaded</span>
                    </span>
                )}
            </button>
        </div>
    )
}