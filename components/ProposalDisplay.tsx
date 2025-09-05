import React from 'react';
import { Proposal, ProjectData, UserProfile, EquipmentItem, UnitSystem, Currency } from '../types';
import MermaidDiagram from './MermaidDiagram';
import Logo from './Logo';
import { CURRENCY_OPTIONS } from '../constants';

interface ProposalDisplayProps {
  proposal: Proposal;
  projectData: ProjectData;
  userProfile: UserProfile | null;
  unitSystem: UnitSystem;
}

const ProposalDisplay: React.FC<ProposalDisplayProps> = ({ proposal, projectData, userProfile, unitSystem }) => {
    
    const formatCurrency = (amount: number) => {
        const currency = proposal.pricing.currency || 'GBP';
        const localeString = {
            'GBP': 'en-GB',
            'USD': 'en-US',
            'EUR': 'de-DE'
        }[currency];
        return new Intl.NumberFormat(localeString, { style: 'currency', currency }).format(amount);
    };

    const exportToCsv = () => {
        const currency = proposal.pricing.currency || 'GBP';
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += `SKU,Product Name,Quantity,Dealer Price (${currency}),Dealer Total (${currency}),MSRP (${currency}),MSRP Total (${currency})\r\n`;
        proposal.equipmentList.forEach(item => {
            const row = [item.sku, `"${item.name.replace(/"/g, '""')}"`, item.quantity, item.dealerPrice, item.dealerTotal, item.msrp, item.msrpTotal].join(",");
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
    
    const renderSection = (title: string, content: React.ReactNode) => (
        <section className="p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-[#008A3A] border-b-2 border-gray-200 pb-2 mb-4">{title}</h2>
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
                <div className="text-right">
                    {userProfile?.logoUrl ? <img src={userProfile.logoUrl} alt="Company Logo" className="max-h-16 ml-auto mb-2" /> : <div className="mb-2"><Logo /></div>}
                    <p className="font-semibold">{userProfile?.company}</p><p className="text-sm text-gray-600">{userProfile?.name}</p><p className="text-sm text-gray-600">{userProfile?.email}</p>
                </div>
            </header>
            
            <div className="space-y-6">
                {renderSection("Executive Summary", <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: proposal.executiveSummary.replace(/\n/g, '<br />') }} />)}
                {renderSection("Scope of Work", <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: proposal.scopeOfWork.replace(/\n/g, '<br />') }} />)}
                {renderSection("System Diagram", <MermaidDiagram chart={proposal.systemDiagram} onNodeClick={() => {}} />)}

                <div className="p-6 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-4">
                        <h2 className="text-2xl font-bold text-[#008A3A]">Equipment Schedule</h2>
                        <button onClick={exportToCsv} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-md transition-colors">Export to CSV</button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="border-b bg-gray-50"><tr className="text-xs text-gray-600 uppercase">
                            <th className="p-3 font-semibold">SKU</th><th className="p-3 font-semibold">Product Name</th><th className="p-3 font-semibold text-center">Qty</th><th className="p-3 font-semibold text-right">Dealer Price</th><th className="p-3 font-semibold text-right">Dealer Total</th><th className="p-3 font-semibold text-right">MSRP</th>
                        </tr></thead>
                        <tbody>
                            {proposal.equipmentList.map((item: EquipmentItem) => (
                                <tr key={item.sku} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-mono text-sm">{item.sku}</td><td className="p-3">{item.name}</td><td className="p-3 text-center">{item.quantity}</td>
                                    <td className="p-3 text-right">{formatCurrency(item.dealerPrice)}</td><td className="p-3 text-right font-medium">{formatCurrency(item.dealerTotal)}</td><td className="p-3 text-right text-gray-500">{formatCurrency(item.msrp)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {renderSection("Installation Plan", <ul className="space-y-3">{proposal.installationPlan.map((task) => (<li key={task.task} className="p-3 bg-gray-50 rounded-md border"><div className="flex justify-between items-center"><h4 className="font-semibold text-gray-800">{task.task}</h4><span className="text-sm font-medium text-gray-600">{task.hours} hours</span></div><p className="text-sm text-gray-600 mt-1">{task.description}</p></li>))}</ul>)}
                
                {proposal.siteRequirements && proposal.siteRequirements.length > 0 && renderSection("Project Prerequisites", <ul className="list-disc list-inside space-y-2">{proposal.siteRequirements.map(req => <li key={req}>{req}</li>)}</ul>)}

                <div className="p-6 bg-white rounded-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-[#008A3A] border-b-2 border-gray-200 pb-2 mb-4">Project Investment Summary</h2>
                    <div className="max-w-xl ml-auto space-y-2">
                        <div className="flex justify-between font-medium"><span className="text-gray-600">Hardware Subtotal (Dealer):</span><span>{formatCurrency(proposal.pricing.hardwareDealerTotal)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Installation Labor ({proposal.installationPlan.reduce((acc, t) => acc + t.hours, 0)} hrs):</span><span>{formatCurrency(proposal.pricing.laborTotal)}</span></div>
                        {proposal.pricing.customCostItems.map(item => (
                            <div key={item.id} className="flex justify-between"><span className="text-gray-600">{item.description}:</span><span>{formatCurrency(item.cost)}</span></div>
                        ))}
                        <hr className="my-2"/>
                        <div className="flex justify-between text-xl font-bold pt-2 border-t mt-2 text-gray-800"><span>Grand Total:</span><span>{formatCurrency(proposal.pricing.grandTotal)}</span></div>
                         <div className="flex justify-between text-sm text-gray-500 pt-2"><span className="italic">MSRP Hardware Total (for reference):</span><span className="italic">{formatCurrency(proposal.pricing.hardwareMsrpTotal)}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProposalDisplay;