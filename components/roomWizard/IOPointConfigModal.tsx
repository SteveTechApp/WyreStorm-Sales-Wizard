import React, { useState, useEffect } from 'react';
import { IOPoint } from '../../utils/types.ts';
import { CONNECTION_TYPES, DISTRIBUTION_TYPES, TERMINATION_TYPES, DISPLAY_TYPES, PROJECTOR_LENS_TYPES } from '../../data/constants.ts';
import { WrenchIcon } from '../Icons.tsx';
import InfoTooltip from '../InfoTooltip.tsx';

interface IOPointConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (point: IOPoint) => void;
    point: IOPoint | null;
    unit: 'm' | 'ft';
    onConfigureVideoWall: (id: string) => void;
}

const IOPointConfigModal: React.FC<IOPointConfigModalProps> = ({ isOpen, onClose, onSave, point, unit, onConfigureVideoWall }) => {
    const [localPoint, setLocalPoint] = useState<IOPoint | null>(point);

    useEffect(() => {
        if (point) {
            setLocalPoint(JSON.parse(JSON.stringify(point)));
        }
    }, [point]);

    useEffect(() => {
        if (localPoint && localPoint.displayType === 'dual_display' && localPoint.quantity !== 2) {
            setLocalPoint(p => p ? { ...p, quantity: 2 } : null);
        }
    }, [localPoint?.displayType]);

    if (!isOpen || !localPoint) return null;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setLocalPoint(p => p ? { ...p, [name as keyof IOPoint]: type === 'number' ? parseFloat(value) || 0 : value } : null);
    };

    const handleSave = () => {
        if (localPoint) {
            onSave(localPoint);
        }
    };

    const isQtyDisabled = localPoint.displayType === 'dual_display' || localPoint.displayType === 'lcd_video_wall' || localPoint.displayType === 'led_video_wall';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] animate-fade-in-fast" onClick={onClose}>
            <div className="bg-background-secondary rounded-lg shadow-xl p-4 w-full max-w-lg m-4 flex flex-col" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-text-primary mb-4 capitalize flex-shrink-0">{localPoint.type} Configuration</h2>

                <div className="space-y-4 overflow-y-auto pr-2 flex-grow min-h-0">
                    {/* Basic Info */}
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                             <div className="flex items-center gap-1 mb-1">
                                <label htmlFor="quantity" className="block text-sm font-medium text-text-secondary">Quantity</label>
                                <InfoTooltip text="The number of identical input/output points. For a video wall or dual displays, this is set automatically."/>
                            </div>
                            <input type="number" id="quantity" name="quantity" value={localPoint.quantity} onChange={handleChange} className="w-20 p-2 border border-border-color rounded-md bg-input-bg text-sm" min="1" disabled={isQtyDisabled}/>
                        </div>
                        <div className="flex-grow">
                             <div className="flex items-center gap-1 mb-1">
                                <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Name</label>
                                <InfoTooltip text="A descriptive name, e.g., 'Lectern PC' or 'Main Display'."/>
                            </div>
                            <input type="text" id="name" name="name" value={localPoint.name} onChange={handleChange} placeholder={localPoint.type === 'input' ? 'e.g., Lectern PC' : 'e.g., Main Display'} className="w-full p-2 border border-border-color rounded-md bg-input-bg text-sm"/>
                        </div>
                    </div>

                    {/* Output Specifics */}
                    {localPoint.type === 'output' && (
                        <div className="flex flex-wrap items-end gap-4">
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    <label htmlFor="displayType" className="block text-sm font-medium text-text-secondary">Display Type</label>
                                    <InfoTooltip text="Specify if this output is a single screen, projector, video wall, etc. Choosing a video wall will launch a dedicated configuration wizard."/>
                                </div>
                                <select id="displayType" name="displayType" value={localPoint.displayType || 'single'} onChange={handleChange} className="p-2 border border-border-color rounded-md bg-input-bg text-sm">
                                    {DISPLAY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </div>
                            {localPoint.displayType === 'projector' && (
                                <div className="animate-fade-in-fast">
                                     <div className="flex items-center gap-1 mb-1">
                                        <label htmlFor="projectorLensType" className="block text-sm font-medium text-text-secondary">Lens Type</label>
                                        <InfoTooltip text="Select the appropriate lens for the projector based on its distance from the screen."/>
                                    </div>
                                    <select id="projectorLensType" name="projectorLensType" value={localPoint.projectorLensType || 'standard'} onChange={handleChange} className="p-2 border border-border-color rounded-md bg-input-bg text-sm">
                                        {PROJECTOR_LENS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                </div>
                            )}
                            {(localPoint.displayType === 'lcd_video_wall' || localPoint.displayType === 'led_video_wall') && (
                                <button type="button" onClick={() => onConfigureVideoWall(localPoint.id)} className="flex items-center justify-center gap-2 text-sm bg-primary/20 text-primary font-semibold py-2 px-3 rounded-md hover:bg-primary/30 animate-fade-in-fast">
                                    <WrenchIcon className="h-4 w-4" /> Configure Wall
                                </button>
                            )}
                        </div>
                    )}
                    
                    {/* Connectivity */}
                    <div>
                        <h3 className="text-md font-semibold text-text-primary mb-2 border-t border-border-color pt-3">Connectivity</h3>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <div className="flex items-center gap-1 mb-1">
                                    <label htmlFor="connectionType" className="block text-sm font-medium text-text-secondary">Connection</label>
                                    <InfoTooltip text="The physical connector type required at the termination point (e.g., HDMI, USB-C)."/>
                                </div>
                                <select id="connectionType" name="connectionType" value={localPoint.connectionType} onChange={handleChange} className="w-full p-2 border border-border-color rounded-md bg-input-bg text-sm">
                                    {CONNECTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    <label htmlFor="distributionType" className="block text-sm font-medium text-text-secondary">Distribution</label>
                                    <InfoTooltip text="The technology used to send the signal from the central rack to the termination point. Use HDBaseT or AVoIP for long distances."/>
                                </div>
                                <select id="distributionType" name="distributionType" value={localPoint.distributionType} onChange={handleChange} className="w-full p-2 border border-border-color rounded-md bg-input-bg text-sm">
                                    {DISTRIBUTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    <label htmlFor="distance" className="block text-sm font-medium text-text-secondary">Distance</label>
                                    <InfoTooltip text="The estimated one-way cable length from the central rack/switcher to the termination point."/>
                                </div>
                                <div className="relative">
                                    <input type="number" id="distance" name="distance" value={localPoint.distance} onChange={handleChange} className="w-full p-2 border border-border-color rounded-md bg-input-bg text-sm pr-8"/>
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary text-xs">{unit}</span>
                                </div>
                            </div>
                            <div>
                                 <div className="flex items-center gap-1 mb-1">
                                    <label htmlFor="terminationType" className="block text-sm font-medium text-text-secondary">Termination</label>
                                    <InfoTooltip text="Where the connection point will be located in the room (e.g., a wall plate, a connection box in the floor)."/>
                                </div>
                                <select id="terminationType" name="terminationType" value={localPoint.terminationType} onChange={handleChange} className="w-full p-2 border border-border-color rounded-md bg-input-bg text-sm">
                                    {TERMINATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 flex-shrink-0 pt-4 border-t border-border-color">
                    <button type="button" onClick={onClose} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Cancel</button>
                    <button type="button" onClick={handleSave} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md">Save</button>
                </div>
            </div>
        </div>
    );
};

export default IOPointConfigModal;