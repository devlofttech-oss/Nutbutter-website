import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import AboutHero from '../components/AboutHero.jsx'
import BrandStory from '../components/BrandStory.jsx'
import MissionVision from '../components/MissionVision.jsx'
import FounderStory from '../components/FounderStory.jsx'
import ProcessSection from '../components/ProcessSection.jsx'
import QualityPromise from '../components/QualityPromise.jsx'

export default function AboutPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Header />
      <main>
        <AboutHero />
        <BrandStory />
        <MissionVision />
        <FounderStory />
        <ProcessSection />
        <QualityPromise />
      </main>
      <Footer />
    </div>
  )
}
