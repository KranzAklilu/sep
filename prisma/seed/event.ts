import { db } from "~/server/db";

export async function eventSeed() {
  for (let i = 0; i < 1; i++) {
    await db.event.create({
      data: {
        name: "Name" + i,
        price: 100,
        featured: i === 1 || i === 2,
        Venue: {
          create: {
            name: "venue " + i,
            capacity: 0,
            phone: "",
            pricePerHour: 10,
            availableDate: [0],
            location: "location" + i,
            description: "",
            Owner: {
              connect: {
                email: "vo@sep.com",
              },
            },
            closeHour: "11:00",
            openHour: "9:00",
          },
        },
        date: new Date(),
        startTime: "10:00",
        endTime: "11:00",
        attendeeLimit: 20,
        description: "description",
        Owner: {
          connect: {
            email: "ep@sep.com",
          },
        },
      },
    });
  }
}
