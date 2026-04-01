// src/app/dashboard/page.js
import { auth, signOut } from "@/auth";
import { getWeatherData } from "@/lib/weather"; // Import the helper
import WeatherWidget from "./weather_widget";
import NewsWidget from "./news_widget";

export default async function MembersPage(props) {
  const session = await auth(); // Get the current user session
  const isAdmin = session?.user?.role === "ADMIN";
  console.log("Current User Role:", session?.user?.role); // This shows in your P17 terminal
  console.log("Current Menu ID:", session?.user?.menu_group_id); // This shows in your P17 terminal

  // Start both fetches at once for better performance
  // const weatherPromise = getWeatherData(22.3193, 114.1694); // You could later dynamicize this
  const weatherPromise = getWeatherData(); // You could later dynamicize this

  /* replace with Promise.all 
  const {
    data: members,
    totalPages,
    error,
  } = await getMembers(query, currentPage);
*/

  const [weather] = await Promise.all([weatherPromise]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">MDM Master Data</h1>
          <p className="text-sm font-medium text-gray-700">
            Welcome, {session.user.name}
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded uppercase">
              {session.user.role}
            </span>
          </p>
          {session.user.lastLogin && (
            <p className="text-xs text-gray-400">
              Last session:{" "}
              {new Date(session.user.lastLogin).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          )}
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button className="text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-colors">
            Sign Out
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Updated Weather Widget */}
        <WeatherWidget />
        {/* Local News Section */}

        <NewsWidget />

        {/* To-Do / Notification List (Placeholders) */}
        <section className="md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Action Required</h3>
            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">
              3 Pending
            </span>
          </div>
          <div className="border rounded-xl divide-y">
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="bg-yellow-100 p-2 rounded-lg">✍️</span>
                <div>
                  <p className="text-sm font-medium">
                    Approve 5 New Member Registrations
                  </p>
                  <p className="text-xs text-gray-500">
                    Assigned to: MDM Super User
                  </p>
                </div>
              </div>
              <button className="text-blue-600 text-sm font-semibold">
                View
              </button>
            </div>
            {/* ... other tasks ... */}
          </div>
        </section>
      </div>
    </div>
  );
}
