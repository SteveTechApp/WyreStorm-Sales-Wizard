import React from 'react';
import { UserProfile } from '../../utils/types';
import Logo from '../Logo';

interface CertificateProps {
    userProfile: UserProfile;
    onReset: () => void;
}

const Certificate: React.FC<CertificateProps> = ({ userProfile, onReset }) => {
    const completionDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in flex flex-col items-center">
            <div id="printable-certificate" className="bg-white text-gray-800 p-10 w-full max-w-4xl border-[10px] border-primary/80 rounded-lg shadow-2xl relative">
                <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #printable-certificate, #printable-certificate * {
                            visibility: visible;
                        }
                        #printable-certificate {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            margin: 0;
                            padding: 20px;
                            border: 10px solid #008A3A;
                        }
                        .no-print {
                            display: none;
                        }
                    }
                `}
                </style>
                <div className="text-center">
                    <div className="inline-block">
                       <Logo />
                    </div>
                    <h1 className="text-4xl font-bold font-display mt-4 text-[#008A3A]">Certificate of Achievement</h1>
                    <p className="text-lg mt-4">This certificate is proudly presented to</p>
                    <p className="text-3xl font-bold my-6 font-display text-gray-900">{userProfile.name}</p>
                    <p className="text-lg">of</p>
                    <p className="text-2xl font-semibold my-4 font-display text-gray-700">{userProfile.company}</p>
                    <p className="text-lg mt-4">for successfully completing the</p>
                    <p className="text-2xl font-bold my-4 font-display text-gray-900">WyreStorm AV Essentials Training</p>
                    <p className="text-md mt-8">Issued on: {completionDate}</p>
                </div>
                <div className="absolute bottom-10 right-10">
                     <svg width="80" height="80" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className="text-[#008A3A] flex-shrink-0">
                        <path fill="currentColor" d="M20 2.5L37.5 20L20 37.5L12.5 30L22.5 20L12.5 10L20 2.5Z" />
                        <path fill="currentColor" opacity="0.6" d="M2.5 20L12.5 30L20 22.5L10 12.5L2.5 20Z" />
                    </svg>
                </div>
            </div>
            <div className="mt-8 flex gap-4 no-print">
                <button onClick={handlePrint} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-6 rounded-md">
                    Print Certificate
                </button>
                 <button onClick={onReset} className="bg-background-secondary hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">
                    Reset and Retake
                </button>
            </div>
        </div>
    );
};

export default Certificate;
