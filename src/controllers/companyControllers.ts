import type { Request, Response } from "express";
import { prisma } from "../config/db.js";

// Company -> Products, Reviews
// add Company
  // steps
  // 1. validate input
  // 2. check if company already exists
  // 3. create company
  // 4. return response
  
// update company
  // steps
  // 1. validate input
  // 2. check if company exists
  // 3. check if user is owner of the company
  // 4. update company
  // 5. return response

// delete company
  // steps
  // 1. check if company exists
  // 2. check if user is owner of the company
  // 3. delete company
  // 4. return response

// get all companies
  // steps
  // 1. get query params for pagination and filtering
  // 2. build filters dynamically based on query params
  // 3. fetch companies from database with filters and pagination
  // 4. return response

// get single company
  // steps
  // 1. validate company id
  // 2. fetch company from database with products and reviews
  // 3. return response



// GET ALL COMPANIES
// Pagination + Filtering

//addCompany
const addCompany = async (req: Request, res: Response) => {
  try {
    const { name, location, description } = req.body;

    // // Check if company already exists
    // const existingCompany = await prisma.company.findFirst({
    //   where: { 
    //     name: req.body.name,
    //     location: req.body.location
    //    },
    // });

    // if (existingCompany) {
    //   return res.status(400).json({ error: "Company already exists" });
    // }

    // Create company
    const company = await prisma.company.create({
      data: { 
        name, 
        location, 
        description,
        ownerId: req.user.id, // Assuming req.user is set by auth middleware
      },
    });

    const  { ownerId: _, ...safeCompany } = company; // remove ownerId from the response
    res.status(201).json({ 
      "success": true,
      "data": safeCompany
    });

  } catch (error : any) {
    console.error("Error adding company:", error);
    if (error.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Company already exists",
    });
  }
    res.status(500).json({ error: "Internal server error" + (error instanceof Error ? error.message : "Unknown error") });
  }
};


//updateCompany
// update company
  // steps
  // 1. validate input
  // 2. check if company exists
  // 3. check if user is owner of the company
  // 4. update company
  // 5. return response

const updateCompany = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id as string;
    const { name, location, description } = req.body;

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Check if user is owner of the company
    if (company.ownerId !== req.user.id) {
      return res.status(403).json({ error: "You are not the owner of this company" });
    }

    // Update company
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: { name, location, description },
    });

    res.json({ success: true, data: updatedCompany });
  } catch (error : any) {
    console.error("Error updating company:", error);
    res.status(500).json({ error: "Internal server error" + (error instanceof Error ? error.message : "Unknown error") });
  }
};


// delete company
  // steps
  // 1. check if company exists
  // 2. check if user is owner of the company
  // 3. delete company
  // 4. return response

  const deleteCompany = async (req: Request, res: Response) => {
    try {
      const companyId = req.params.id as string;  
      
      //check if company exists
      const company = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      // Check if user is owner of the company
      if (company.ownerId !== req.user.id) {
        return res.status(403).json({ error: "You are not the owner of this company" });
      }

      // Delete company
      await prisma.company.delete({
        where: { id: companyId },
      });

      res.json({ success: true, message: "Company deleted successfully" });
    } catch (error : any) {
      console.error("Error deleting company:", error);
      res.status(500).json({ error: "Internal server error" + (error instanceof Error ? error.message : "Unknown error") });
    }
  };

export { addCompany, updateCompany, deleteCompany };