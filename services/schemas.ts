import { Type } from '@google/genai';

const DESIGN_FEEDBACK_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        feedback: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: {
                        type: Type.STRING,
                        enum: ['Warning', 'Suggestion', 'Opportunity', 'Insight', 'Financial']
                    },
                    text: {
                        type: Type.STRING
                    }
                },
                required: ['type', 'text']
            }
        }
    }
};

const EQUIPMENT_ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        sku: { type: Type.STRING, description: 'The product SKU from the database.' },
        quantity: { type: Type.INTEGER, description: 'The number of units required.' },
    },
    required: ['sku', 'quantity']
};

const ROOM_DESIGNER_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        functionalityStatement: {
            type: Type.STRING,
            description: "A client-facing paragraph describing the room's capabilities."
        },
        manuallyAddedEquipment: {
            type: Type.ARRAY,
            description: "The list of equipment selected for the room.",
            items: EQUIPMENT_ITEM_SCHEMA
        }
    },
    required: ['functionalityStatement', 'manuallyAddedEquipment']
};

const DIAGRAM_NODE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: 'Product SKU' },
        label: { type: Type.STRING, description: 'Product Name' },
        type: { type: Type.STRING, description: 'Product Category' }
    },
    required: ['id', 'label', 'type']
};

const DIAGRAM_EDGE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        from: { type: Type.STRING, description: 'Source node ID (SKU)' },
        to: { type: Type.STRING, description: 'Target node ID (SKU)' },
        label: { type: Type.STRING, description: 'Signal type description' },
        type: {
            type: Type.STRING,
            enum: ['video', 'audio', 'control', 'usb', 'network']
        }
    },
    required: ['from', 'to', 'label', 'type']
};

const ROOM_CONNECTIVITY_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        nodes: { type: Type.ARRAY, items: DIAGRAM_NODE_SCHEMA },
        edges: { type: Type.ARRAY, items: DIAGRAM_EDGE_SCHEMA }
    },
    required: ['nodes', 'edges']
};

const ANCILLARY_COSTS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        cables: { type: Type.NUMBER, description: "Estimated cost for all low-voltage cabling (HDMI, Cat6, speaker wire)." },
        connectors: { type: Type.NUMBER, description: "Estimated cost for all connectors and terminations." },
        containment: { type: Type.NUMBER, description: "Estimated cost for all cable containment (trunking, conduit, etc.)." },
        fixings: { type: Type.NUMBER, description: "Estimated cost for all fixings (screws, mounts, brackets)." },
        materials: { type: Type.NUMBER, description: "Estimated cost for other sundry materials." },
    },
    required: ['cables', 'connectors', 'containment', 'fixings', 'materials']
};

const PROPOSAL_GENERATION_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        executiveSummary: { type: Type.STRING },
        scopeOfWork: { type: Type.STRING },
        systemDiagram: ROOM_CONNECTIVITY_SCHEMA,
        equipmentList: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    roomName: { type: Type.STRING },
                    sku: { type: Type.STRING },
                    quantity: { type: Type.INTEGER },
                },
                required: ['roomName', 'sku', 'quantity']
            }
        },
        installationPlan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    phase: { type: Type.STRING },
                    tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['phase', 'tasks']
            }
        },
        pricing: {
            type: Type.OBJECT,
            properties: {
                hardwareTotal: { type: Type.NUMBER },
                laborTotal: { type: Type.NUMBER },
                ancillaryTotal: { type: Type.NUMBER },
                grandTotal: { type: Type.NUMBER },
            },
            required: ['hardwareTotal', 'laborTotal', 'ancillaryTotal', 'grandTotal']
        },
        suggestedImprovements: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    roomName: { type: Type.STRING },
                    improvement: { type: Type.STRING },
                    additionalCost: { type: Type.NUMBER },
                },
                required: ['roomName', 'improvement', 'additionalCost']
            }
        }
    },
    required: ['executiveSummary', 'scopeOfWork', 'systemDiagram', 'equipmentList', 'installationPlan', 'pricing']
};

const RELATED_PRODUCT_SUGGESTION_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        sku: { type: Type.STRING },
        name: { type: Type.STRING },
        reason: { type: Type.STRING }
    },
    required: ['sku', 'name', 'reason']
};

const RELATED_PRODUCTS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        alternatives: { type: Type.ARRAY, items: RELATED_PRODUCT_SUGGESTION_SCHEMA },
        accessories: { type: Type.ARRAY, items: RELATED_PRODUCT_SUGGESTION_SCHEMA }
    },
    required: ['alternatives', 'accessories']
};

const PRODUCT_FINDER_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        products: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: { sku: { type: Type.STRING } },
                required: ['sku']
            }
        }
    },
    required: ['products']
};

const REQUIREMENT_ANALYSIS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        projectName: { type: Type.STRING },
        clientName: { type: Type.STRING },
        rooms: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    roomName: { type: Type.STRING },
                    roomType: { type: Type.STRING },
                    designTier: { type: Type.STRING, enum: ['Bronze', 'Silver', 'Gold'] },
                    maxParticipants: { type: Type.INTEGER },
                    displayType: { type: Type.STRING, description: "The type of display, e.g., 'Projector' or 'LCD Panel'." },
                    displayCount: { type: Type.INTEGER, description: "The number of displays." },
                    features: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                priority: { type: Type.STRING, enum: ['must-have', 'nice-to-have'] }
                            },
                            required: ['name', 'priority']
                        }
                    },
                    functionalityStatement: { type: Type.STRING }
                },
                required: ['roomName', 'roomType', 'designTier', 'maxParticipants', 'features', 'functionalityStatement']
            }
        }
    },
    required: ['projectName', 'clientName', 'rooms']
};


export const ALL_SCHEMAS = {
    PROJECT_INSIGHTS_SCHEMA: DESIGN_FEEDBACK_SCHEMA,
    ROOM_DESIGNER_SCHEMA,
    ROOM_CONNECTIVITY_SCHEMA,
    PROPOSAL_GENERATION_SCHEMA,
    RELATED_PRODUCTS_SCHEMA,
    PRODUCT_FINDER_SCHEMA,
    REQUIREMENT_ANALYSIS_SCHEMA,
    ANCILLARY_COSTS_SCHEMA,
};