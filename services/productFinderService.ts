import { productDatabase } from "../data/productDatabase";
import { Product } from "../utils/types";

/**
 * Finds products based on a search query.
 * This is a simple implementation. A more advanced version could use Gemini
 * for natural language queries.
 */
export const findProducts = (query: string): Product[] => {
  if (!query.trim()) {
    return [];
  }
  const lowercasedQuery = query.toLowerCase();
  return productDatabase.filter(
    (p) =>
      p.name.toLowerCase().includes(lowercasedQuery) ||
      p.sku.toLowerCase().includes(lowercasedQuery) ||
      p.description.toLowerCase().includes(lowercasedQuery) ||
      p.category.toLowerCase().includes(lowercasedQuery) ||
      p.tags.some((t) => t.toLowerCase().includes(lowercasedQuery))
  );
};