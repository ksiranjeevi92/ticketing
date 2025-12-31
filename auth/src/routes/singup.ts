import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.get("/api/users/signup", (req, res) => {
  res.send("Hi");
});

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 30"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const exisitngUser = await User.findOne({ email });

    if (exisitngUser) {
      console.log("Email in use");
      throw new BadRequestError("Email in use");
    }
    const user = User.build({ email, password });

    await user.save();

    //Generate JWT
    const userJwt = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    //Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as singupRouter };
