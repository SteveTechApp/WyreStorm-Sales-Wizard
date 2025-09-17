import React, { useRef, useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { Proposal, EquipmentItem, InstallationTaskItem, CustomCostItem, DiagramNode, Product, ProjectData } from '../utils/types';
import SystemDiagram from '../components/SystemDiagram';
import InfoModal from '../components/InfoModal';
import { productDatabase } from '../data/productDatabase';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Packer, Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ImageRun } from 'docx';
import { translateText } from '../services/assistantService';
import WallLayoutDisplay from '../components/WallLayoutDisplay';

const ProposalDisplay: React.FC = () => {
    const { savedProjects, userProfile, handleSaveProject } = useAppContext();
    const { projectId, proposalId } = useParams<{ projectId: string; proposalId?: string }>();
    const navigate = useNavigate();

    const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
    const [initialProposal, setInitialProposal] = useState<Proposal | null>(null);
    const [editableProposal, setEditableProposal] = useState<Proposal | null>(null);
    
    const [laborRate, setLaborRate] = useState(125);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    
    const [clientDetails, setClientDetails] = useState({
        clientContactName: '',
        clientContactEmail: '',
        clientAddress: '',
    });

    const [isTranslating, setIsTranslating] = useState(false);
    const [translationError, setTranslationError] = useState<string | null>(null);

    useEffect(() => {
        const project = savedProjects.find(p => p.projectId === projectId);
        if (!project || !project.proposals || project.proposals.length === 0) {
            navigate(`/design/${projectId}`);
            return;
        }

        setCurrentProject(project);
        setClientDetails({
            clientContactName: project.clientContactName || '',
            clientContactEmail: project.clientContactEmail || '',
            clientAddress: project.clientAddress || '',
        });

        let proposalToLoad: Proposal | undefined;
        if (proposalId) {
            proposalToLoad = project.proposals.find(p => p.proposalId === proposalId);
        } else {
            proposalToLoad = [...project.proposals].sort((a, b) => b.version - a.version)[0];
            if (proposalToLoad) {
                navigate(`/proposal/${projectId}/${proposalToLoad.proposalId}`, { replace: true });
            }
        }

        if (proposalToLoad) {
            const proposalCopy = JSON.parse(JSON.stringify(proposalToLoad));
            setInitialProposal(proposalCopy);
            setEditableProposal(JSON.parse(JSON.stringify(proposalToLoad)));
        } else {
            navigate(`/design/${projectId}`);
        }
    }, [projectId, proposalId, savedProjects, navigate]);

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

    const formatCurrency = (amount: number) => {
        const currency = editableProposal?.pricing.currency || 'GBP';
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount);
    };
    
    const handleClientDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setClientDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveClientDetails = () => {
        if (currentProject) {
            const updatedProjectData = { ...currentProject, ...clientDetails };
            handleSaveProject(updatedProjectData);
            alert('Client details saved!');
        }
    };
    
    const sortedProposals = useMemo(() => {
        return currentProject ? [...currentProject.proposals].sort((a, b) => b.version - a.version) : [];
    }, [currentProject]);

    if (!editableProposal || !currentProject || !userProfile) {
        return <div className="flex h-screen items-center justify-center"><LoadingSpinner message="Loading Proposal..." /></div>;
    }

    const handleTranslate = async () => {
        if (!editableProposal) return;
        const targetLanguage = window.prompt("Enter the language to translate to (e.g., French, Spanish, German):");
        if (!targetLanguage || !targetLanguage.trim()) return;

        setIsTranslating(true);
        setTranslationError(null);
        try {
            const [translatedSummary, translatedScope] = await Promise.all([
                translateText(editableProposal.executiveSummary, targetLanguage),
                translateText(editableProposal.scopeOfWork, targetLanguage)
            ]);
            setEditableProposal(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    executiveSummary: translatedSummary,
                    scopeOfWork: translatedScope
                };
            });
        } catch (e: any) {
            setTranslationError(e.message);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleReset = () => {
        if (initialProposal) setEditableProposal(JSON.parse(JSON.stringify(initialProposal)));
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
        link.setAttribute("download", `${currentProject.projectName}_equipment_list.csv`);
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
        link.download = `${currentProject.projectName}_System_Diagram.svg`;
        link.click();
        URL.revokeObjectURL(url);
    };
    
    const getImageBuffer = async (url: string): Promise<ArrayBuffer | undefined> => {
        try {
            if (url.startsWith('data:image')) {
                const base64 = url.split(',')[1];
                if (!base64) return undefined;
                const binaryStr = atob(base64);
                const len = binaryStr.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryStr.charCodeAt(i);
                }
                return bytes.buffer;
            } else {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok.');
                return await response.arrayBuffer();
            }
        } catch (error) {
            console.error("Failed to fetch image for DOCX export:", error);
            return undefined;
        }
    };

    const handleDownloadDocx = async () => {
        if (!editableProposal || !currentProject) return;

        let logoBuffer: ArrayBuffer | undefined;
        if (userProfile?.logoUrl) {
            logoBuffer = await getImageBuffer(userProfile.logoUrl);
        }
        
        const cellMargins = { left: 100, right: 100, top: 80, bottom: 80 };
    
        const doc = new Document({
            sections: [{
                children: [
                    ...(logoBuffer ? [new Paragraph({
                        // FIX: Changed 'data' to 'buffer' for the ImageRun constructor to align with the docx library's API for ArrayBuffer data and resolve the TypeScript error.
                        children: [new ImageRun({ buffer: logoBuffer, transformation: { width: 150, height: 75 } })],
                        alignment: AlignmentType.RIGHT,
                    })] : [new Paragraph(" ")]),
                    new Paragraph({ text: currentProject.projectName, heading: HeadingLevel.TITLE }),
                    new Paragraph({ text: "Sales Proposal", style: "IntenseQuote" }),
                    new Paragraph({ text: `Date: ${new Date().toLocaleDateString()}` }),
                    new Paragraph({ text: " " }),

                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        columnWidths: [5000, 5000],
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
                        rows: [
                             new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph({ text: "PREPARED BY", heading: HeadingLevel.HEADING_3 })] }),
                                    new TableCell({ children: [new Paragraph({ text: "PREPARED FOR", heading: HeadingLevel.HEADING_3 })] }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [
                                            new Paragraph({ children: [new TextRun({ text: userProfile?.company || '', bold: true })] }),
                                            new Paragraph({children: [new TextRun(userProfile?.name || '')]}),
                                            new Paragraph({children: [new TextRun(userProfile?.email || '')]}),
                                        ],
                                    }),
                                    new TableCell({
                                        children: [
                                            new Paragraph({ children: [new TextRun({ text: currentProject.clientName, bold: true })] }),
                                            new Paragraph({children: [new TextRun(clientDetails.clientContactName)]}),
                                            new Paragraph({children: [new TextRun(clientDetails.clientContactEmail)]}),
                                            ...clientDetails.clientAddress.split('\n').filter(l => l).map(line => new Paragraph({children: [new TextRun(line)]})),
                                        ],
                                    }),
                                ],
                            }),
                        ]
                    }),
                    new Paragraph({ text: " ", pageBreakBefore: true }),
                    
                    new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
                    ...editableProposal.executiveSummary.split('\n').map(p => new Paragraph({children: [new TextRun(p)]})),
                    new Paragraph({ text: " " }),
    
                    new Paragraph({ text: "Scope of Work", heading: HeadingLevel.HEADING_1 }),
                    ...editableProposal.scopeOfWork.split('\n').map(p => new Paragraph({children: [new TextRun(p)]})),
                    new Paragraph({ text: " " }),
    
                    new Paragraph({ text: "Equipment Schedule", heading: HeadingLevel.HEADING_1 }),
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        columnWidths: [1500, 4500, 1000, 1250, 1250],
                        rows: [
                            new TableRow({
                                tableHeader: true,
                                children: ["SKU", "Product Name", "Qty", "Dealer Price", "Dealer Total"].map(header => new TableCell({
                                    children: [new Paragraph({ children: [new TextRun({ text: header, bold: true })] })],
                                    margins: cellMargins,
                                })),
                            }),
                            ...editableProposal.equipmentList.map(item => new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph(item.sku)], margins: cellMargins }),
                                    new TableCell({ children: [new Paragraph(item.name)], margins: cellMargins }),
                                    new TableCell({ children: [new Paragraph({ text: item.quantity.toString(), alignment: AlignmentType.CENTER })], margins: cellMargins }),
                                    new TableCell({ children: [new Paragraph({ text: formatCurrency(item.dealerPrice), alignment: AlignmentType.RIGHT })], margins: cellMargins }),
                                    new TableCell({ children: [new Paragraph({ text: formatCurrency(item.dealerPrice * item.quantity), alignment: AlignmentType.RIGHT })], margins: cellMargins }),
                                ],
                            })),
                        ],
                    }),
                    new Paragraph({ text: " " }),
    
                    new Paragraph({ text: "Installation Plan", heading: HeadingLevel.HEADING_1 }),
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        columnWidths: [2000, 6500, 1000],
                        rows: [
                            new TableRow({
                                tableHeader: true,
                                children: ["Task", "Description", "Hours"].map(header => new TableCell({
                                    children: [new Paragraph({ children: [new TextRun({ text: header, bold: true })] })],
                                    margins: cellMargins,
                                })),
                            }),
                            ...editableProposal.installationPlan.map(task => new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph(task.task)], margins: cellMargins }),
                                    new TableCell({ children: [new Paragraph(task.description)], margins: cellMargins }),
                                    new TableCell({ children: [new Paragraph({ text: task.hours.toString(), alignment: AlignmentType.RIGHT })], margins: cellMargins }),
                                ],
                            })),
                        ]
                    }),
                    new Paragraph({ text: " " }),
    
                    new Paragraph({ text: "Project Investment Summary", heading: HeadingLevel.HEADING_1 }),
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        columnWidths: [6000, 3000],
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Hardware Subtotal:")] }),
                                    new TableCell({ children: [new Paragraph({ text: formatCurrency(totals.hardwareDealerTotal), alignment: AlignmentType.RIGHT })] }),
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph(`Installation Labour (${totals.totalHours} hrs @ ${formatCurrency(laborRate)}/hr):`)] }),
                                    new TableCell({ children: [new Paragraph({ text: formatCurrency(totals.laborTotal), alignment: AlignmentType.RIGHT })] }),
                                ]
                            }),
                            ...editableProposal.pricing.customCostItems.map(item => new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph(item.description)] }),
                                    new TableCell({ children: [new Paragraph({ text: formatCurrency(item.cost), alignment: AlignmentType.RIGHT })] }),
                                ]
                            })),
                             new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Grand Total:", bold: true })] })] }),
                                    new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: formatCurrency(totals.grandTotal), bold: true })] })] }),
                                ]
                            }),
                        ]
                    }),
                ],
            }],
        });
    
        Packer.toBlob(doc).then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style.display = "none";
            a.href = url;
            a.download = `${currentProject.projectName}_Proposal_v${editableProposal.version}.docx`;
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
    };

    const handleNodeClick = (node: DiagramNode) => {
        const product = productDatabase.find(p => p.sku === node.label || p.name === node.label);
        if (product) {
            setSelectedProduct(product);
        } else {
            setSelectedProduct({ sku: node.id, name: node.label, category: node.group, description: `A ${node.type} device located in the ${node.group}.`, dealerPrice: 0, msrp: 0, tags: [] });
        }
    };
    
    const handleEquipmentChange = (id: string, field: keyof EquipmentItem, value: string | number) => {
        setEditableProposal(p => {
            if (!p) return null;
            const newList = p.equipmentList.map(item => {
                if (item.id === id) {
                    const numValue = (typeof value === 'string' && (field === 'quantity' || field === 'dealerPrice' || field === 'msrp')) ? parseFloat(value) || 0 : value;
                    return { ...item, [field]: numValue };
                }
                return item;
            });
            return { ...p, equipmentList: newList };
        });
    };
    const handleAddEquipment = () => setEditableProposal(p => p ? { ...p, equipmentList: [...p.equipmentList, { id: uuidv4(), sku: 'CUSTOM-001', name: 'Custom Item', quantity: 1, dealerPrice: 0, dealerTotal: 0, msrp: 0, msrpTotal: 0, isCustom: true }] } : null);
    const handleRemoveEquipment = (id: string) => setEditableProposal(p => p ? { ...p, equipmentList: p.equipmentList.filter((item) => item.id !== id) } : null);

    const handleLaborChange = (id: string, field: keyof InstallationTaskItem, value: string | number) => {
        setEditableProposal(p => {
            if (!p) return null;
            const newList = p.installationPlan.map(item => {
                if (item.id === id) {
                    const numValue = (typeof value === 'string' && field === 'hours') ? parseFloat(value) || 0 : value;
                    return { ...item, [field]: numValue };
                }
                return item;
            });
            return { ...p, installationPlan: newList };
        });
    };
    const handleAddLabor = () => setEditableProposal(p => p ? { ...p, installationPlan: [...p.installationPlan, { id: uuidv4(), task: 'Custom Task', description: '', hours: 1, isCustom: true }] } : null);
    const handleRemoveLabor = (id: string) => setEditableProposal(p => p ? { ...p, installationPlan: p.installationPlan.filter((item) => item.id !== id) } : null);


    const handleCustomCostChange = (id: string, field: keyof CustomCostItem, value: string | number) => {
        setEditableProposal(p => {
            if (!p) return null;
            const newList = p.pricing.customCostItems.map(item => {
                if (item.id === id) {
                    const numValue = (field === 'cost' && typeof value === 'string') ? parseFloat(value) || 0 : value;
                    return { ...item, [field]: numValue };
                }
                return item;
            });
            return { ...p, pricing: { ...p.pricing, customCostItems: newList } };
        });
    };
    const handleAddCustomCost = () => setEditableProposal(p => p ? { ...p, pricing: { ...p.pricing, customCostItems: [...p.pricing.customCostItems, { id: uuidv4(), description: 'New Custom Cost', cost: 0 }] } } : null);
    const handleRemoveCustomCost = (id: string) => setEditableProposal(p => p ? { ...p, pricing: { ...p.pricing, customCostItems: p.pricing.customCostItems.filter((item) => item.id !== id) } } : null);

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
            <header className="mb-8 p-8 bg-white rounded-lg border border-gray-200 flex flex-col gap-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-800">{currentProject.projectName}</h1>
                        <p className="text-lg text-gray-500">Sales Proposal</p>
                        <p className="text-sm text-gray-500 mt-2">Date: {new Date(editableProposal.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {userProfile?.logoUrl ? (
                            <img src={userProfile.logoUrl} alt={`${userProfile.company} Logo`} className="max-h-20 max-w-xs object-contain" />
                        ) : <div className="h-20" />}
                        <div className="flex gap-2">
                           <button onClick={handleReset} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1 px-2 rounded-md transition-colors">Reset Pricing Changes</button>
                           <button onClick={handleTranslate} disabled={isTranslating} className="text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1 px-2 rounded-md transition-colors disabled:bg-gray-400">
                                {isTranslating ? 'Translating...' : 'Translate'}
                           </button>
                           <button onClick={handleDownloadDocx} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-md transition-colors">Download as Word (.docx)</button>
                        </div>
                         <div className="relative mt-2 w-full">
                            <select
                                value={editableProposal.proposalId}
                                onChange={(e) => navigate(`/proposal/${projectId}/${e.target.value}`)}
                                className="w-full text-xs p-1.5 border border-gray-300 rounded-md appearance-none bg-gray-50 text-center"
                            >
                                {sortedProposals.map(p => (
                                    <option key={p.proposalId} value={p.proposalId}>
                                        Version {p.version} ({new Date(p.createdAt).toLocaleString()})
                                    </option>
                                ))}
                            </select>
                        </div>
                       {translationError && <p className="text-red-500 text-xs mt-1 text-right">Translation Error: {translationError}</p>}
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8 border-t pt-6">
                    <div>
                        <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wider">Prepared By</h3>
                        <p className="font-bold text-lg text-gray-800 mt-2">{userProfile?.company || 'My Company'}</p>
                        <p className="text-gray-600">{userProfile?.name}</p>
                        <p className="text-gray-600">{userProfile?.email}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wider">Prepared For</h3>
                        <p className="font-bold text-lg text-gray-800 mt-2">{currentProject.clientName}</p>
                        <div className="space-y-2 mt-2">
                            <input name="clientContactName" value={clientDetails.clientContactName} onChange={handleClientDetailsChange} placeholder="Client Contact Name" className="block w-full p-1 border-b focus:border-b-2 focus:border-blue-500 outline-none bg-transparent" />
                            <input name="clientContactEmail" value={clientDetails.clientContactEmail} onChange={handleClientDetailsChange} placeholder="Client Contact Email" className="block w-full p-1 border-b focus:border-b-2 focus:border-blue-500 outline-none bg-transparent" />
                            <textarea name="clientAddress" value={clientDetails.clientAddress} onChange={handleClientDetailsChange} placeholder="Client Address" className="block w-full p-1 border-b focus:border-b-2 focus:border-blue-500 outline-none resize-none h-16 bg-transparent" />
                        </div>
                        <button onClick={handleSaveClientDetails} className="mt-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1 px-2 rounded-md transition-colors">Save Client Details</button>
                    </div>
                </div>
            </header>
            
            <div className="space-y-6">
                {renderSection("Executive Summary", <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: editableProposal.executiveSummary.replace(/\n/g, '<br />') }} />)}
                {renderSection("Scope of Work", <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: editableProposal.scopeOfWork.replace(/\n/g, '<br />') }} />)}
                {renderSection("System Diagram", <SystemDiagram ref={svgRef} diagram={editableProposal.systemDiagram} onNodeClick={handleNodeClick} />, <button onClick={handleDownloadSvg} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-md transition-colors">Download SVG</button>)}
                
                {renderSection("Visual Wall Layouts", (
                    <div className="space-y-8">
                        {currentProject.rooms.filter(r => r.wallLayout && (r.wallLayout.displays.length > 0 || r.wallLayout.outlets.length > 0)).length > 0 ? (
                            currentProject.rooms.map(room => (
                                <WallLayoutDisplay key={room.id} room={room} />
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No visual wall layouts were configured for this project.</p>
                        )}
                    </div>
                ))}

                {renderSection("Equipment Schedule", 
                    <>
                    <table className="w-full text-left">
                        <thead className="border-b bg-gray-50"><tr className="text-xs text-gray-600 uppercase">
                            <th className="p-3 font-semibold">SKU</th><th className="p-3 font-semibold">Product Name</th><th className="p-3 font-semibold text-center">Qty</th><th className="p-3 font-semibold text-right">Dealer Price</th><th className="p-3 font-semibold text-right">Dealer Total</th><th className="p-3 font-semibold text-right"></th>
                        </tr></thead>
                        <tbody>
                            {editableProposal.equipmentList.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50 group">
                                    <td className="p-2 w-40"><input type="text" value={item.sku} onChange={e => handleEquipmentChange(item.id, 'sku', e.target.value)} disabled={!item.isCustom} className="bg-transparent p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded" /></td>
                                    <td className="p-2"><input type="text" value={item.name} onChange={e => handleEquipmentChange(item.id, 'name', e.target.value)} disabled={!item.isCustom} className="bg-transparent p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded" /></td>
                                    <td className="p-2 w-24"><input type="number" value={item.quantity} onChange={e => handleEquipmentChange(item.id, 'quantity', e.target.value)} className="bg-transparent p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded text-center" /></td>
                                    <td className="p-2 w-32"><input type="number" value={item.dealerPrice} onChange={e => handleEquipmentChange(item.id, 'dealerPrice', e.target.value)} className="bg-transparent p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded text-right" /></td>
                                    <td className="p-2 text-right w-32 font-medium">{formatCurrency(item.dealerPrice * item.quantity)}</td>
                                    <td className="p-2 w-10 text-center"><button onClick={() => handleRemoveEquipment(item.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button></td>
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
                        {editableProposal.installationPlan.map((task) => (
                        <div key={task.id} className="p-3 bg-gray-50 rounded-md border group">
                            <div className="flex justify-between items-start">
                                <div className="flex-grow">
                                    <input type="text" value={task.task} onChange={e => handleLaborChange(task.id, 'task', e.target.value)} disabled={!task.isCustom} className="font-semibold text-base bg-transparent p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded" />
                                    <textarea value={task.description} onChange={e => handleLaborChange(task.id, 'description', e.target.value)} disabled={!task.isCustom} className="w-full bg-transparent text-sm text-gray-600 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded px-1 resize-y h-12" />
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <input type="number" value={task.hours} onChange={e => handleLaborChange(task.id, 'hours', e.target.value)} className="w-16 p-1 border rounded text-right"/>
                                    <span className="text-sm text-gray-600">hours</span>
                                    <button onClick={() => handleRemoveLabor(task.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
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
                                <span className="text-gray-600">Installation Labour ({totals.totalHours} hrs @</span>
                                <input type="number" value={laborRate} onChange={e => setLaborRate(Number(e.target.value) || 0)} className="w-20 p-1 border rounded-md text-right"/>
                                <span className="text-gray-600">/hr):</span>
                            </div>
                            <span>{formatCurrency(totals.laborTotal)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                           <h4 className="text-sm font-semibold text-gray-500 mb-2">Project Adjustments:</h4>
                           {editableProposal.pricing.customCostItems.map((item) => (
                               <div key={item.id} className="flex justify-between items-center group mb-1">
                                    <input type="text" value={item.description} onChange={e => handleCustomCostChange(item.id, 'description', e.target.value)} placeholder="Description" className="bg-transparent p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded"/>
                                    <div className="flex items-center gap-2">
                                        <input type="number" value={item.cost} onChange={e => handleCustomCostChange(item.id, 'cost', e.target.value)} className="bg-transparent p-1 w-28 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white rounded text-right"/>
                                        <button onClick={() => handleRemoveCustomCost(item.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
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