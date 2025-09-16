import express from "express";
import * as userController from "../controllers/userController.js";
const routes = express.Router();

//UNPROTECTED ROUTES

routes.get("/login", userController.login);
routes.get("/signup", userController.signup);

export default routes;
