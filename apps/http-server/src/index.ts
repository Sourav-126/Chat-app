import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { middleware } from "./middleware";
import { prismaClient } from "@repo/db/client";
const app = express();
import {
  signInObject,
  signUpObject,
  createRoomObject,
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

  const user = await prismaClient.user.findFirst({
    where: {
      email: result.data?.email ?? "",
    },
  });
  if (user) {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
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

  const user = await prismaClient.user.create({
    data: {
      name: result.data?.name ?? "",
      email: result.data?.email ?? "",
      password: result.data?.password ?? "",
    },
  });

  if (!user) {
    res.json("Some Error Occured");
  } else {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({
      token,
    });
  }
});

app.post("/room", middleware, async (req, res) => {
  const parsedData = createRoomObject.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "invalid INputs",
    });
    return;
  }
  //@ts-ignore  TODO: This is a type error (FIx)
  const userId = req.userId;
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json("Room already created with this name ");
  }
});

app.listen(1212, () => {
  console.log("Started the server at port 1212");
});
