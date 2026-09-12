import { z } from "zod"

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(2, "Recipient name must be at least 2 characters"),
  email: z
    .string()
    .email("Valid email required for order confirmation receipt"),
  shipping_address: z
    .string()
    .min(8, "Please provide complete street address with unit/apartment number")
    .max(500, "Address is too long"),
  city: z
    .string()
    .min(2, "City is required"),
  postalCode: z
    .string()
    .min(4, "Postal/ZIP code must be at least 4 characters"),
  phone: z
    .string()
    .min(7, "Valid phone number required for delivery updates"),
  paymentMethod: z
    .enum(["credit_card", "cash_on_delivery", "digital_wallet"])
    .default("credit_card"),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
