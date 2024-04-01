import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  getAllOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        purchaseOrderId: true,
        purchaseOrder: {
          select: {
            billTo: {
              select: { id: true, name: true },
            },
            orderItems: {
              select: {
                quantity: true,
              },
            },

            document: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
            createdAt: true,
          },
        },
        salesOrder: {
          select: {
            orderItems: {
              select: {
                quantity: true,
              },
            },
            document: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
            createdAt: true,
          },
        },
        commercialInvoice: {
          select: {
            destinationCountry: true,
            OrderItem: {
              select: {
                quantity: true,
              },
            },
            document: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
            createdAt: true,
          },
        },
        OrderQuantities: {
          select: {
            OrderItems: {
              select: {
                quantity: true,
              },
            },
            InventoryStatus: {
              select: {
                document: {
                  select: {
                    id: true,
                    name: true,
                    url: true,
                  },
                },
              },
            },
            createdAt: true,
          },
        },
        orderConfirmation: {
          select: {
            OrderItem: {
              select: {
                quantity: true,
              },
            },
            document: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
            createdAt: true,
          },
        },

        deliveryNote: {
          select: {
            document: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
            createdAt: true,
          },
        },
        AlcoholDocument: {
          select: {
            document: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
            createdAt: true,
          },
        },
        Eur1Document: {
          select: {
            document: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
            createdAt: true,
          },
        },
        shipments: {
          select: {
            OrderItem: {
              select: {
                quantity: true,
              },
            },
            document: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
            createdAt: true,
          },
        },
        ShipmentPreAlerts: {
          select: {
            document: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
            createdAt: true,
          },
        },
        CustomClearance: {
          select: {
            document: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
            createdAt: true,
          },
        },
        Trc2Document: {
          select: {
            document: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
            createdAt: true,
          },
        },
        FinalCommercialInvoice: {
          select: {
            document: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
            createdAt: true,
          },
        },
        orderDate: true,
        totalAmount: true,
      },
    });
    return orders;
  }),
});
