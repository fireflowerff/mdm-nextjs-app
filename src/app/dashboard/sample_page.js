import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  const userRole = session.user.role;
  const firstName = session.user.name?.split(" ")[0] || "User";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good Morning, {firstName}! 👋
          </h1>
          <p className="text-gray-500">
            Role:{" "}
            <span className="font-semibold text-blue-600">{userRole}</span>
          </p>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleDateString("en-GB", { dateStyle: "full" })}
            </p>
            <p className="text-xs text-gray-500">
              System Status: <span className="text-green-500">Online</span>
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Widget (Mocked for now) */}
        <section className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">Local Weather</p>
              <h2 className="text-4xl font-bold mt-1">28°C</h2>
              <p className="text-blue-100">Hong Kong, Cloudy</p>
            </div>
            <span className="text-5xl">☁️</span>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-400/30 flex justify-between text-xs">
            <span>Humidity: 72%</span>
            <span>UV Index: Low</span>
          </div>
        </section>

        {/* Local News Section */}
        <section className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            📰 Industry News
          </h3>
          <div className="space-y-4">
            <div className="group cursor-pointer">
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">
                Market Update
              </p>
              <h4 className="font-medium group-hover:text-blue-700 transition-colors line-clamp-1">
                New Data Privacy Regulations for 2026 Announced
              </h4>
              <p className="text-sm text-gray-500">
                2 hours ago • Financial Times
              </p>
            </div>
            <div className="group cursor-pointer">
              <p className="text-xs text-green-600 font-bold uppercase tracking-wider">
                Tech
              </p>
              <h4 className="font-medium group-hover:text-blue-700 transition-colors line-clamp-1">
                MDM Automation: How AI is cleaning master data records
              </h4>
              <p className="text-sm text-gray-500">5 hours ago • Reuters</p>
            </div>
          </div>
        </section>

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
