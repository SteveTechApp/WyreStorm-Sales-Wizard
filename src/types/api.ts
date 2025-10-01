export interface DesignFeedbackItem {
  type: 'Warning' | 'Suggestion' | 'Opportunity' | 'Insight' | 'Financial';
  text: string;
}

export interface RelatedProductsPayload {
  alternatives: { sku: string; name: string; reason: string }[];
  accessories: { sku: string; name: string; reason: string }[];
}

export interface IncomingRequest {
  requestId: string;
  clientName: string;
  description: string;
  status: 'tentative' | 'confirmed';
  createdAt: number;
}
