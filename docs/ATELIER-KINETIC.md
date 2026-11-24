# Atelier Kinetic — local implementation, 2026-10-26

The homepage now follows the supplied kinetic choreography: hero, dark manifesto,
light portfolio, studio, process, dark contact. Existing CMS content and all 12
published projects remain the source of truth; the unavailable portrait, IARP
credential and illustrative project names were not invented.
The studio section reuses the existing CMS studio drawing in grayscale. Its
stamp identifies Paulina Cywińska / Studio Architektury / Łódź and makes no
professional-registration claim. The existing palette, typography and design
system remain unchanged; `DESIGN.md` and `.impeccable/design.json` are preserved.

Desktop: 88% chamfered hero expands 4% over 800px, masked headline entrance,
subtle image parallax, tonal curtains, 1200ms counters, sticky featured photograph,
magnetic view cursor, staggered project curtains, studio stamp after scrolling,
drawn principle rules, progressive process spine and focused phase, contact dock,
field underlines and spring return arrow. Header frost/inversion and compass
follow the current section. The compass hides after mobile inactivity.
The featured photograph becomes sticky at 900px; its supporting copy remains in
normal document flow. The header becomes frosted after 60px of scrolling, and
the reading-progress rule is 1.5px. The common easing is
`cubic-bezier(0.16, 1, 0.3, 1)`; reveals run for 650ms, desktop curtains and the
contact entrance for 1000ms, with 100–120ms stagger intervals. Studio-stamp
visibility returns 160ms after scrolling stops; the mobile compass idles after
2400ms and returns on activity or keyboard focus.

Below 768px, photo parallax is disabled and reveals use IntersectionObserver.
Reduced motion can change live: animations revert and content stays visible.
No JavaScript also leaves all content visible. Image geometry is reserved with
aspect ratios; no unmeasured CLS or frame-rate guarantee is asserted.

Scroll updates are coalesced using requestAnimationFrame. Element geometry is
cached and refreshed on resize; scroll motion uses transform and opacity.
All listeners, observers, timers and animations are cleaned up on unmount or
preference changes. Form validation, transport and CMS controls are preserved.

Implementation evidence: `components/atelier-motion.tsx` owns the animation and
scroll lifecycle; `app/showroom.css` defines reserved geometry, sticky behavior,
responsive and reduced-motion fallbacks; `app/(site)/page.tsx` supplies the six
numbered sections and truthful studio imagery. These are implementation facts,
not a claim that performance or browser QA has passed.
