# Exactspace Technologies - React Assignments

This repository contains the completed **Photo Gallery Assignment** for Exactspace Technologies.

---

## 📸 Photo Gallery Overview

The Photo Gallery is a high-performance single-page React application that renders an infinite-scrolling feed of photographs fetched from the Picsum API. Each photo displays its high-resolution image (`download_url`), author attribution, and an interactive Font Awesome thumbs-up button with an individual click counter. The interface is pixel-accurate to the reference design provided in the assignment and fully responsive across mobile, tablet, and desktop devices.

### ✨ Implemented Features

1. **Picsum API Integration**:
   - Fetches paginated photos starting from `https://picsum.photos/v2/list?page=1`, continuing sequentially with `page=2`, `page=3`, etc.
   - Smooth asynchronous data fetching with fetch guards to prevent duplicate concurrent requests.

2. **Infinite Scroll**:
   - Modern `IntersectionObserver` sentinel placed at the bottom of the feed with prefetch margin.
   - Automatically detects when the user approaches the bottom of the page and fetches the next page seamlessly.
   - Gracefully stops fetching when no more photos are available (`hasMore = false`).

3. **Photo Display & Author Info**:
   - Displays each photo using its `download_url`.
   - Uses lazy loading (`loading="lazy"`) and shimmer skeleton placeholders to optimize performance and prevent layout shift.
   - Clearly displays photo author attribution matching the reference design: `Author: <author name>`.

4. **Font Awesome Thumbs-Up Button & Likes Counter**:
   - Uses the official `@fortawesome/react-fontawesome` and `@fortawesome/free-solid-svg-icons`.
   - Each photo starts with a like count of `0`.
   - Clicking the thumbs-up button increments the count by `1` per click for that specific photo.
   - Features micro-interaction bounce animation and keyboard accessibility (`aria-label`).

5. **Reference Design & Responsive Layout**:
   - Styled closely to `photo-gallery.png` and `photo-gallery.jpg`.
   - Desktop: Left-aligned single-column photo list with right-aligned header title "Photo gallery".
   - Mobile/Tablet: Fluid single-column responsive layout with touch-friendly spacing and image adaptation.

6. **Deduplication & Robust Error Handling**:
   - Photo IDs are checked and deduplicated before updating state.
   - Displays clear loading indicators while fetching initial and subsequent batches.
   - Catches network or API failures, displays user-friendly error banners, and provides an immediate **"Retry loading"** button.

---

## 📂 Project Structure

```
react-assignments-main/
├── README.md                           # Main documentation & run guide
├── package.json                        # Root workspace scripts (convenience)
├── .gitignore                          # Git ignore rules
├── chat-app/                           # Chat app assignment instructions & assets
│   ├── assets/
│   ├── reactjs_chat_assignment.md
│   └── team-chat-intro.gif
└── photo-gallery/                      # Completed React Photo Gallery project
    ├── README.md                       # Sub-project specific documentation
    ├── package.json                    # Dependencies & scripts
    ├── vite.config.js                  # Vite configuration & Vitest setup
    ├── index.html                      # HTML entry template
    ├── photo-gallery.jpg               # Reference design mockup (JPEG)
    ├── photo-gallery.png               # Reference design mockup (PNG)
    ├── reactjs_photo_gallery_assignment.md # Original assignment specification
    └── src/
        ├── main.jsx                    # React entry point
        ├── App.jsx                     # Layout shell with header and gallery
        ├── index.css                   # Comprehensive styles & media queries
        ├── components/
        │   ├── PhotoGallery.jsx        # Gallery container, API & scroll logic
        │   └── PhotoCard.jsx           # Individual photo card with like button
        └── test/
            ├── setup.js                # Test setup & IntersectionObserver mock
            ├── PhotoCard.test.jsx      # Component unit tests
            ├── PhotoGallery.test.jsx   # Integration tests (infinite scroll, deduplication, retry)
            └── serverProbe.js          # Vite server verification probe
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or later (Tested on Node v22.17.1)
- **npm**: v9.0.0 or later (Tested on npm 10.9.2)

### Option 1: Running from `photo-gallery` directory (Recommended)

```bash
# 1. Navigate to the photo-gallery directory
cd photo-gallery

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# (or npm start)
```

The application will be live at: **`http://localhost:3000`** (or the port indicated in your terminal).

### Option 2: Running from repository root

```bash
# 1. Install dependencies in photo-gallery
npm --prefix photo-gallery install

# 2. Start the dev server
npm run dev
# (or npm start)
```

---

## 🧪 Running Tests & Build Verification

### Run Automated Tests (Vitest & React Testing Library)
```bash
cd photo-gallery
npm test
```
*Executes all unit and integration tests verifying initial fetch, infinite scrolling, deduplication, like counters, and error retry.*

### Production Build
```bash
cd photo-gallery
npm run build
```
*Builds optimized static assets into `photo-gallery/dist`.*

### Preview Production Build
```bash
cd photo-gallery
npm run preview
```

---

## 🛠️ Tech Stack & Key Decisions

- **React 18**: Modern component architecture using functional components and hooks (`useState`, `useEffect`, `useCallback`, `useRef`).
- **Vite 5**: Ultra-fast bundler and dev server compliant with modern Node versions (Node 18 - 22+).
- **Font Awesome**: `@fortawesome/react-fontawesome` and `@fortawesome/free-solid-svg-icons` for the official thumbs-up icon.
- **IntersectionObserver**: Native browser API for performant, frictionless infinite scrolling without heavy third-party scroll listeners.
- **Vitest & React Testing Library**: Fast, reliable automated testing with jsdom.
