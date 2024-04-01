import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const documentRouter = createTRPCRouter({
  getDocument: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.document.findUniqueOrThrow({
        where: { id: input.id },
        select: {
          id: true,
          url: true,
          name: true,
          type: true,
          createdAt: true,
          PurchaseOrder: {
            select: {
              id: true,
              Order: {
                select: {
                  id: true,
                },
              },
              orderItems: {
                select: {
                  Product: {
                    select: {
                      id: true,
                      description: true,
                    },
                  },
                  quantity: true,
                  rate: true,
                  amount: true,
                  taxRate: true,
                  taxAmnt: true,
                  grossAmnt: true,
                },
              },
              createdAt: true,
            },
          },
          CommercialInvoice: {
            select: {
              createdAt: true,
              order: {
                select: {
                  orderDate: true,
                  deliveryDate: true,
                },
              },
              OrderItem: {
                select: {
                  Product: {
                    select: {
                      id: true,
                      description: true,
                    },
                  },
                  quantity: true,
                  unitPrice: true,
                  amount: true,
                },
              },
            },
          },

          SalesOrder: {
            select: {
              deliveryDate: true,
              pickUpStarting: true,
              address: {
                select: {
                  full: true,
                },
              },
              orderItems: {
                select: {
                  quantity: true,
                  Product: {
                    select: {
                      id: true,
                      description: true,
                    },
                  },
                },
              },
              createdAt: true,
            },
          },
          InventoryStatus: {
            select: {
              OrderQuantities: {
                select: {
                  loadingRef: true,
                  OrderItems: {
                    select: {
                      case: true,
                      Product: {
                        select: {
                          id: true,
                        },
                      },
                    },
                  },
                },
              },
              createdAt: true,
            },
          },
          OrderConfirmation: {
            select: {
              paletNumber: true,
              orderDate: true,
              loadDate: true,
              aproxDeliveryDate: true,
              netWeight: true,
              brutWeight: true,
              OrderItem: {
                select: {
                  quantity1: true,
                  quantity2: true,
                  Product: {
                    select: {
                      id: true,
                      description: true,
                    },
                  },
                },
              },
              createdAt: true,
            },
          },
        },
      });
    }),
  getAllDocuments: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.document.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        url: true,
        name: true,
        type: true,
        orderType: true,
        createdAt: true,
      },
    });
  }),
});
