import * as z from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email(),
  avatar: z.string().optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zip: z.string().optional(),
  }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  jobTitle: z.string().optional(),
  jobTitleAr: z.string().optional(),
  bio: z.string().optional(),
  bioAr: z.string().optional(),
  experience: z.coerce.number().min(0).optional(),
  isHiring: z.boolean().optional(),
  skills: z.array(z.string()).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
