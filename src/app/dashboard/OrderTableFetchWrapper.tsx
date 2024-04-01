"use client";

import React, { useEffect, useState } from "react";

import {} from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/react";
import OrderTable from "./OrderTable";
import { RouterOutputs } from "~/trpc/shared";

export default function OrderTableFetchWrapper() {
  const [orderData, setOrderData] = useState<
    RouterOutputs["order"]["getAllOrders"]
  >([]);
  const [clientsData, setClientsData] = useState<
    RouterOutputs["clientRouter"]["getAll"]
  >([]);
  const { data: clients, isSuccess: isClientsSuccess } =
    api.clientRouter.getAll.useQuery();

  const { data, isSuccess } = api.order.getAllOrders.useQuery();

  useEffect(() => {
    setOrderData([]);
    if (data && isSuccess) {
      setOrderData(data);
    }
  }, [data, isSuccess]);
  useEffect(() => {
    setClientsData([]);
    if (clients && isSuccess) {
      setClientsData(clients);
    }
  }, [clients, isClientsSuccess]);

  console.log(orderData, orderData.length);

  return <OrderTable data={orderData} clients={clientsData} />;
}
