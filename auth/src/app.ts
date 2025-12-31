import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { singinRouter } from "./routes/signin";
import { singoutRouter } from "./routes/signout";
import { singupRouter } from "./routes/singup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();

app.use(express.json());

app.set("trust proxy", true);

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(singinRouter);
app.use(singoutRouter);
app.use(singupRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
