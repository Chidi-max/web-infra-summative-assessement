#  Google Books Search Interface

A simple, responsive web interface to search millions of books using the Google Books API with advanced filtering and sorting capabilities.

##  Features

- ** Book Search** - Search by title, author, ISBN, etc.
- ** Rich Display** - Shows title, author, description, and preview link
- ** Sort by Date** - Toggle to sort results by publication date (newest first)
- ** Filter by Author** - Real-time filtering of displayed results
- ** Recent Searches** - Automatically stores up to 5 recent searches in localStorage
- ** Dark Mode** - Toggle dark theme with persistent storage
- ** Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ** Modern UI** - Beautiful gradient backgrounds and smooth animations

## 🚀 Getting Started

### 1. Open the Application

Using **npx serve** (recommended):

```bash
npx serve web-infra-summative-assessement
```

Then visit `http://localhost:8000` in your browser.

Alternatively, use **Live Server** extension in VS Code:

- Right-click on `index.html` → "Open with Live Server"

### 2. Search for Books

1. Enter a search term (e.g., "climate change", "machine learning", "Harry Potter")
2. Click the "🔍 Search" button or press Enter
3. Browse the results with book covers, details, and links to Google Books

##  Controls

| Feature              | How to Use                                                    |
| -------------------- | ------------------------------------------------------------- |
| **Search**           | Type keyword + click Search or press Enter                    |
| **Sort by Date**     | Check "Sort newest first" before or after searching           |
| **Filter by Author** | Enter author name in the "Filter by author" field (real-time) |
| **Dark Mode**        | Toggle the Dark Mode switch to change theme                   |
| **Recent Searches**  | Click any recent search button to run it again                |
| **Clear All**        | Click to reset search and filters                          |

##  API Information

- **API**: Google Books API v1
- **Endpoint**: `https://www.googleapis.com/books/v1/volumes`
- **No authentication required** for basic requests
- **Max Results**: 40 books per search

##  Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Responsive grid layout, CSS variables for theming
- **JavaScript (ES6+)** - Async/await API calls, DOM manipulation

##  File Structure

```
web-infra-summative-assessement/
├── index.html         # HTML structure and UI
├── styles.css         # Responsive styling with dark mode
├── script.js          # API integration and functionality
└── README.md         # This file
```

##  Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Data Storage

- **Recent Searches**: Stored in browser's localStorage (persists between sessions)
- **Dark Mode Preference**: Stored in browser's localStorage

To clear stored data, open browser DevTools and:

```javascript
localStorage.clear();
```

##  Troubleshooting

**Problem**: "Failed to fetch books: CORS issue"

- **Solution**: Make sure you're using a local server (`npx serve` or Live Server). Direct `file://` protocol won't work due to CORS restrictions.

**Problem**: Results aren't filtering by author

- **Solution**: Make sure you've searched first, then use the author filter on existing results.

**Problem**: Dark mode not working

- **Solution**: Check if localStorage is enabled in your browser settings.

##  Learning Resources

- [Google Books API Documentation](https://developers.google.com/books)
- [Fetch API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

##  Future Enhancements

- [ ] Save favorite books
- [ ] Export search results as PDF
- [ ] Advanced filters (published date range, language, etc.)
- [ ] Search suggestions/autocomplete
- [ ] Reading list management
- [ ] Book ratings from Google Books

##  License

Open source - Feel free to use and modify!

---

