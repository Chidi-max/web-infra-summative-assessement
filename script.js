// Google Books API
const API_BASE = 'https://www.googleapis.com/books/v1/volumes';

// DOM elements
const searchInput = document.getElementById('searchInput');
const authorFilter = document.getElementById('authorFilter');
const sortNewest = document.getElementById('sortNewest');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const clearRecentBtn = document.getElementById('clearRecentBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const modeLabel = document.getElementById('modeLabel');
const categoryButtons = document.querySelectorAll('.category-btn');

const recentSearches = document.getElementById('recentSearches');
const recentList = document.getElementById('recentList');

const resultsInfo = document.getElementById('resultsInfo');
const loading = document.getElementById('loading');
const errorBox = document.getElementById('error');
const results = document.getElementById('results');

let allBooks = [];

/* =========================
   SEARCH BOOKS
========================= */
async function searchBooks() {
    const query = searchInput.value.trim();

    if (!query) {
        showError("Please enter a search term");
        return;
    }

    addRecentSearch(query);

    showLoading(true);
    hideError();

    try {
        const url = new URL(API_BASE);
        url.searchParams.append('q', query);
        url.searchParams.append('maxResults', '30');

        if (sortNewest.checked) {
            url.searchParams.append('orderBy', 'newest');
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.items) {
            allBooks = [];
            displayBooks([]);
            return;
        }

        allBooks = data.items;
        displayBooks(allBooks);

    } catch (err) {
        console.error(err);
        showError("Failed to fetch books. Check your internet connection.");
    } finally {
        showLoading(false);
    }
}

/* =========================
   DISPLAY BOOKS
========================= */
function displayBooks(books) {
    results.innerHTML = "";

    if (!books || books.length === 0) {
        results.innerHTML = `
            <div class="empty">
                📚 No books found. Try another search.
            </div>
        `;
        updateResultsCount(0, 0);
        return;
    }

    books.forEach(book => {
        results.appendChild(createBookCard(book));
    });

    updateResultsCount(books.length, allBooks.length);
}

/* =========================
   CREATE BOOK CARD
========================= */
function createBookCard(book) {
    const v = book.volumeInfo || {};

    const title = v.title || "No title";
    const authors = v.authors ? v.authors.join(", ") : "Unknown author";
    const description = v.description
        ? v.description.replace(/<[^>]*>/g, "").substring(0, 180) + "..."
        : "No description available.";

    const thumbnail = v.imageLinks?.thumbnail || "";
    const preview = v.previewLink || "#";
    const year = v.publishedDate ? new Date(v.publishedDate).getFullYear() : "Unknown";

    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
        <img src="${thumbnail}" alt="${title}" class="book-thumbnail"
        onerror="this.style.display='none'">

        <div class="book-info">
            <h3>${title}</h3>
            <p><strong>Author:</strong> ${authors}</p>
            <p><strong>Year:</strong> ${year}</p>
            <p>${description}</p>

            <a href="${preview}" target="_blank">View Book</a>
        </div>
    `;

    return card;
}

/* =========================
   FILTER BY AUTHOR
========================= */
function filterBooks() {
    const value = authorFilter.value.trim().toLowerCase();

    if (!value) {
        displayBooks(allBooks);
        return;
    }

    const filtered = allBooks.filter(book => {
        const authors = book.volumeInfo.authors || [];
        return authors.some(a => a.toLowerCase().includes(value));
    });

    displayBooks(filtered);
}

/* =========================
   LOADING + ERROR
========================= */
function showLoading(show) {
    loading.classList.toggle("hidden", !show);
}

function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove("hidden");
}

function hideError() {
    errorBox.classList.add("hidden");
}

/* =========================
   RECENT SEARCHES
========================= */
function addRecentSearch(query) {
    let recent = JSON.parse(localStorage.getItem("recent") || "[]");

    recent = recent.filter(q => q !== query);
    recent.unshift(query);

    recent = recent.slice(0, 5);

    localStorage.setItem("recent", JSON.stringify(recent));
    renderRecent();
}

function renderRecent() {
    const recent = JSON.parse(localStorage.getItem("recent") || "[]");

    if (recent.length === 0) {
        recentSearches.classList.add("hidden");
        return;
    }

    recentSearches.classList.remove("hidden");

    recentList.innerHTML = recent
        .map(q => `<button onclick="searchFromRecent('${q}')">${q}</button>`)
        .join("");
}

function searchFromRecent(query) {
    searchInput.value = query;
    searchBooks();
}

function clearRecent() {
    localStorage.removeItem("recent");
    renderRecent();
}

/* =========================
   RESULTS COUNT
========================= */
function updateResultsCount(count, total) {
    resultsInfo.textContent = `Showing ${count} of ${total}`;
}

/* =========================
   CLEAR ALL
========================= */
function clearAll() {
    searchInput.value = "";
    authorFilter.value = "";
    allBooks = [];
    results.innerHTML = "";
    resultsInfo.textContent = "";
}

/* =========================
   DARK MODE
========================= */
function updateModeLabel(isDark) {
    if (modeLabel) {
        modeLabel.textContent = isDark ? "Dark Mode" : "Light Mode";
    }
}

function toggleDarkMode() {
    const isDark = darkModeToggle.checked;
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("dark", isDark);
    updateModeLabel(isDark);
}

function initTheme() {
    const saved = localStorage.getItem("dark") === "true";
    darkModeToggle.checked = saved;
    document.documentElement.setAttribute("data-theme", saved ? "dark" : "light");
    updateModeLabel(saved);
}

/* =========================
   EVENTS
========================= */
searchBtn.addEventListener("click", searchBooks);
clearBtn.addEventListener("click", clearAll);
clearRecentBtn.addEventListener("click", clearRecent);

searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") searchBooks();
});

authorFilter.addEventListener("input", filterBooks);
darkModeToggle.addEventListener("change", toggleDarkMode);

/* =========================
   INIT
========================= */
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        const query = button.dataset.query || button.textContent.trim();
        window.scrollTo({ top: 0, behavior: "smooth" });
        searchInput.value = query;
        setTimeout(() => {
            searchBooks();
        }, 300);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    renderRecent();
});
