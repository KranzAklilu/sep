import { Input } from "~/components/ui/input";
import { VenueList } from "~/views/dashboard/venue-list";

export default async function EventPlannerDashboard() {
  return (
    <>
      <div className="grid gap-4 p-10 md:grid-cols-2 lg:grid-cols-7">
        <Input
          placeholder="Search..."
          className="lg:col-span-3 lg:col-start-3"
        />
        <div className="col-span-8 px-10">
          <h3 className="text-xl">All venues</h3>
          <VenueList />
        </div>
      </div>
    </>
  );
}
