import Hero from "./components/Hero";
import CategorySection from "./components/CategorySection";
import FeaturedProducts from "./components/FeaturedProducts";
import SuperComboSection from "./components/SuperComboSection";
import BlogSection from "./components/BlogSection";
import NewsletterSection from "./components/NewsletterSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <SuperComboSection />
      <BlogSection />
      <NewsletterSection />
    </main>
  );
}
