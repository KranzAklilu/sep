import { orderSeed } from "./order";
import { userSeed } from "./user";

const seed = async () => {
  await userSeed();
  console.log("Finished seeding users");
  await orderSeed();
  console.log("Finished seeding orders");
};
seed();
