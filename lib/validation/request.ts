import { z } from "zod";

export const createRequestSchema = z.object({
  citizen_name: z.string().min(3, "Numele este obligatoriu"),
  citizen_email: z.string().email("Email invalid"),
  citizen_phone: z.string().optional(),
  title: z.string().min(5, "Titlul trebuie să aibă minim 5 caractere"),
  description: z.string().min(20, "Descrierea trebuie să aibă minim 20 caractere"),
  category: z.string().min(1, "Categoria este obligatorie"),
  district: z.string().min(1, "Zona este obligatorie"),
  address: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

export const trackRequestSchema = z.object({
  code: z.string().min(5, "Cod invalid"),
  email: z.string().email("Email invalid"),
});