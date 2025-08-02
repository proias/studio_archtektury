import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, Instagram, Linkedin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Page() {
  const portfolioProjects = [
    {
      title: "Modern Villa Residence",
      location: "Warsaw, Poland",
      year: "2023",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Urban Loft Renovation",
      location: "Krakow, Poland",
      year: "2023",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Sustainable Family Home",
      location: "Gdansk, Poland",
      year: "2022",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Commercial Office Space",
      location: "Wroclaw, Poland",
      year: "2022",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Boutique Hotel Design",
      location: "Poznan, Poland",
      year: "2021",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Residential Complex",
      location: "Lodz, Poland",
      year: "2021",
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-light text-lg tracking-wide">Studio Architektury</div>
            <div className="hidden md:flex space-x-8">
              <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="#portfolio" className="text-gray-600 hover:text-gray-900 transition-colors">
                Portfolio
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Modern architectural house design"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6">
              Studio Architektury
              <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 text-white/90">Paulina Cywińska</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light leading-relaxed">
              Creating spaces that inspire, function beautifully, and stand the test of time
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-white/90">
                <Link href="#portfolio">View Portfolio</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
              >
                <Link href="#contact">Get In Touch</Link>
              </Button>
            </div>
          </div>
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
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Paulina Cywińska at work"
                width={500}
                height={600}
                className="rounded-lg shadow-lg"
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
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={600}
                    height={400}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">Let's Create Together</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ready to bring your architectural vision to life? We'd love to hear about your project and explore how we
              can work together.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-light text-gray-900 mb-8">Get In Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-gray-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Studio Address</div>
                    <div className="text-gray-600">
                      ul. Krakowskie Przedmieście 15
                      <br />
                      00-071 Warsaw, Poland
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Phone</div>
                    <Link href="tel:+48123456789" className="text-gray-600 hover:text-gray-900">
                      +48 123 456 789
                    </Link>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <Link href="mailto:hello@studiocywinska.pl" className="text-gray-600 hover:text-gray-900">
                      hello@studiocywinska.pl
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-medium text-gray-900 mb-4">Follow Our Work</h4>
                <div className="flex space-x-4">
                  <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    <Instagram className="w-6 h-6" />
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-light text-gray-900 mb-6">Project Inquiry</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Renovation</option>
                    <option>Interior Design</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>

                <Button className="w-full bg-gray-900 hover:bg-gray-800">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-light mb-4">Studio Architektury Paulina Cywińska</div>
            <p className="text-gray-400 mb-4">Creating exceptional spaces through thoughtful design</p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Studio Architektury Paulina Cywińska. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
