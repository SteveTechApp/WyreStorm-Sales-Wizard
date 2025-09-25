import { ProjectData, UserProfile, ManuallyAddedEquipment } from './types';
import { calculateProjectCosts } from './utils';

// Helper to escape CSV fields to handle commas, quotes, and newlines
const escapeCsvField = (field: any): string => {
    const stringField = String(field ?? '');
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
};

// Helper to trigger the file download in the browser
const downloadCsv = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

/**
 * Aggregates all equipment from the project and exports it to a CSV file.
 * @param project The project data.
 * @param userProfile The user's profile for currency information.
 */
export const exportEquipmentToCsv = (project: ProjectData, userProfile: UserProfile | null) => {
    const formatCurrency = (amount: number) => {
        // Return just the number for better spreadsheet compatibility
        return amount.toFixed(2);
    };

    const aggregatedEquipment: { [sku: string]: ManuallyAddedEquipment } = {};
    project.rooms.forEach(room => {
        room.manuallyAddedEquipment.forEach(item => {
            if (aggregatedEquipment[item.sku]) {
                aggregatedEquipment[item.sku].quantity += item.quantity;
            } else {
                aggregatedEquipment[item.sku] = { ...item };
            }
        });
    });

    const headers = ['SKU', 'Name', 'Category', 'Quantity', `Unit Price (${userProfile?.currency || ''})`, `Total Price (${userProfile?.currency || ''})`];
    const rows = Object.values(aggregatedEquipment).map(item => [
        item.sku,
        item.name,
        item.category,
        item.quantity,
        formatCurrency(item.dealerPrice),
        formatCurrency(item.dealerPrice * item.quantity)
    ]);

    let csvContent = headers.map(escapeCsvField).join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(escapeCsvField).join(',') + '\n';
    });

    downloadCsv(csvContent, `${project.projectName.replace(/\s/g, '_')}_equipment_list.csv`);
};

/**
 * Calculates project costs and exports the summary to a CSV file.
 * @param project The project data.
 * @param userProfile The user's profile, required for cost calculations.
 */
export const exportCostSummaryToCsv = (project: ProjectData, userProfile: UserProfile | null) => {
    if (!userProfile) {
        alert("Cannot export cost summary without a user profile containing currency and labor rate information.");
        return;
    }
    
    const costs = calculateProjectCosts(project, userProfile);
    const formatCurrency = (amount: number) => {
        return amount.toFixed(2);
    };

    const headers = ['Item', `Cost (${userProfile.currency})`];
    const rows = [
        ['Hardware Total', formatCurrency(costs.hardwareTotal)],
        ['Estimated Labour Total', formatCurrency(costs.laborTotal)],
        ['Ancillary Materials Total', formatCurrency(costs.ancillaryTotal)],
        ['Estimated Grand Total', formatCurrency(costs.grandTotal)]
    ];

    let csvContent = headers.map(escapeCsvField).join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(escapeCsvField).join(',') + '\n';
    });

    downloadCsv(csvContent, `${project.projectName.replace(/\s/g, '_')}_cost_summary.csv`);
};
