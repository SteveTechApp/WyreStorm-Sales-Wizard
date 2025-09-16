import React, { useRef, useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { Proposal, EquipmentItem, InstallationTaskItem, CustomCostItem, DiagramNode, Product } from '../utils/types';
import SystemDiagram from '../components/SystemDiagram';
import Logo from '../components/Logo';
import InfoModal from '../components/InfoModal';
import { productDatabase } from '../data/productDatabase';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ProposalDisplay: React.FC = () => {
    const { proposal, projectData, userProfile } = useAppContext();
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [editableProposal, setEditableProposal] = useState<Proposal | null>(() => proposal ? JSON.parse(JSON.stringify(proposal)) : null);
    const [laborRate, setLaborRate] = useState(125);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!projectData || projectData.projectId !== projectId || !proposal) {
           navigate('/');
        } else {
           setEditableProposal(JSON.parse(JSON.stringify(proposal)));
        }
    }, [proposal, projectData, projectId, navigate]);

    const totals = useMemo(() => {
        if (!editableProposal) return { hardwareDealerTotal: 0, hardwareMsrpTotal: 0, totalHours: 0, laborTotal: 0, grandTotal: 0 };
        const hardwareDealerTotal = editableProposal.equipmentList.reduce((acc, item) => acc + (item.quantity * item.dealerPrice), 0);
        const hardwareMsrpTotal = editableProposal.equipmentList.reduce((acc, item) => acc + (item.quantity * item.msrp), 0);
        const totalHours = editableProposal.installationPlan.reduce((acc, task) => acc + Number(task.hours), 0);
        const laborTotal = totalHours * laborRate;
        const customCostsTotal = editableProposal.pricing.customCostItems.reduce((acc, item) => acc + item.cost, 0);
        const grandTotal = hardwareDealerTotal + laborTotal + customCostsTotal;
        return { hardwareDealerTotal, hardwareMsrpTotal, totalHours, laborTotal, grandTotal };
    }, [editableProposal, laborRate]);

    if (!editableProposal || !projectData || !userProfile) {
        return <LoadingSpinner message="Loading Proposal..." />;
    }

    const handleReset = () => {
        if (proposal) setEditableProposal(JSON.parse(JSON.stringify(proposal)));
    };
    
    const formatCurrency = (amount: number) => {
        const currency = editableProposal.pricing.currency || 'GBP';
        const localeString = { 'GBP': 'en-GB', 'USD': 'en-US', 'EUR': 'de-DE' }[currency];
        return new Intl.NumberFormat(localeString, { style: 'currency', currency }).format(amount);
    };

    const exportToCsv = () => {
        const currency = editableProposal.pricing.currency || 'GBP';
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += `SKU,Product Name,Quantity,Dealer Price (${currency}),Dealer Total (${currency}),MSRP (${currency}),MSRP Total (${currency})\r\n`;
        editableProposal.equipmentList.forEach(item => {
            const row = [item.sku, `"${item.name.replace(/"/g, '""')}"`, item.quantity, item.dealerPrice, item.dealerPrice * item.quantity, item.msrp, item.msrp * item.quantity].join(",");
            csvContent += row + "\r\n";
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${projectData.projectName}_equipment_list.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadSvg = () => {
        if (!svgRef.current) return;
        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${projectData.projectName}_System_Diagram.svg`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleNodeClick = (node: DiagramNode) => {
        const product = productDatabase.find(p => p.sku === node.label || p.name === node.label);
        if (product) {
            setSelectedProduct(product);
        } else {
            setSelectedProduct({ sku: node.id, name: node.label, category: node.group, description: `A ${node.type} device located in the ${node.group}.`, dealerPrice: 0, msrp: 0, tags: [] });
        }
    };
    
    const handleEquipmentChange = (index: number, field: keyof EquipmentItem, value: string) => {
        setEditableProposal(p => {
            if (!p) return null;
            const newList = [...p.equipmentList];
            const numValue = (field === 'quantity' || field === 'dealerPrice' || field === 'msrp') ? parseFloat(value) || 0 : value;
            (newList[index] as any)[field] = numValue;
            return { ...p, equipmentList: newList };
        });
    };
    const handleAddEquipment = () => setEditableProposal(p => p ? { ...p, equipmentList: [...p.equipmentList, { sku: 'CUSTOM-001', name: 'Custom Item', quantity: 1, dealerPrice: 0, dealerTotal: 0, msrp: 0, msrpTotal: 0, isCustom: true }] } : null);
    const handleRemoveEquipment = (index: number) => setEditableProposal(p => p ? { ...p, equipmentList: p.equipmentList.filter((_, i) => i !== index) } : null);

    const handleLaborChange = (index: number, field: keyof InstallationTaskItem, value: string) => {
        setEditableProposal(p => {
            if (!p) return null;
            const newList = [...p.installationPlan];
            const numValue = (field === 'hours') ? parseFloat(value) || 0 : value;
            (newList[index] as any)[field] = numValue;
            return { ...p, installationPlan: newList };
        });
    };
    const handleAddLabor = () => setEditableProposal(p => p ? { ...p, installationPlan: [...p.installationPlan, { task: 'Custom Task', description: '', hours: 1, isCustom: true }] } : null);
    const handleRemoveLabor = (index: number) => setEditableProposal(p => p ? { ...p, installationPlan: p.installationPlan.filter((_, i) => i !== index) } : null);

    const handleCustomCostChange = (index: number, field: keyof CustomCostItem, value: string) => {
        setEditableProposal(p => {
            if (!p) return null;
            const newList = [...p.pricing.customCostItems];
            const numValue = (field === 'cost') ? parseFloat(value) || 0 : value;
            (newList[index] as any)[field] = numValue;
            return { ...p, pricing: { ...p.pricing, customCostItems: newList } };
        });
    };
    const handleAddCustomCost = () => setEditableProposal(p => p ? { ...p, pricing: { ...p.pricing, customCostItems: [...p.pricing.customCostItems, { id: uuidv4(), description: 'New Custom Cost', cost: 0 }] } } : null);
    const handleRemoveCustomCost = (index: number) => setEditableProposal(p => p ? { ...p, pricing: { ...p.pricing, customCostItems: p.pricing.customCostItems.filter((_, i) => i !== index) } } : null);

    const renderSection = (title: string, content: React.ReactNode, actions?: React.ReactNode) => (
        <section className="p-6 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-4">
                <h2 className="text-2xl font-bold text-[#008A3A]">{title}</h2>
                <div>{actions}</div>
            </div>
            {content}
        </section>
    );

    return (
        <div className="bg-gray-50 p-4 sm:p-8 rounded-lg animate-fade-in w-full max-w-7xl mx-auto">
            <header className="mb-8 p-6 bg-white rounded-lg border border-gray-200 flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800">{projectData.projectName}</h1>
                    <p className="text-lg text-gray-500">Prepared for: {projectData.clientName || 'Valued Customer'}</p>
                    <p className="text-sm text-gray-500 mt-2">Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                    {userProfile?.logoUrl ? <img src={userProfile.logoUrl} alt="Company Logo" className="max-h-16 ml-auto" /> : <div><Logo /></div>}
                    <div>
                        <p className="font-semibold">{userProfile?.company}</p><p className="text-sm text-gray-600">{userProfile?.name}</p><p className="text-sm text-gray-600">{userProfile?.email}</p>
                    </div>
                    <button onClick={handleReset} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1 px-2 rounded-md transition-colors">Reset Pricing Changes</button>
                </div>
            </header>
            
            <div className="space-y-6">
                {renderSection("Executive Summary", <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: editableProposal.executiveSummary.replace(/\n/g, '<br />') }} />)}
                {renderSection("Scope of Work", <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: editableProposal.scopeOfWork.replace(/\n/g, '<br />') }} />)}
                {renderSection("System Diagram", <SystemDiagram ref={svgRef} diagram={editableProposal.systemDiagram} onNodeClick={handleNodeClick} />, <button onClick={handleDownloadSvg} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-md transition-colors">Download SVG</button>)}

                {renderSection("Equipment Schedule", 
                    <>
                    <table className="w-full text-left">
                        <thead className="border-b bg-gray-50"><tr className="text-xs text-gray-600 uppercase">
                            <th className="p-3 font-semibold">SKU</th><th className="p-3 font-semibold">Product Name</th><th className="p-3 font-semibold text-center">Qty</th><th className="p-3 font-semibold text-right">Dealer Price</th><th className="p-3 font-semibold text-right">Dealer Total</th><th className="p-3 font-semibold text-right"></th>
                        </tr></thead>
                        <tbody>
                            {editableProposal.equipmentList.map((item: EquipmentItem, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50 group">
                                    <td className="p-2 w-40"><input type="text" value={item.sku} onChange={e => handleEquipmentChange(index, 'sku', e.target.value)} disabled={!item.isCustom} className="bg-transparent p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded" /></td>
                                    <td className="p-2"><input type="text" value={item.name} onChange={e => handleEquipmentChange(index, 'name', e.target.value)} disabled={!item.isCustom} className="bg-transparent p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded" /></td>
                                    <td className="p-2 w-24"><input type="number" value={item.quantity} onChange={e => handleEquipmentChange(index, 'quantity', e.target.value)} className="bg-transparent p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded text-center" /></td>
                                    <td className="p-2 w-32"><input type="number" value={item.dealerPrice} onChange={e => handleEquipmentChange(index, 'dealerPrice', e.target.value)} className="bg-transparent p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded text-right" /></td>
                                    <td className="p-2 text-right w-32 font-medium">{formatCurrency(item.dealerPrice * item.quantity)}</td>
                                    <td className="p-2 w-10 text-center"><button onClick={() => handleRemoveEquipment(index)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={handleAddEquipment} className="text-sm text-[#008A3A] hover:underline mt-3 font-medium">+ Add Custom Item</button>
                    </>,
                    <button onClick={exportToCsv} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-md transition-colors">Export to CSV</button>
                )}

                {renderSection("Installation Plan", 
                    <>
                    <div className="space-y-3">
                        {editableProposal.installationPlan.map((task, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md border group">
                            <div className="flex justify-between items-start">
                                <div className="flex-grow">
                                    <input type="text" value={task.task} onChange={e => handleLaborChange(index, 'task', e.target.value)} disabled={!task.isCustom} className="font-semibold text-base bg-transparent p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded" />
                                    <textarea value={task.description} onChange={e => handleLaborChange(index, 'description', e.target.value)} disabled={!task.isCustom} className="w-full bg-transparent text-sm text-gray-600 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded px-1 resize-y h-12" />
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <input type="number" value={task.hours} onChange={e => handleLaborChange(index, 'hours', e.target.value)} className="w-16 p-1 border rounded text-right"/>
                                    <span className="text-sm text-gray-600">hours</span>
                                    <button onClick={() => handleRemoveLabor(index)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                                </div>
                            </div>
                        </div>))}
                    </div>
                     <button onClick={handleAddLabor} className="text-sm text-[#008A3A] hover:underline mt-3 font-medium">+ Add Custom Task</button>
                    </>
                )}
                
                {editableProposal.siteRequirements && editableProposal.siteRequirements.length > 0 && renderSection("Project Prerequisites", <ul className="list-disc list-inside space-y-2">{editableProposal.siteRequirements.map(req => <li key={req}>{req}</li>)}</ul>)}
                
                {editableProposal.furtherResources && renderSection("Further Resources", <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: editableProposal.furtherResources }} />)}

                <div className="p-6 bg-white rounded-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-[#008A3A] border-b-2 border-gray-200 pb-2 mb-4">Project Investment Summary</h2>
                    <div className="max-w-xl ml-auto space-y-2">
                        <div className="flex justify-between font-medium"><span className="text-gray-600">Hardware Subtotal:</span><span>{formatCurrency(totals.hardwareDealerTotal)}</span></div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Installation Labor ({totals.totalHours} hrs @</span>
                                <input type="number" value={laborRate} onChange={e => setLaborRate(Number(e.target.value) || 0)} className="w-20 p-1 border rounded-md text-right"/>
                                <span className="text-gray-600">/hr):</span>
                            </div>
                            <span>{formatCurrency(totals.laborTotal)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                           <h4 className="text-sm font-semibold text-gray-500 mb-2">Project Adjustments:</h4>
                           {editableProposal.pricing.customCostItems.map((item, index) => (
                               <div key={item.id} className="flex justify-between items-center group mb-1">
                                    <input type="text" value={item.description} onChange={e => handleCustomCostChange(index, 'description', e.target.value)} placeholder="Description" className="bg-transparent p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded"/>
                                    <div className="flex items-center gap-2">
                                        <input type="number" value={item.cost} onChange={e => handleCustomCostChange(index, 'cost', e.target.value)} className="bg-transparent p-1 w-28 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded text-right"/>
                                        <button onClick={() => handleRemoveCustomCost(index)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                                    </div>
                               </div>
                           ))}
                           <button onClick={handleAddCustomCost} className="text-xs text-[#008A3A] hover:underline mt-1 font-medium">+ Add Adjustment</button>
                        </div>
                        <hr className="my-2"/>
                        <div className="flex justify-between text-xl font-bold pt-2 border-t mt-2 text-gray-800"><span>Grand Total:</span><span>{formatCurrency(totals.grandTotal)}</span></div>
                         <div className="flex justify-between text-sm text-gray-500 pt-2"><span className="italic">MSRP Hardware Total (for reference):</span><span className="italic">{formatCurrency(totals.hardwareMsrpTotal)}</span></div>
                    </div>
                </div>
            </div>

            <InfoModal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title={selectedProduct?.name || 'Device Details'}>
                {selectedProduct && (
                    <div className="space-y-2">
                        <p><strong>SKU:</strong> {selectedProduct.sku}</p>
                        <p><strong>Category:</strong> {selectedProduct.category}</p>
                        <p><strong>Description:</strong> {selectedProduct.description}</p>
                        {selectedProduct.dealerPrice > 0 && (<p><strong>Dealer Price:</strong> {formatCurrency(selectedProduct.dealerPrice)}</p>)}
                        {selectedProduct.msrp > 0 && (<p><strong>MSRP:</strong> {formatCurrency(selectedProduct.msrp)}</p>)}
                    </div>
                )}
            </InfoModal>
        </div>
    );
};

export default ProposalDisplay;