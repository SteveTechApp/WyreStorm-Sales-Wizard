import { RoomData, Product } from '../../utils/types.ts';
import { TECHNICAL_DATABASE } from '../../data/technicalDatabase.ts';
import { getCorePrinciples } from './designRoom/corePrinciples.ts';
import { getFeatureDrivenDesignLogic } from './designRoom/featureDrivenDesign.ts';
import { getControlSystemLogic } from './designRoom/controlSystemLogic.ts';
import { getVideoWallLogic } from './designRoom/videoWallLogic.ts';
import { getAvoipLogic } from './designRoom/avoipLogic.ts';
import { getSignalExtensionLogic } from './designRoom/signalExtensionLogic.ts';
import { getProductCompatibilityRules } from './designRoom/productCompatibility.ts';

export const generateDesignPrompt = (
  room: RoomData,
  productDatabase: Product[],
  valueEngineeringInstruction = ''
): string => {
  const productDbString = JSON.stringify(
    productDatabase.map(p => ({ 
      sku: p.sku, name: p.name, category: p.category, 
      description: p.description, tags: p.tags, status: p.status 
    })), null, 2
  );

  return `
  You are an expert AV System Designer for WyreStorm. Your task is to select the appropriate equipment for the given room requirements from the provided product database.

  Room Details:
  - Name: ${room.roomName}
  - Type: ${room.roomType}
  - Tier: ${room.designTier}
  - Functionality Statement: ${room.functionalityStatement}
  - Key Features Required: ${room.features.map(f => `${f.name} (${f.priority})`).join(', ') || 'None'}
  - IO Points: ${JSON.stringify(room.ioRequirements, null, 2)}
  - Control System: ${room.technicalDetails.controlSystem}
  ${room.videoWallConfig ? `- Video Wall Config: ${JSON.stringify(room.videoWallConfig)}` : ''}
  - AVoIP System Selected: ${room.technicalDetails.avoipSystem || 'None'}

  Available WyreStorm Products (use ONLY these products):
  ${productDbString}
  
  Technical Reference Material:
  ${TECHNICAL_DATABASE}

  ${getFeatureDrivenDesignLogic()}
  ${getCorePrinciples()}
  ${getControlSystemLogic()}
  ${getVideoWallLogic()}
  ${getSignalExtensionLogic()}
  ${getAvoipLogic()}
  ${getProductCompatibilityRules()}
  
  ${valueEngineeringInstruction}

  Based on all rules and the room details, perform the following tasks:
  1. Write a concise, one-paragraph "functionalityStatement".
  2. Create a list of equipment in the "manuallyAddedEquipment" array.
     - You MUST select products ONLY from the provided database.
     - Specify the SKU and quantity for each item.

  Return only valid JSON. Do not include markdown formatting or explanations.
  `;
};
