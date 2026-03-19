// app/members/new/page.js (Server Component)
import { getCountries } from "@/lib/country-actions";
import NewMemberPage from "./NewMemberPage";

export default async function Page() {
  // Fetch the data on the server
  const { data: countries, error } = await getCountries();

  if (error) {
    // You can handle errors globally here
    return <div className="p-10 text-red-500 font-bold">Error: {error}</div>;
  }

  // Pass the plain data array to the Client Component
  return <NewMemberPage countries={countries || []} />;
}
