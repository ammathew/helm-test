"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface IUploadedFile {
    url: string;
}

interface IDashboardContext {
    medicalRecord: IUploadedFile | null;
    setMedicalRecord: (file: IUploadedFile | null) => void;
    guidelinesFile: IUploadedFile | null;
    setGuidelinesFile: (file: IUploadedFile | null) => void;
    canContinue: boolean;
    setCanContinue: (canContinue: boolean) => void;
}

const INITIAL_STATE: IDashboardContext = {
    medicalRecord: null,
    setMedicalRecord: () => {},
    guidelinesFile: null,
    setGuidelinesFile: () => {},
    canContinue: false,
    setCanContinue: () => {},
};

export const DashboardContext = createContext(INITIAL_STATE);

export function DashboardProvider({ children }: { children: ReactNode }) { 
    const [medicalRecord, setMedicalRecord] = useState<IUploadedFile | null>(null);
    const [guidelinesFile, setGuidelinesFile] = useState<IUploadedFile | null>(null);
    const [canContinue, setCanContinue] = useState<boolean>(false);

    useEffect(() => {
        if (medicalRecord && guidelinesFile) {
            setCanContinue(true);
        } else {
            setCanContinue(false);
        }
    }, [medicalRecord, guidelinesFile]);
    const value = { medicalRecord, setMedicalRecord, guidelinesFile, setGuidelinesFile, canContinue, setCanContinue }; 

    return (
        <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
    );
}

export function useDashboard() { 
    const context = useContext(DashboardContext);
    return context;
}