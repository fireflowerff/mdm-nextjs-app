export async function getNewsData() {
  try {
    // 1. Get Public IP
    const newsRes = await fetch(
      "https://saurav.tech/NewsAPI/top-headlines/category/technology/us.json",
    );
    if (!newsRes.ok) throw new Error("News lookup failed");
    const newsJSON = await newsRes.json();

    const topArticles = newsJSON.articles?.slice(0, 5) || [];
    return topArticles.map((article) => ({
      title: article.title,
      source: article.source.name,
      url: article.url,
      image: article.urlToImage,
      date: new Date(article.publishedAt).toLocaleDateString(),
      description: article.description,
    }));
  } catch (error) {
    console.error("Industry News Error:", error);
    return null;
  }
}
