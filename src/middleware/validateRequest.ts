import  type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";



const validateRequest = (schema: ZodSchema, source = "body") => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {

    const data = source === "params" ? req.params : req.body;
    const result = schema.safeParse(data);

    if (!result.success) {
      const formatted = result.error.format();

      const flatError = Object.values(formatted)
        .flatMap((error: any) => error?._errors || []);

      console.log(flatError);

      const errorString = flatError.join(", ");

      res.status(400).json({
        success: false,
        message: errorString,
      });

      return;
    }

    next();
  };
};

export { validateRequest };