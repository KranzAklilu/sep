"use client";

import { format } from "date-fns";
import { api } from "~/trpc/react";
import { DocumentType } from "@prisma/client";
import { useState, useRef, useEffect, useCallback } from "react";
import { read, utils, writeFileXLSX } from "xlsx";
import { RouterOutputs } from "~/trpc/shared";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";

export function DocumentDetailedSheet({ id }: { id: string }) {
  const { data, isLoading } = api.document.getDocument.useQuery({ id });
  const [pdf, setPdf] = useState("");

  const [__html, setHtml] = useState("");
  const tbl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data) return;
    (async () => {
      const sftpRes = await fetch("/api/sftp", {
        method: "POST",
        body: JSON.stringify({
          url: data.url,
        }),
      });
      const j = await sftpRes.json();
      if (!j || !j.data) {
        return toast({
          title: "error when fetching sftp",
        });
      }

      if (data?.type === "XLSX") {
        const wb = read(new Uint8Array(j.data.data)); // parse the array buffer
        if (!wb) return;
        const ws = wb.Sheets[wb.SheetNames[0]!]; // get the first worksheet
        if (!ws) return;
        const xData = utils.sheet_to_html(ws); // generate HTML
        if (!xData) return;
        setHtml(xData); // update state
      }

      console.log(j);
      const bytes = new Uint8Array(j.data.data);
      console.log(bytes);
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdf(url);
      console.log(url);
    })().catch((e) => console.error(e));
  }, [data]);

  /* get live table and export to XLSX */
  const exportFile = useCallback(() => {
    const elt = tbl?.current?.getElementsByTagName("TABLE")[0];
    const wb = utils.table_to_book(elt);
    writeFileXLSX(wb, "SheetJSReactHTML.xlsx");
  }, [tbl]);

  if (isLoading || !data) {
    return <>...loading</>;
  }

  console.log({ document });

  return (
    <div className="my-8 flex gap-8">
      <Details data={data} />
      <div className="h-[80vh] w-full min-w-96 overflow-y-scroll border shadow-black">
        {data.type === DocumentType.XLSX ? (
          <div className="mb-4">
            <Button onClick={exportFile}>Export XLSX</Button>
            <div ref={tbl} dangerouslySetInnerHTML={{ __html }} />
          </div>
        ) : (
          <>
            {!pdf ? (
              <>...loading</>
            ) : (
              <embed
                src={pdf}
                type="application/pdf"
                width="100%"
                className="h-[85vh]"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

const Details = ({
  data,
}: {
  data: RouterOutputs["document"]["getDocument"];
}) => {
  const documentOrderType = {
    PO: data.PurchaseOrder[0] && {
      poNumber: data.PurchaseOrder[0]?.id,
      orderNumber: data.PurchaseOrder[0]?.Order?.id,
      orderItems: data.PurchaseOrder[0]?.orderItems,
    },
    SO: data.SalesOrder[0] && {
      orderDate: data.SalesOrder[0]?.deliveryDate,
      pickUpStarting: data.SalesOrder[0]?.pickUpStarting,
      deliveryAddress: data.SalesOrder[0]?.address.full,
      orderItems: data.SalesOrder[0]?.orderItems,
    },
    CI: data.CommercialInvoice[0] && {
      orderItems: data.CommercialInvoice[0]?.OrderItem,
    },

    IS: data.InventoryStatus[0] && {
      orderItems: data.InventoryStatus[0]?.OrderQuantities.flatMap((oq) => ({
        ...oq,
        OrderItem: oq.OrderItems[0],
      })),
    },
    AB: data.OrderConfirmation[0] && {
      paletNumber: data.OrderConfirmation[0].paletNumber,
      orderDate: data.OrderConfirmation[0].orderDate,
      loadDate: data.OrderConfirmation[0].loadDate,
      aproxDeliveryDate: data.OrderConfirmation[0].aproxDeliveryDate,
      netWeight: data.OrderConfirmation[0].netWeight,
      brutWeight: data.OrderConfirmation[0].brutWeight,
      orderItems: data.OrderConfirmation[0]?.OrderItem,
    },
  };

  console.log({
    ho: Object.entries(documentOrderType).find(([key, value]) => !!value),
  });

  return (
    <div className="max-h-[80vh] space-y-6 overflow-y-scroll">
      {documentOrderType.PO && (
        <>
          <div className="space-y-3 px-6 font-bold">
            <h6 className="text-sm text-gray-500">General</h6>
            <div className="px-6">
              <h3>Type: PO</h3>
            </div>
          </div>

          <div className="space-y-3 px-6 font-bold">
            <h6 className="text-sm text-gray-500">Document type specific</h6>
            <div className="px-6">
              <h3>
                po number:
                {documentOrderType.PO.poNumber}
              </h3>
              {documentOrderType.PO.orderNumber && (
                <h3>order number: {documentOrderType.PO.orderNumber}</h3>
              )}
              <h3>
                Order Items:
                {documentOrderType.PO.orderItems?.map((o, idx) => (
                  <div className="mt-3 flex gap-2 px-3" key={idx}>
                    <p>item{idx + 1}:</p>
                    <p className="font-medium">
                      {o.Product?.id && <p>id: {o.Product.id}</p>}
                      {o.Product?.description && (
                        <p>description: {o.Product?.description}</p>
                      )}
                      {o.quantity && <p>quantity: {o.quantity}</p>}
                      {o.rate && <p>rate: {o.rate}</p>}
                      {o.amount && <p>amount: {o.amount}</p>}
                      {o.taxRate && <p>taxRate: {o.taxRate}</p>}
                      {o.taxAmnt && <p>taxAmnt: {o.taxAmnt}</p>}
                      {o.grossAmnt && <p>grossAmnt: {o.grossAmnt}</p>}
                    </p>
                  </div>
                ))}
              </h3>
            </div>
          </div>
        </>
      )}
      {documentOrderType.SO && (
        <>
          <div className="space-y-3 px-6 font-bold">
            <h6 className="text-sm text-gray-500">General</h6>
            <div className="px-6">
              <h3>Type: SO</h3>
            </div>
          </div>

          <div className="space-y-3 px-6 font-bold">
            <h6 className="text-sm text-gray-500">Document type specific</h6>

            <div className="px-6">
              {documentOrderType.SO.orderDate && (
                <h3>
                  Order Date:{" "}
                  {format(documentOrderType.SO.orderDate, "dd/mm/yyyy")}
                </h3>
              )}
              {documentOrderType.SO.pickUpStarting && (
                <h3>
                  Pick up starting:{" "}
                  {format(documentOrderType.SO.pickUpStarting, "dd/mm/yyyy")}
                </h3>
              )}
              {documentOrderType.SO.orderItems && (
                <h3>
                  Order Items:
                  {documentOrderType.SO.orderItems?.map((o, idx) => (
                    <div className="mt-3 flex gap-2 px-3" key={idx}>
                      <p>item{idx + 1}:</p>
                      <p className="font-medium">
                        {o.Product?.id && <p>id: {o.Product.id}</p>}
                        {o.Product?.description && (
                          <p>description: {o.Product?.description}</p>
                        )}
                        {o.quantity && <p>quantity: {o.quantity}</p>}
                      </p>
                    </div>
                  ))}
                </h3>
              )}
            </div>
          </div>
        </>
      )}
      {documentOrderType.CI && (
        <>
          <div className="space-y-3 px-6 font-bold">
            <h6 className="text-sm text-gray-500">General</h6>
            <div className="px-6">
              <h3>Type: CI</h3>
            </div>
          </div>

          <div className="space-y-3 px-6 font-bold">
            <h6 className="text-sm text-gray-500">Document type specific</h6>

            <div className="px-6">
              {documentOrderType.CI.orderItems && (
                <h3>
                  Order Items:
                  {documentOrderType.CI.orderItems?.map((o, idx) => (
                    <div className="mt-3 flex gap-2 px-3" key={idx}>
                      <p>item{idx + 1}:</p>
                      <p className="font-medium">
                        {o.Product?.id && <p>id: {o.Product.id}</p>}
                        {o.Product?.description && (
                          <p>description: {o.Product?.description}</p>
                        )}
                        {o.quantity && <p>quantity: {o.quantity}</p>}
                        {o.unitPrice && <p>unitPrice: {o.unitPrice}</p>}
                        {o.amount && <p>amount: {o.amount}</p>}
                      </p>
                    </div>
                  ))}
                </h3>
              )}
            </div>
          </div>
        </>
      )}
      {documentOrderType.IS && (
        <>
          <div className="space-y-3 px-6 font-bold">
            <h6 className="text-sm text-gray-500">General</h6>
            <div className="px-6">
              <h3>Type: IS</h3>
            </div>
          </div>

          <div className="space-y-3 px-6 font-bold">
            <h6 className="text-sm text-gray-500">Document type specific</h6>

            <div className="px-6">
              {documentOrderType.IS.orderItems && (
                <h3>
                  Order Items:
                  {documentOrderType.IS.orderItems?.map((o, idx) => (
                    <div className="mt-3 flex gap-2 px-3" key={idx}>
                      <p>item{idx + 1}:</p>
                      <p className="font-medium">
                        {o.OrderItem?.Product?.id && (
                          <p>id: {o.OrderItem.Product.id}</p>
                        )}
                        {o.OrderItem?.case && <p>amount: {o.OrderItem.case}</p>}
                      </p>
                    </div>
                  ))}
                </h3>
              )}
            </div>
          </div>
        </>
      )}
      {documentOrderType.AB && (
        <>
          <div className="space-y-3 px-6 font-bold">
            <h6 className="text-sm text-gray-500">General</h6>
            <div className="px-6">
              <h3>Type: AB</h3>
            </div>
          </div>

          <div className="space-y-3 px-6 font-bold">
            <h6 className="text-sm text-gray-500">Document type specific</h6>

            <div className="px-6">
              <p>paletNumber: {documentOrderType.AB.paletNumber}</p>
              <p>
                date: {format(documentOrderType.AB.orderDate, "dd/MM/yyyy")}
              </p>
              <p>
                loadDate: {format(documentOrderType.AB.loadDate, "dd/MM/yyyy")}
              </p>
              <p>
                Approximate delivery date:{" "}
                {format(documentOrderType.AB.aproxDeliveryDate, "dd/MM/yyyy")}
              </p>
              <p>net weight: {documentOrderType.AB.netWeight}</p>
              <p>brut weight: {documentOrderType.AB.brutWeight}</p>

              {documentOrderType.AB.orderItems && (
                <h3>
                  Order Items:
                  {documentOrderType.AB.orderItems?.map((o, idx) => (
                    <div className="mt-3 flex gap-2 px-3" key={idx}>
                      <p>item{idx + 1}:</p>
                      <p className="font-medium">
                        {o.Product?.id && <p>id: {o.Product.id}</p>}
                        {o.Product?.description && (
                          <p>description: {o.Product?.description}</p>
                        )}
                      </p>
                    </div>
                  ))}
                </h3>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
