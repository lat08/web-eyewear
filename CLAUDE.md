# CLAUDE.md

This file provides guidance to Claude Opus (claude.ai/code) when working with code in this repository.

## Project Overview
E-commerce landing page for "Kilala Eye" (lens/eyewear shop) built with Next.js 16 and React 19. Vietnamese locale. Specializes in selling lens (tròng kính), sunglasses, and frames.

## Commands
```bash
npm run dev     # Start development server on http://localhost:3000
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Tech Stack
- **Framework:** Next.js 16.1.6 (App Router)
- **UI:** React 19.2.3, Tailwind CSS 4
- **Database:** Prisma with SQLite (dev)
- **Icons:** Lucide React
- **Carousels:** Swiper

## Architecture
- **Pages:** `app/page.tsx` (landing page), `app/layout.tsx` (root layout with Inter font, Vietnamese metadata)
- **Components:** `app/components/` - Header, Hero, FeaturedProducts, SuperComboSection, BlogSection, NewsletterSection, Footer
- **Styling:** `app/globals.css` with Tailwind 4 `@import "tailwindcss"` and custom CSS variables (teal/gray color palette, custom animations)
- **Database:** `prisma/schema.prisma` - Todo model (placeholder), uses SQLite via `DATABASE_URL` in `.env`
- **Alias:** `@/*` maps to project root

## Design System
- Primary color: `--color-primary: #0d9488` (teal-600)
- Fonts: Inter (loaded via `next/font/google`)
- Custom animations: slideDown, fadeIn, scaleIn
- Scrollbar: Custom teal styling
- Brand: Kilala Eye - specializes in lens (tròng kính)
