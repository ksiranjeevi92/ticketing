import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { Password } from "../services/password";

import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.post(
  "/api/users/singin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must supply passowrd"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const exisitngUser = await User.findOne({ email });

    if (!exisitngUser) {
      throw new BadRequestError("Invalid credentials");
    }
    const passwordMatch = await Password.compare(
      exisitngUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials!");
    }
    //Generate JWT
    const userJwt = jwt.sign(
      {
        id: exisitngUser._id,
        email: exisitngUser.email,
      },
      process.env.JWT_KEY!
    );

    //Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(exisitngUser);
  }
);

export { router as singinRouter };
