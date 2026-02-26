import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturedProducts from "./components/FeaturedProducts";
import SuperComboSection from "./components/SuperComboSection";
import BlogSection from "./components/BlogSection";
import NewsletterSection from "./components/NewsletterSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedProducts />
      <SuperComboSection />
      <BlogSection />
      <NewsletterSection />
    </main>
  );
}
