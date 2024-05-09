"use client";

import { useEffect } from "react";
import GuidelinesUpload from "@/components/guidelines-upload";
import MedicalRecordUpload from "@/components/medical-record-upload";
import { useRouter } from "next/navigation";

export const revalidate = 0;
import { m } from "framer-motion";
import { useDashboard } from "@/context/dashboard-context";

import { ToastContainer, toast } from 'react-toast';

export default function DashboardRoot() {
	const {canContinue, setCanContinue} = useDashboard();
	const router = useRouter();
	const CASE_ID = "case_891a_6fbl_87d1_4326";

	const handleContinue = () => {
		fetch('http://localhost:8000/cases', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(data => {
				console.log('Success:', data);
				router.push(`/dashboard/case/${CASE_ID}`)
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}

	return (
		<div className="w-full flex flex-col justify-center items-center h-screen">
			<div className="w-full flex flex-row gap-2 items-center">
				<MedicalRecordUpload />
				<GuidelinesUpload />
			</div>
				{ canContinue && (
                <div className="w-full py-4 flex flex-row justify-center">
                    <button
                        className="bg-green-600 font-medium text-white py-2 px-4 rounded"
                        onClick={handleContinue}
                    >
                        Continue
                    </button>
                </div>
				)}
		<ToastContainer />
		</div>
	)
}
