import { Router } from "express";
import {
  deleteCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from "../controllers/customers";
import auth, { roleGuardMiddleware } from "../middlewares/auth";
import csrfProtection from "../middlewares/csrf";
import { validateCustomerUpdate } from "../middlewares/validations";
import { Role } from "../models/user";

const customerRouter = Router();

customerRouter.use(auth, roleGuardMiddleware(Role.Admin));

customerRouter.get("/", getCustomers);

customerRouter.get("/:id", getCustomerById);

customerRouter.patch(
  "/:id",
  csrfProtection,
  validateCustomerUpdate,
  updateCustomer,
);

customerRouter.delete("/:id", csrfProtection, deleteCustomer);

export default customerRouter;
