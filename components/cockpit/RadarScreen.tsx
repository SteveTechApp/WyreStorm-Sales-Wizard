import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useClientRequests from '../../hooks/useClientRequests.ts';
import { useGenerationContext } from '../../context/GenerationContext.tsx';
import { IncomingRequest } from '../../utils/types.ts';

const RadarScreen: React.FC = () => {
    const { requests } = useClientRequests();
    const { handleAcceptRequest } = useGenerationContext();
    const navigate = useNavigate();
    const [selectedRequest, setSelectedRequest] = useState<IncomingRequest | null>(null);

    const handleSelect = (request: IncomingRequest) => {
        setSelectedRequest(request);
    };

    const handleAccept = () => {
        if (selectedRequest) {
            handleAcceptRequest(selectedRequest, navigate);
        }
    }

    return (
        <div className="bg-slate-800 p-2 rounded-lg border-2 border-slate-700 h-full flex flex-col md:flex-row gap-2 font-mono">
            <div className="relative w-full md:w-64 h-64 flex-shrink-0 bg-black rounded-full flex items-center justify-center overflow-hidden border-2 border-primary/30 shadow-inner shadow-black">
                {/* Radar Sweep Animation */}
                <div className="absolute w-full h-full animate-radar-sweep origin-center">
                    <div className="w-full h-full" style={{background: 'conic-gradient(from 180deg at 50% 50%, rgba(51, 255, 119, 0) 0deg, rgba(51, 255, 119, 0.2) 30deg, rgba(51, 255, 119, 0) 60deg, rgba(51, 255, 119, 0) 360deg)'}}></div>
                </div>
                {/* Grid Lines */}
                <div className="absolute w-5/6 h-5/6 border border-primary/20 rounded-full"></div>
                <div className="absolute w-3/6 h-3/6 border border-primary/20 rounded-full"></div>
                <div className="absolute w-1/6 h-1/6 border border-dashed border-primary/20 rounded-full"></div>
                <div className="absolute w-full h-[1px] bg-primary/20"></div>
                <div className="absolute w-[1px] h-full bg-primary/20"></div>
                <div className="absolute w-full h-full" style={{transform: 'rotate(45deg)'}}><div className="absolute w-[1px] h-full bg-primary/10"></div></div>
                <div className="absolute w-full h-full" style={{transform: 'rotate(-45deg)'}}><div className="absolute w-[1px] h-full bg-primary/10"></div></div>

                {/* Blips */}
                {requests.map((req, index) => {
                    const angle = (index * 135) % 360;
                    const distance = 40 + (index * 20); // 40%, 60%, 80%
                    return (
                        <button
                            key={req.requestId}
                            onClick={() => handleSelect(req)}
                            className="absolute w-3 h-3 rounded-full bg-accent animate-blip-pulse"
                            style={{
                                transform: `rotate(${angle}deg) translateY(-${distance}%) rotate(-${angle}deg) scale(${selectedRequest?.requestId === req.requestId ? 2 : 1})`,
                                boxShadow: selectedRequest?.requestId === req.requestId ? '0 0 10px var(--accent)' : 'none',
                                border: selectedRequest?.requestId === req.requestId ? '2px solid white' : 'none'
                            }}
                            title={req.clientName}
                        />
                    );
                })}
            </div>
            <div className="flex-grow bg-black/50 p-3 rounded-md border-2 border-slate-700 shadow-inner shadow-black mfd-screen relative">
                <h2 className="text-sm font-bold text-primary uppercase tracking-widest text-center mb-2" style={{textShadow: '0 0 5px var(--primary)'}}>Incoming Requests</h2>
                {selectedRequest ? (
                    <div className="text-primary/90 text-sm animate-fade-in-fast" style={{ textShadow: '0 0 3px var(--primary)' }}>
                        <p><span className="font-bold text-primary">CLIENT:</span> {selectedRequest.clientName}</p>
                        <p className="mt-2"><span className="font-bold text-primary">BRIEF:</span> {selectedRequest.description}</p>
                        <p className="mt-2"><span className="font-bold text-primary">STATUS:</span> {selectedRequest.status.toUpperCase()}</p>
                        <button onClick={handleAccept} className="w-full mt-4 bg-primary/80 hover:bg-primary text-black font-bold py-2 px-4 rounded-md text-sm uppercase">Accept &amp; Build</button>
                    </div>
                ) : (
                    <div className="text-center text-primary/50 text-sm h-full flex items-center justify-center" style={{ textShadow: '0 0 3px var(--primary)' }}>
                        <p>Select a contact on the radar to view details.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RadarScreen;