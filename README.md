[![WIP](https://img.shields.io/static/v1?label=WIP&message=Work%20In%20Progress&color=yellow&style=for-the-badge)](https://github.com/users/ekaone/projects/6)

# Pino: Interactive Web Piano App

Pino is a modern, interactive web-based piano application built with Next.js, React, and Tailwind CSS. It allows users to play piano notes, record and playback sequences, and customize their sound experience with a variety of controls and UI options.

---


## Features

- **Interactive Piano**: Clickable piano keys with real-time sound generation using the Web Audio API.
- **Octave & Waveform Control**: Change octaves and select different wave types (sine, square, sawtooth, triangle).
- **Volume & Sustain**: Adjust volume and sustain for nuanced sound control.
- **Note Labels**: Toggle note labels on/off for learning or performance.
- **Recording & Playback**: Record your note sequences and play them back with timing preserved.
- **Responsive UI**: Built with modern UI components, supporting both desktop and mobile layouts.
- **Component Library**: Modular UI built with shadcn/ui, Radix UI, and custom components.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

### Installation
```bash
pnpm install
```

### Development
```bash
pnpm dev
# or
npm run dev
```
App will be available at [http://localhost:3005](http://localhost:3005)

### Build for Production
```bash
pnpm build
```

---

## Project Structure

- `/app` - Next.js app directory (main entry: `page.tsx`, layout: `layout.tsx`)
- `/components` - UI and custom React components
- `/components/ui` - Shared UI primitives (Button, Slider, Select, Sidebar, etc.)
- `/lib` - Utility functions (e.g., `utils.ts`)
- `/public` - Static assets
- `/data` - (Optional) Data files

---

## Main Files Overview

- **`app/page.tsx`**: Main PianoApp component. Handles UI, sound synthesis, recording, and playback logic.
- **`app/layout.tsx`**: App layout, font and metadata configuration.
- **`components/ui/`**: Reusable UI primitives (Button, Slider, Select, Sidebar, etc.) built on Radix UI and shadcn/ui conventions.
- **`lib/utils.ts`**: Utility function for class name merging.
- **`package.json`**: Project metadata, scripts, and dependencies.
- **`tsconfig.json`**: TypeScript configuration.
- **`next.config.ts`**: Next.js configuration.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS, shadcn/ui, Radix UI
- **State Management**: React state, Zustand (optionally used)
- **Audio**: Web Audio API
- **Type Checking**: TypeScript
- **Linting**: ESLint

---

## Scripts

- `pnpm dev` / `npm run dev` - Start development server
- `pnpm build` / `npm run build` - Build for production
- `pnpm start` / `npm run start` - Start production server
- `pnpm lint` / `npm run lint` - Run ESLint

---

## Customization & Extending

- UI components can be extended or replaced via the `/components/ui` directory.
- Styles are managed using Tailwind CSS (`app/globals.css`).
- Add new features by creating new components in `/components` and wiring them into `app/page.tsx`.

---

## License

MIT

---

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## Author

- Eka Prasetia