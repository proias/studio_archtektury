"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone } from "lucide-react"

export default function HomePage() {
  const portfolioProjects = [
    {
      title: "Modern Villa Residence",
      location: "Warsaw, Poland",
      year: "2023",
      image: "/placeholder.svg?height=400&width=600&text=Modern+Villa",
    },
    {
      title: "Urban Loft Renovation",
      location: "Krakow, Poland",
      year: "2023",
      image: "/placeholder.svg?height=400&width=600&text=Urban+Loft",
    },
    {
      title: "Sustainable Family Home",
      location: "Gdansk, Poland",
      year: "2022",
      image: "/placeholder.svg?height=400&width=600&text=Family+Home",
    },
    {
      title: "Commercial Office Space",
      location: "Wroclaw, Poland",
      year: "2022",
      image: "/placeholder.svg?height=400&width=600&text=Office+Space",
    },
    {
      title: "Boutique Hotel Design",
      location: "Poznan, Poland",
      year: "2021",
      image: "/placeholder.svg?height=400&width=600&text=Hotel+Design",
    },
    {
      title: "Residential Complex",
      location: "Lodz, Poland",
      year: "2021",
      image: "/placeholder.svg?height=400&width=600&text=Residential+Complex",
    },
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-light text-lg tracking-wide">Studio Architektury</div>
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("portfolio")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Portfolio
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
	<img
  		src="/landing_1.png"
  		alt="Modern architectural design"
  		className="w-full h-full object-cover"
		style={{ opacity: 0.8 }}
	/>
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-left text-grey px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-grey mb-6 tracking-tight">Studio Architektury</h1>
          <h2 className="text-2xl md:text-3xl font-grey mb-8 opacity-90">Paulina Cywińska</h2>
          <p className="text-xl md:text-2xl font-grey leading-relaxed opacity-90 max-w-4x1">
            Projektujemy, słuchamy i tworzymy.<br /> Nasze przestrzenie opowiadają historię, służą użytkownikom i odzwierciedlają ich potrzeby.<br /><br /> Znajdź w nas partnera, który przekształci Twoją wizję w rzeczywistość.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">About the Studio</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  Studio Architektury Paulina Cywińska is a contemporary architectural practice founded on the
                  principles of thoughtful design, sustainable innovation, and client collaboration.
                </p>
                <p>
                  With over a decade of experience in residential, commercial, and public projects, we specialize in
                  creating spaces that seamlessly blend functionality with aesthetic excellence. Our approach combines
                  traditional architectural wisdom with cutting-edge design technologies.
                </p>
                <p>
                  Every project begins with understanding our clients' vision and the unique characteristics of the
                  site. We believe that great architecture emerges from the intersection of human needs, environmental
                  context, and creative expression.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-2xl font-light text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-gray-900">12</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-gray-900">8</div>
                  <div className="text-sm text-gray-600">Awards Won</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=600&width=500&text=Paulina+at+Work"
                alt="Paulina Cywińska at work"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">Selected Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A curated collection of our recent projects showcasing our commitment to innovative design and exceptional
              craftsmanship.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioProjects.map((project, index) => (
              <Card
                key={index}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-1">{project.location}</p>
                  <p className="text-sm text-gray-500">{project.year}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-light text-gray-900 mb-12">
            Let's Create Something Beautiful Together
          </h3>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <MapPin className="w-8 h-8 text-gray-600 mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">Studio</h4>
              <p className="text-gray-600 text-center">
                ul. Krakowskie Przedmieście 15
                <br />
                00-071 Warsaw, Poland
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Phone className="w-8 h-8 text-gray-600 mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">Phone</h4>
              <a href="tel:+48123456789" className="text-gray-600 hover:text-gray-900">
                +48 123 456 789
              </a>
            </div>

            <div className="flex flex-col items-center">
              <Mail className="w-8 h-8 text-gray-600 mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">Email</h4>
              <a href="mailto:hello@studiocywinska.pl" className="text-gray-600 hover:text-gray-900">
                hello@studiocywinska.pl
              </a>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-500 text-sm">© 2024 Studio Architektury Paulina Cywińska. All rights reserved.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-light mb-4">Studio Architektury Paulina Cywińska</div>
            <p className="text-gray-400 mb-4">Creating exceptional spaces through thoughtful design</p>
            <p className="text-sm text-gray-500">© 2024 Studio Architektury Paulina Cywińska. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
