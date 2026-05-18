import { z } from "zod";


// Add Company Schema to validator
 
export const addCompanySchema = z.object({
  ownerId: z.string().uuid().optional(),
  name: z.string(),
  location: z.string(),
  description: z.string(),
});


//Update Company Schema to validator
export const updateCompanySchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  description: z.string(),
});

//delete company schema
export const deleteCompanySchema = z.object({
  id: z.string().uuid(),
});