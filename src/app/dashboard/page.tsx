import { unstable_noStore as noStore } from "next/cache";
import OrderTableFetchWrapper from "./OrderTableFetchWrapper";

export default async function Home() {
  noStore();

  return (
    <>
      <OrderTableFetchWrapper />
    </>
  );
}
