import { Packer, Document, Paragraph, TextRun, HeadingLevel, ImageRun } from 'docx';
// FIX: Add file extension to satisfy module resolution for types.ts
import { Proposal, ProjectData, UserProfile } from './types.ts';

type DocxImageType = 'png' | 'jpeg' | 'gif' | 'bmp';

const getImageBuffer = async (url: string): Promise<{ data: string; type: DocxImageType } | undefined> => {
    try {
        if (url.startsWith('data:image')) {
            const mimeTypeMatch = url.match(/^data:image\/(png|jpeg|gif|bmp);base64,/);
            if (!mimeTypeMatch) throw new Error('Invalid data URL for image');
            
            let type = mimeTypeMatch[1] === 'jpeg' ? 'jpeg' : mimeTypeMatch[1];
            const base64 = url.replace(mimeTypeMatch[0], '');
            return { data: base64, type: type as DocxImageType };
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

        const arrayBuffer = await response.arrayBuffer();
        let binary = '';
        const bytes = new Uint8Array(arrayBuffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const data = window.btoa(binary);
        
        const contentType = response.headers.get('content-type') || 'image/png';
        const typeMatch = contentType.match(/image\/(png|jpeg|gif|bmp)/);
        let type = (typeMatch ? (typeMatch[1] === 'jpeg' ? 'jpeg' : typeMatch[1]) : 'png');

        return { data, type: type as DocxImageType };

    } catch (e) {
        console.error("Failed to process image for document:", e);
        return undefined;
    }
};

export const exportProposalToDocx = async (projectData: ProjectData, proposal: Proposal, userProfile: UserProfile | null) => {
    const logoImage = userProfile?.logoUrl ? await getImageBuffer(userProfile.logoUrl) : undefined;
    
    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({
                    children: [ new TextRun({ text: projectData.projectName, bold: true, size: 48 }) ],
                }),
                new Paragraph({ text: `Proposal for: ${projectData.clientName}`, heading: HeadingLevel.HEADING_2 }),
                ...(logoImage ? [new Paragraph({ children: [ new ImageRun({ type: logoImage.type, data: logoImage.data, transformation: { width: 100, height: 100 } }) ] })] : []),
                new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
                ...proposal.executiveSummary.split('\n').map(p => new Paragraph(p)),
            ],
        }],
    });
    
    Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${projectData.projectName.replace(/\s/g, '_')}_v${proposal.version}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
};