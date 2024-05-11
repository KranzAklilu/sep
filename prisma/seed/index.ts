import { deleteAll } from "./deleteAll";
import { eventSeed } from "./event";
import { venueSeed } from "./venue";
import { userSeed } from "./user";

const seed = async () => {
  await deleteAll();
  console.log("Deleted all data");
  await userSeed();
  console.log("Finished seeding users");
  await eventSeed();
  console.log("Finished seeding events");
  // await venueSeed();
  console.log("Finished seeding venues");
};
seed();
