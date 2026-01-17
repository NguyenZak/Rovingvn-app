import { createClient } from '@/lib/supabase/server'
import { getSiteSettings } from '@/lib/actions/site-settings'
import { getHighlights } from '@/lib/actions/highlight-actions'
import { getAllTours } from '@/lib/actions/tour-actions'
import { getRegions } from '@/lib/actions/region-actions'
import { getFeaturedDestinations } from '@/lib/actions/destination-actions'
import { Hero } from "@/components/features/home/Hero";
import { Stats } from "@/components/features/home/Stats";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { ArrowRight, MapPin, Calendar } from "lucide-react";

const HowItWorks = dynamic(() => import("@/components/features/home/HowItWorks").then(mod => mod.HowItWorks));
const VietnamRegions = dynamic(() => import("@/components/features/home/VietnamRegions").then(mod => mod.VietnamRegions));
const CulturalHighlights = dynamic(() => import("@/components/features/home/CulturalHighlights").then(mod => mod.CulturalHighlights));
const RecommendedProvinces = dynamic(() => import("@/components/features/home/RecommendedProvinces").then(mod => mod.RecommendedProvinces));
const TravelGuide = dynamic(() => import("@/components/features/home/TravelGuide").then(mod => mod.TravelGuide));
const DesignTripCTA = dynamic(() => import("@/components/features/home/DesignTripCTA").then(mod => mod.DesignTripCTA));
const Testimonials = dynamic(() => import("@/components/features/home/Testimonials").then(mod => mod.Testimonials));
const Newsletter = dynamic(() => import("@/components/features/home/Newsletter").then(mod => mod.Newsletter));
const HomeContactForm = dynamic(() => import("@/components/features/home/HomeContactForm").then(mod => mod.HomeContactForm));
const TourCard = dynamic(() => import("@/components/features/tours/TourCard").then(mod => mod.TourCard));

export const revalidate = 0 // Dynamic data for development

export default async function Home() {
  const supabase = await createClient()

  // Parallel data fetching for Homepage sections
  const [
    featuredToursResult,
    featuredDestinationsResult,
    { data: latestPosts },
    { data: sliders },
    settings,
    highlights,
    regionsResult
  ] = await Promise.all([
    getAllTours({ limit: 4, status: 'published', sortBy: 'created_at', orderBy: 'desc' }),
    // Fetch featured destinations only
    getFeaturedDestinations(),
    // Fetch blog posts with media
    supabase
      .from('blog_posts')
      .select(`
        *,
        cover_image:cover_image_id(id, url, filename),
        thumbnail:thumbnail_id(id, url, filename)
      `)
      .eq('status', 'published')
      .limit(4)
      .order('created_at', { ascending: false }),
    // Fetch active sliders
    supabase
      .from('sliders')
      .select(`
        *,
        image:image_id(id, url, filename, alt_text)
      `)
      .eq('status', 'active')
      .order('display_order', { ascending: true }),
    // Fetch site settings
    getSiteSettings(),
    // Fetch highlights
    getHighlights(),
    // Fetch regions
    getRegions()
  ])

  const featuredTours = featuredToursResult.data || []
  const regions = regionsResult.data || []
  const destinations = featuredDestinationsResult.data || []

  console.log('Home Page Debug - Tours:', featuredTours?.length || 0)
  console.log('Home Page Debug - Featured Destinations:', destinations?.length || 0)
  if (destinations && destinations.length > 0) {
    console.log('First Destination Status:', destinations[0].status)
  }

  return (
    <>
      <Hero sliders={sliders || []} />
      <Stats
        travelers={settings?.stat_travelers}
        tours={settings?.stat_tours}
        destinations={settings?.stat_destinations}
        years={settings?.stat_years}
      />

      <VietnamRegions regions={regions} />

      <RecommendedProvinces destinations={destinations || []} />

      <DesignTripCTA />

      {/* Featured Tours Section */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Tours</h2>
              <p className="text-gray-600 text-lg">Our most loved itineraries by travelers from around the world.</p>
            </div>
            <Link href="/tours" className="hidden md:flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group">
              View All Tours <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredTours && featuredTours.length > 0 ? (
              featuredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))
            ) : (
              // Empty State
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500">New tours coming soon...</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link href="/tours" className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
              View All Tours <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <CulturalHighlights
        heroTitle={settings?.hero_title}
        heroSubtitle={settings?.hero_subtitle}
        heroDescription={settings?.hero_description}
        highlights={highlights}
        images={{
          image1: settings?.highlight_image_1,
          image2: settings?.highlight_image_2,
          image3: settings?.highlight_image_3,
          image4: settings?.highlight_image_4,
        }}
      />

      {/* Popular Destinations Section */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trending Destinations</h2>
            <p className="text-gray-600 text-lg">Explore the most breathtaking locations Vietnam has to offer.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations?.map((dest) => (
              <Link key={dest.id} href={`/tours?destination=${dest.slug}`} className="group relative rounded-2xl overflow-hidden aspect-[3/4] block shadow-md hover:shadow-xl transition-all">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${dest.image_url || 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?q=80&w=2070'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-6 left-6 text-white transform translate-y-0 group-hover:-translate-y-2 transition-transform">
                  <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <MapPin size={18} className="text-emerald-400" />
                    {dest.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/destinations" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full font-semibold text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors">
              Explore All Destinations
            </Link>
          </div>
        </div>
      </section>

      <TravelGuide />

      <HowItWorks />

      <Testimonials />

      {/* Latest Blog Posts Section */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Travel Inspiration</h2>
              <p className="text-gray-600 text-lg">Tips, guides, and stories to help you plan your perfect trip.</p>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group">
              Read More Articles <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestPosts?.map((post) => {
              // Get image URL from media library or fallback to direct URL
              const imageUrl = post.thumbnail?.url || post.cover_image?.url || post.cover_image || post.featured_image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021'

              return (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 relative">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Calendar size={14} />
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 line-clamp-2 text-sm">
                    {post.excerpt}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <HomeContactForm />

      <Newsletter />
    </>
  );
}
