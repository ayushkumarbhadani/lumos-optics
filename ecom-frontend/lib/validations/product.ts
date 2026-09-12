import { z } from "zod"

export const productSchema = z.object({
  title: z
    .string()
    .min(2, "Product title must be at least 2 characters")
    .max(200, "Title is too long"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters"),
  price: z
    .number({ message: "Price must be a valid number" })
    .positive("Price must be greater than 0"),
  stock: z
    .number({ message: "Stock count must be a number" })
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),
  sku: z
    .string()
    .min(3, "SKU must be at least 3 characters")
    .max(50, "SKU too long"),
  image_url: z
    .string()
    .optional()
    .or(z.literal("")),
  category_id: z
    .number({ message: "Category selection is required" })
    .positive("Select a category"),
})

export type ProductFormData = z.infer<typeof productSchema>

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Name too long"),
  description: z
    .string()
    .optional(),
})

export type CategoryFormData = z.infer<typeof categorySchema>
