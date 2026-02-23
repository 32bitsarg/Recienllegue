import { getNotices, getTips, getFeaturedRestaurants, getCityEvents, getRestaurants } from "@/app/actions/data";
import MobileHome from "@/components/mobile/MobileHome";
import DesktopHome from "@/components/desktop/DesktopHome";

export default async function Home() {
  // Fetch all data in parallel on the server
  const [notices, tips, featuredFoodRaw, eventsRaw] = await Promise.all([
    getNotices(),
    getTips(),
    getFeaturedRestaurants(),
    getCityEvents()
  ]);

  const events = eventsRaw.filter((e: any) => e.isFeatured);

  // Desktop logic for fallback restaurants
  let featuredFood = featuredFoodRaw;
  if (featuredFood.length < 3) {
    const allRestaurants = await getRestaurants();
    const available = allRestaurants.filter(r => !featuredFood.some(f => f.id === r.id));
    const randoms = available.sort(() => 0.5 - Math.random()).slice(0, 4 - featuredFood.length);
    featuredFood = [...featuredFood, ...randoms];
  }

  const initialData = {
    notices,
    tips,
    featuredFood,
    events,
    noticesCount: notices.length
  };

  return (
    <main>
      <div className="mobile-only safe-bottom">
        <MobileHome initialData={initialData} />
      </div>

      <div className="desktop-only">
        <DesktopHome initialData={initialData} />
      </div>
    </main>
  );
}
