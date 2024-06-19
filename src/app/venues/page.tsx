import { Input } from "~/components/ui/input";
import { VenueList } from "~/views/dashboard/venue-list";

export default async function EventPlannerDashboard() {
  return (
    <div className="grid gap-4 p-10 md:grid-cols-2 lg:grid-cols-7">
      <VenueList />
    </div>
  );
}
