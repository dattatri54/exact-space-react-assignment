# Photo Gallery Application

This project is the complete implementation of the **Exactspace Technologies Photo Gallery Assignment**.

## Features Implemented

1. **Picsum API Paginated Fetching**: Sequentially retrieves photos from `https://picsum.photos/v2/list?page=${page}` starting from page 1.
2. **Infinite Scrolling**: Automatically loads subsequent pages using an `IntersectionObserver` sentinel before the user reaches the bottom.
3. **Photo & Author Display**: Displays each photo thumbnail via `download_url` and author attribution (`Author: <author name>`).
4. **Font Awesome Like Button & Counter**: Font Awesome thumbs-up icon beside each photo. Each photo starts with 0 likes and increments individually by 1 per click.
5. **Reference Design Accuracy**: Matches the styling, serif typography, photo dimensions, and desktop layout of `photo-gallery.png`.
6. **Responsive Layout**: Adapts gracefully to mobile and tablet screen widths without horizontal scroll.
7. **Deduplication & Error Resilience**: Duplicate IDs are filtered out; API failures display a retry button; shimmer skeletons show during image loading.

## Getting Started

### 1. Install dependencies:
```bash
npm install
```

### 2. Start dev server:
```bash
npm run dev
# or: npm start
```

Open `http://localhost:3000` in your web browser.

### 3. Run automated tests:
```bash
npm test
```

### 4. Create production build:
```bash
npm run build
```
