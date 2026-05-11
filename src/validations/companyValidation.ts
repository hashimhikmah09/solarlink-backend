import { z } from "zod";

/**
 * Add Product Schema
 */
export const createProductSchema = z.object({

  name: z
    .string()
    .min(2, "Product name is required"),

  price: z
    .number()
    .positive("Price must be positive"),

  description: z
    .string()
    .min(5, "Description is required"),
});