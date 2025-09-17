import express from "express";
import * as userController from "../controllers/userController.js";
const routes = express.Router();

//UNPROTECTED ROUTES

routes.post("/login", userController.login);
routes.post("/signup", userController.signup);

export default routes;
