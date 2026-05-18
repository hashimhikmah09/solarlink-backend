import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addCompanySchema, deleteCompanySchema, updateCompanySchema } from "../validations/companyValidation.js";
import { addCompany, updateCompany,deleteCompany } from "../controllers/companyControllers.js";


const router = express.Router();
router.use(authMiddleware);

router.post("/", validateRequest(addCompanySchema), addCompany);  


// //update company route
router.put("/:id", validateRequest(updateCompanySchema), updateCompany);


// // remove company route
router.delete("/delete/:id", validateRequest(deleteCompanySchema, "params" ), deleteCompany);


    

export default router;