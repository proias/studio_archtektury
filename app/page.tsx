"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Filter, MapPin, Calendar, Phone, Mail, User, MessageSquare, Building, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const projects = [
  {
    id: 1,
    title: "Nowoczesna Willa, Łódź",
    location: "Łódź, Polska",
    year: "2024",
    category: "Mieszkaniowe",
    type: "Nowa Budowa",
    image: "/pr1.jpg?height=600&width=800",
    description: "Współczesna rezydencja rodzinna, która płynnie łączy przestrzenie wewnętrzne z zewnętrznymi.",
    scope: "Architektura, Projektowanie Wnętrz, Krajobraz",
  },
  {
    id: 2,
    title: "Apartamentowiec, Łódź",
    location: "Grodzisk Maz., Polska",
    year: "2023",
    category: "Mieszkaniowe",
    type: "Remont",
    image: "/pr2.jpg?height=400&width=600",
    description: "Nadmorskie życie na nowo zdefiniowane dzięki naturalnym materiałom i panoramicznym widokom na morze.",
    scope: "Projektowanie Wnętrz, Planowanie Przestrzeni",
  },
  {
    id: 3,
    title: "Dom jednorodzinny, Łódź",
    location: "Łódź Polska",
    year: "2024",
    category: "Komercyjne",
    type: "Nowa Budowa",
    image: "/pr3.jpg?height=500&width=700",
    description: "Zrównoważony projekt biurowy promujący współpracę i dobre samopoczucie.",
    scope: "Architektura, Projektowanie Wnętrz, Doradztwo w Zakresie Zrównoważoności",
  },
]

const categories = ["Wszystkie", "Mieszkaniowe", "Komercyjne", "Wnętrza"]
const locations = ["Wszystkie", "Łódź", "Grodzisk Maz."]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie")
  const [selectedLocation, setSelectedLocation] = useState("Wszystkie")
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const portfolioRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const filteredProjects = projects.filter((project) => {
    const categoryMatch = selectedCategory === "Wszystkie" || project.category === selectedCategory
    const locationMatch = selectedLocation === "Wszystkie" || project.location.includes(selectedLocation)
    return categoryMatch && locationMatch
  })

  const scrollToPortfolio = () => {
    portfolioRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.a
            href="#"
            className="flex items-center gap-3 font-serif text-xl font-bold text-foreground hover:text-accent transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center">
              <img   src="/logo_1.png" className="w-10 h-10 object-contain"/>
            </div>
            Studio Architektury P. Cywińska
          </motion.a>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
              Portfolio
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              O Nas
            </a>
            <button
              onClick={() => setShowContactForm(true)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Kontakt
            </button>
          </div>
          <Button
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => setShowContactForm(true)}
          >
            Rozpocznij Projekt
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-background"
      >
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroOpacity }}>
          <Image
            src="/lp1.png?height=1080&width=1920"
            alt="Studio Architecture Hero"
            fill
            className="object-cover opacity-35"
            priority
          />
        </motion.div>

        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.h1
            className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight text-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Studio Architektury
            <br />
            <span className="text-accent">Paulina Cywińska</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-muted-foreground font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Projektujemy domy jednorodzinne, a także obiekty usługowe i publiczne, dopasowane do potrzeb użytkowników.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={scrollToPortfolio}
            >
              Odkryj Portfolio
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" ref={portfolioRef} className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground">Wybrane Realizacje</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Każdy budynek tworzymy z myślą o komforcie, funkcji i przyjemności z codziennego użytkowania.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Kategoria:</span>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedCategory === category
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "bg-[#F8F8F6] text-[#2B2B2B] hover:bg-accent/10 border-border"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Lokalizacja:</span>
              {locations.map((location) => (
                <Badge
                  key={location}
                  variant={selectedLocation === location ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedLocation === location
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "bg-[#F8F8F6] text-[#2B2B2B] hover:bg-accent/10 border-border"
                  }`}
                  onClick={() => setSelectedLocation(location)}
                >
                  {location}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                onHoverStart={() => setHoveredProject(project.id)}
                onHoverEnd={() => setHoveredProject(null)}
              >
                <Card className="group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <motion.div
                      className="absolute inset-0 bg-black/60 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-center text-white p-6">
                        <h3 className="font-serif text-2xl font-bold mb-2">{project.title}</h3>
                        <p className="text-white/90 mb-4">{project.description}</p>
                        <div className="flex items-center justify-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {project.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {project.year}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-serif text-xl font-semibold text-foreground">{project.title}</h3>
                      <Badge variant="outline" className="border-border text-muted-foreground">
                        {project.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{project.scope}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{project.location}</span>
                      <span>{project.year}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-foreground">
                Architektura jako
                <br />
                <span className="text-accent">Opowieść</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Każda przestrzeń ma swoją historię do opowiedzenia. W Studio Architektury Paulina Cywińska wierzymy,
                  że wyjątkowy projekt powstaje z zrozumienia unikalnej narracji każdego projektu—jego kontekstu,
                  mieszkańców i przeznaczenia.
                </p>
                <p>
                  Z ponad dziesięcioletnim doświadczeniem w architekturze mieszkaniowej i komercyjnej, specjalizujemy
                  się w tworzeniu przestrzeni, które są zarówno funkcjonalnie wyrafinowane, jak i emocjonalnie
                  rezonujące. Nasze podejście łączy rygorystyczną dbałość o szczegóły z głębokim zrozumieniem
                  materialności, światła i ludzkiego doświadczenia.
                </p>
                <p>
                  Od intymnych renowacji mieszkalnych po wielkoskalowe projekty komercyjne, współpracujemy ściśle z
                  naszymi klientami, aby przekształcić ich wizję w zbudowaną rzeczywistość, zawsze z myślą o
                  zrównoważoności i ponadczasowym designie.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Image
                src="/about2.png?height=600&width=500"
                alt="Paulina Cywińska"
                width={500}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#2B2B2B] text-white">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Masz pomysł na dom lub budynek?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Porozmawiajmy o nim i wspólnie znajdźmy rozwiązania, które przełożą Twoją wizję na przestrzeń przyjazną i funkcjonalną.
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => setShowContactForm(true)}
          >
            Rozpocznij Projekt Już Dziś
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-[#2B2B2B] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Studio Architektury</h3>
              <p className="text-white/80 mb-4">
                Projektujemy z dbałością o szczegóły, łącząc funkcję z ponadczasową estetyką.
              </p>
              <p className="text-sm text-white/60">Łódź • Warszawa • Grodzisk Mazowiecki • Sochaczew • Skierniewice</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Usługi</h4>
              <ul className="space-y-2 text-white/80">
                <li className="hover:text-[#8A6E4B] transition-colors cursor-pointer">Architektura Mieszkaniowa</li>
                <li className="hover:text-[#8A6E4B] transition-colors cursor-pointer">Projektowanie Komercyjne</li>
                <li className="hover:text-[#8A6E4B] transition-colors cursor-pointer">Projektowanie Wnętrz</li>
                <li className="hover:text-[#8A6E4B] transition-colors cursor-pointer">Renowacja i Restauracja</li>
                <li className="hover:text-[#8A6E4B] transition-colors cursor-pointer">
                  Doradztwo w Zakresie Zrównoważoności
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <div className="space-y-2 text-white/80">
                <p className="hover:text-[#8A6E4B] transition-colors cursor-pointer">pcywinska.arch@gmail.com</p>
                <p className="hover:text-[#8A6E4B] transition-colors cursor-pointer">+48 662-47-79-59</p>
                <p>Łódź, ul. Łagiewnicka 287z, Polska</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
            <p>&copy; 2025 Studio Architektury Paulina Cywińska. Wszelkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>

      {/* Contact Form Modal */}
      {showContactForm && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-background rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-3xl font-bold text-foreground">Skontaktuj się z Nami</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContactForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-6 text-foreground">Formularz Kontaktowy</h3>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          <User className="inline h-4 w-4 mr-1" />
                          Imię i Nazwisko *
                        </label>
                        <Input placeholder="Jan Kowalski" className="bg-background border-border" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          <Mail className="inline h-4 w-4 mr-1" />
                          Email *
                        </label>
                        <Input type="email" placeholder="jan@example.com" className="bg-background border-border" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Phone className="inline h-4 w-4 mr-1" />
                        Telefon
                      </label>
                      <Input placeholder="+48 123 456 789" className="bg-background border-border" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Building className="inline h-4 w-4 mr-1" />
                        Typ Projektu *
                      </label>
                      <Select>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Wybierz typ projektu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential-new">Dom Mieszkalny - Nowa Budowa</SelectItem>
                          <SelectItem value="residential-renovation">Dom Mieszkalny - Remont</SelectItem>
                          <SelectItem value="apartment">Apartament/Mieszkanie</SelectItem>
                          <SelectItem value="commercial">Projekt Komercyjny</SelectItem>
                          <SelectItem value="interior">Projektowanie Wnętrz</SelectItem>
                          <SelectItem value="consultation">Konsultacja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <MessageSquare className="inline h-4 w-4 mr-1" />
                        Opis Projektu *
                      </label>
                      <Textarea
                        placeholder="Opisz swój projekt, wymagania, preferencje stylistyczne, budżet i harmonogram..."
                        rows={4}
                        className="bg-background border-border"
                      />
                    </div>

                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      Wyślij Zapytanie
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </div>

                {/* Project Process */}
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-6 text-foreground">Proces Realizacji Projektu</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Konsultacja Wstępna</h4>
                        <p className="text-muted-foreground text-sm">
                          Bezpłatne spotkanie, podczas którego poznajemy Twoje oczekiwania, potrzeby i budżet. Analizujemy działkę lub lokalizację oraz omawiamy możliwe kierunki projektu.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Koncepcja</h4>
                        <p className="text-muted-foreground text-sm">
                          Przygotowujemy pierwsze pomysły, szkice i wizualizacje 3D. To etap rozmów i poprawek, aż wspólnie znajdziemy najlepsze rozwiązanie.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Projekt szczegółowy</h4>
                        <p className="text-muted-foreground text-sm">
                          Tworzymy kompletną dokumentację techniczną z rysunkami, materiałami i kosztorysem, która pozwala bezpiecznie rozpocząć budowę.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold text-sm">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Nadzór Autorski</h4>
                        <p className="text-muted-foreground text-sm">
                          Towarzyszymy w trakcie realizacji — współpracujemy z wykonawcami, sprawdzamy zgodność prac z projektem i dbamy o jakość wykonania.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold text-sm">
                        5
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Finalizacja</h4>
                        <p className="text-muted-foreground text-sm">
                          Odbiór końcowy, dopracowanie detali i przekazanie pełnej dokumentacji powykonawczej.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-muted rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Czas Realizacji
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Konsultacja: 1–2 tygodnie</li>
                      <li>• Projekt koncepcyjny: 2-4 tygodnie</li>
                      <li>• Projekt wykonawczy: 6-10 tygodni</li>
                      <li>• Realizacja: 3-12 miesięcy (w zależności od skali inwestycji)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
