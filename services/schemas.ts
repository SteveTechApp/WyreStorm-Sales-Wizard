import { Type } from '@google/genai';

export const ALL_SCHEMAS = {
    ROOM_DESIGNER_SCHEMA: {
        type: Type.OBJECT,
        properties: {
            functionalityStatement: { type: Type.STRING },
            manuallyAddedEquipment: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sku: { type: Type.STRING },
                        quantity: { type: Type.INTEGER },
                    },
                    required: ['sku', 'quantity'],
                },
            },
        },
        required: ['functionalityStatement', 'manuallyAddedEquipment'],
    },
    ROOM_CONNECTIVITY_SCHEMA: {
        type: Type.OBJECT,
        properties: {
            nodes: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        label: { type: Type.STRING },
                        type: { type: Type.STRING },
                    },
                    required: ['id', 'label', 'type'],
                },
            },
            edges: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        from: { type: Type.STRING },
                        to: { type: Type.STRING },
                        label: { type: Type.STRING },
                        type: { type: Type.STRING },
                    },
                    required: ['from', 'to', 'label', 'type'],
                },
            },
        },
        required: ['nodes', 'edges'],
    },
    PROJECT_INSIGHTS_SCHEMA: {
        type: Type.OBJECT,
        properties: {
            feedback: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, enum: ['Warning', 'Suggestion', 'Opportunity', 'Insight', 'Financial'] },
                        text: { type: Type.STRING },
                    },
                    required: ['type', 'text'],
                },
            },
        },
        required: ['feedback'],
    },
    REQUIREMENT_ANALYSIS_SCHEMA: {
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
                        displayType: { type: Type.STRING },
                        displayCount: { type: Type.INTEGER },
                        features: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    priority: { type: Type.STRING, enum: ['must-have', 'nice-to-have'] },
                                },
                                required: ['name', 'priority'],
                            },
                        },
                        functionalityStatement: { type: Type.STRING },
                    },
                    required: ['roomName', 'roomType', 'designTier', 'maxParticipants', 'displayType', 'displayCount', 'features', 'functionalityStatement'],
                },
            },
        },
        required: ['projectName', 'clientName', 'rooms'],
    },
    PROPOSAL_GENERATION_SCHEMA: {
        type: Type.OBJECT,
        properties: {
            executiveSummary: { type: Type.STRING },
            scopeOfWork: { type: Type.STRING },
            systemDiagram: {
                type: Type.OBJECT,
                properties: {
                    nodes: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING },
                                label: { type: Type.STRING },
                                type: { type: Type.STRING },
                            },
                            required: ['id', 'label', 'type'],
                        },
                    },
                    edges: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                from: { type: Type.STRING },
                                to: { type: Type.STRING },
                                label: { type: Type.STRING },
                                type: { type: Type.STRING },
                            },
                            required: ['from', 'to', 'label', 'type'],
                        },
                    },
                },
                required: ['nodes', 'edges'],
            },
            equipmentList: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sku: { type: Type.STRING },
                        name: { type: Type.STRING },
                        quantity: { type: Type.INTEGER },
                    },
                    required: ['sku', 'name', 'quantity'],
                },
            },
            installationPlan: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        phase: { type: Type.STRING },
                        tasks: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                        },
                    },
                    required: ['phase', 'tasks'],
                },
            },
            pricing: {
                type: Type.OBJECT,
                properties: {
                    hardwareTotal: { type: Type.NUMBER },
                    laborTotal: { type: Type.NUMBER },
                    ancillaryTotal: { type: Type.NUMBER },
                    grandTotal: { type: Type.NUMBER },
                },
                required: ['hardwareTotal', 'laborTotal', 'ancillaryTotal', 'grandTotal'],
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
                    required: ['roomName', 'improvement', 'additionalCost'],
                },
            },
        },
        required: ['executiveSummary', 'scopeOfWork', 'systemDiagram', 'equipmentList', 'installationPlan', 'pricing'],
    },
    ANCILLARY_COSTS_SCHEMA: {
        type: Type.OBJECT,
        properties: {
            cables: { type: Type.NUMBER },
            connectors: { type: Type.NUMBER },
            containment: { type: Type.NUMBER },
            fixings: { type: Type.NUMBER },
            materials: { type: Type.NUMBER },
        },
        required: ['cables', 'connectors', 'containment', 'fixings', 'materials'],
    },
     PRODUCT_FINDER_SCHEMA: {
        type: Type.OBJECT,
        properties: {
            products: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sku: { type: Type.STRING },
                        reason: { type: Type.STRING },
                    },
                    required: ['sku', 'reason'],
                },
            },
        },
        required: ['products'],
    },
    RELATED_PRODUCTS_SCHEMA: {
        type: Type.OBJECT,
        properties: {
            alternatives: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sku: { type: Type.STRING },
                        name: { type: Type.STRING },
                        reason: { type: Type.STRING },
                    },
                    required: ['sku', 'name', 'reason'],
                },
            },
            accessories: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sku: { type: Type.STRING },
                        name: { type: Type.STRING },
                        reason: { type: Type.STRING },
                    },
                    required: ['sku', 'name', 'reason'],
                },
            },
        },
        required: ['alternatives', 'accessories'],
    },
};
