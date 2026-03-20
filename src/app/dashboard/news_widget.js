import { getNewsData } from "@/lib/news";

export default async function NewsWidget(props) {
  const newsPromise = getNewsData(); // You could later dynamicize this

  const news = await newsPromise;

  return (
    <div>
      {" "}
      <section className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          📰 Industry News
        </h3>
        <div className="space-y-4">
          {news.map((article) => (
            <div className="group cursor-pointer">
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">
                {article.source}
              </p>
              <h4 className="font-medium group-hover:text-blue-700 transition-colors line-clamp-1">
                {article.title}
              </h4>
              <p className="text-sm text-gray-500">{article.date}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
