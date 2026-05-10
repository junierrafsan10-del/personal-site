# Animated Interactive Portfolio - SPEC.md

## 1. Project Overview

**Project Name:** Neon Portfolio
**Type:** Interactive single-page portfolio with full animations
**Core Functionality:** A visually striking portfolio with scroll animations, interactive elements, particle effects, and smooth transitions
**Target Users:** Developers, designers, creative professionals

---

## 2. Visual & Rendering Specification

### Scene Setup
- **Layout:** Single-page with sections: Hero, About, Skills, Projects, Contact
- **Background:** Animated gradient mesh with floating particles
- **Theme:** Dark cyberpunk/neon aesthetic with glowing elements

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#00f5ff` | Accent, highlights, glows |
| Secondary | `#ff0080` | Secondary accents, links |
| Tertiary | `#8b5cf6` | Tertiary elements |
| Background | `#0a0a0f` | Main background |
| Surface | `#12121a` | Cards, elevated surfaces |
| Text Primary | `#ffffff` | Main text |
| Text Muted | `#8892a0` | Secondary text |

### Typography
- **Headings:** "Orbitron" (Google Fonts) - futuristic geometric
- **Body:** "Rajdhani" (Google Fonts) - tech/clean
- **Code/Labels:** "JetBrains Mono" (Google Fonts)

### Visual Effects
- **Particles:** Canvas-based particle system with connecting lines
- **Neon Glow:** CSS box-shadow and text-shadow for cyberpunk aesthetic
- **Glassmorphism:** Navbar and cards with backdrop-filter blur
- **Grid Lines:** Animated perspective grid in hero background
- **Glitch Effect:** Text glitch on hover for interactive elements

---

## 3. Animation Specification

### Hero Section
- Animated typing effect for name with blinking cursor
- Floating 3D geometric shapes (CSS transforms)
- Particles connecting to mouse position (parallax effect)
- Gradient text animation on name

### Navigation
- Fixed navbar with glassmorphism (backdrop-blur)
- Smooth scroll to sections
- Active section indicator (glow underline)
- Hamburger menu on mobile with slide animation

### Section Animations (Scroll-triggered)
- **About:** Slide-in from left, staggered content reveal
- **Skills:** Animated circular progress indicators, count-up numbers
- **Projects:** Cards scale up from 0.8 with staggered delay
- **Contact:** Fade-in from bottom with form field animations

### Micro-interactions
- Button hover: scale(1.05) + intensified glow
- Card hover: translateY(-8px) + shadow expansion
- Links: Underline slides in from left
- Input focus: Border color transition + glow pulse
- Project cards: 3D tilt effect on mouse move

### Transitions
- Smooth scroll behavior
- Section reveals use IntersectionObserver
- Duration: 400-600ms with ease-out timing

---

## 4. Interaction Specification

### User Controls
- **Mouse movement:** Particles react, project cards tilt
- **Scroll:** Section reveal animations trigger
- **Click:** All buttons, cards, form interactions
- **Form submit:** Visual feedback with loading state

### Navigation Links
| Section | ID |
|---------|-----|
| Home | `#hero` |
| About | `#about` |
| Skills | `#skills` |
| Projects | `#projects` |
| Contact | `#contact` |

### Responsive Breakpoints
- Desktop: > 1024px (full effects)
- Tablet: 768px - 1024px (simplified particles)
- Mobile: < 768px (minimal animations, stacked layout)

---

## 5. Content Structure

### Hero
```
Name: "Alex Chen"
Title: "Full-Stack Developer & UI Designer"
Subtitle: "Building digital experiences that matter"
CTAs: "View Work" | "Contact Me"
```

### About Section
- Profile image with animated gradient border
- Bio: 2-3 sentences describing expertise
- Stats: Years experience, Projects completed, Happy clients

### Skills Section
Categories with progress bars:
- **Frontend:** HTML/CSS (95%), JavaScript (90%), React (85%), Vue (80%)
- **Backend:** Node.js (85%), Python (80%), PostgreSQL (75%)
- **Tools:** Git (90%), Docker (80%), AWS (75%)

### Projects Section (4 cards)
1. **E-Commerce Platform** - React/Node - Full-stack shop
2. **Task Management App** - Vue/Firebase - Team collaboration
3. **Weather Dashboard** - Vanilla JS - API integration
4. **Portfolio Generator** - Next.js/Tailwind - SaaS tool

### Contact Section
- Form: Name, Email, Message
- Social links: GitHub, LinkedIn, Twitter, Email
- Submit button with loading animation

---

## 6. Technical Implementation

### File Structure
```
portfolio/
└── index.html (single file with embedded CSS/JS)
```

### External Resources
- Google Fonts: Orbitron, Rajdhani, JetBrains Mono
- No external JS libraries (vanilla implementation)

### CSS Features Used
- CSS Grid / Flexbox for layout
- CSS Custom Properties for theming
- CSS Animations / @keyframes
- backdrop-filter for glassmorphism
- clip-path for decorative shapes

### JavaScript Features Used
- Canvas API for particle system
- IntersectionObserver for scroll animations
- requestAnimationFrame for smooth animations
- CSS custom properties for dynamic values

---

## 7. Acceptance Criteria

- Page loads with particle animation running
- Hero text types out automatically
- Scrolling triggers section reveals
- All buttons have hover effects
- Project cards tilt on hover
- Contact form has visual feedback
- Navigation highlights active section
- Fully responsive layout
- No console errors