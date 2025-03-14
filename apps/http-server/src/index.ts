import express from "express";
import z from "zod";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
const app = express();
import {
  signInObject,
  signUpObject,
  JWT_SECRET,
} from "@repo/backend-common/config";

app.use(express.json());

app.get("/", (req, res) => {
  res.json("This is a https-server for my page");
});

app.post("/signin", async (req, res) => {
  const body = req.body;
  const result = signInObject.safeParse(body);
  if (!result.success) {
    res.json("Message:Invalid inputs");
  }

  const email = body.email;
  const password = body.password;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (user) {
    const userId = 1;
    const token = jwt.sign({ userId }, JWT_SECRET);
    res.json({
      token,
    });
  } else {
    res.json("Message:User not found");
  }
});

app.post("/signup", async (req, res) => {
  const body = req.body;
  const result = signUpObject.safeParse(body);

  if (!result.success) {
    res.json("invalid Inputs");
  }
  const { name, email, password } = body;

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
    },
  });

  if (!user) {
    res.json("Some Error Occured");
  } else {
    const userId = 1;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!!);
    res.json({
      token,
    });
  }
});

app.get("/room", middleware, (req, res) => {});

app.listen(1212, () => {
  console.log("Started the server at port 1212");
});
