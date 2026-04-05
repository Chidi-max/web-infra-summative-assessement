# 📚 BOOK SEARCH APPLICATION — README
## Developer info
Email- c.anigbogu@gmail.com
Github Username- Chidi-max
Repo link- https://github.com/Chidi-max/web-infra-summative-assessement.git
Demo video link- https://youtu.be/odSRnVbu2Ds?si=zlTMQ1b-xcAK6LEZ

## Project Overview

This is a Book Search Web Application that allows users to search for books using the Google Books API. The application displays results in a clean grid layout and provides useful information such as title, author, publication year, description, and a direct preview link.

It also includes features like recent searches, filtering by author, sorting by newest publications, and dark mode support.

---

## Purpose of the Application

The application is designed to solve the problem of quick and easy access to book information. Instead of manually browsing multiple websites, users can instantly search for books and get structured results in one place.

It is both educational and practical, helping users discover books efficiently.

---

## Features

### Search Functionality
- Search books using keywords (title, author, topic)
- Fetches real-time data from Google Books API

### Book Display
- Displays books in a clean grid layout (5 columns on desktop)
- Shows:
  - Book cover
  - Title
  - Author(s)
  - Year of publication
  - Short description
  - Preview link

### Filtering & Sorting
- Filter books by author name
- Sort results by newest publications

### Recent Searches
- Saves last 5 searches using localStorage
- Click to quickly repeat a search
- Option to clear recent searches

### Dark Mode
- Toggle between light and dark themes
- Saves user preference in localStorage

### Error Handling
- Handles empty search input
- Handles API errors
- Handles missing or broken image links

---

## External API Used

### Google Books API
- URL: https://www.googleapis.com/books/v1/volumes
- Used to fetch book data based on user search queries

### Attribution
This application uses the Google Books API provided by Google Developers.

---

## Key Functional Requirements Met

✔ Uses external API  
✔ Provides user interaction with data  
✔ Includes filtering and sorting features  
✔ Displays data in a structured grid layout  
✔ Implements error handling for API failures  
✔ Uses localStorage for persistent recent searches  
✔ Responsive UI design  

---

## Technologies Used

- HTML5
- CSS3 (Grid + Flexbox)
- JavaScript (Vanilla JS)
- Google Books API
- LocalStorage API

---

## Project Structure

```
/project-folder
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## How It Works

1. User enters a search term
2. JavaScript sends request to Google Books API
3. API returns list of books
4. Application processes and displays results in grid format
5. User can filter, sort, or revisit recent searches

---

## User Interaction Features

- Click search button or press Enter to search
- Click author filter input to refine results
- Toggle dark mode switch
- Click recent search buttons to repeat searches
- Click "View Book" to open Google Books preview

---

## Error Handling

The application gracefully handles:
- Empty search input
- No results found
- Network/API failures
- Missing book images

---

## Future Improvements

- Add pagination for large results
- Add genre/category filtering
- Add book preview modal (instead of redirect)
- Improve mobile UI layout further
- Add bookmarking/favorites system

---

## Author

Developed as a frontend project demonstrating:
- API integration
- Dynamic UI rendering
- User interaction handling
- Responsive grid layout design
```