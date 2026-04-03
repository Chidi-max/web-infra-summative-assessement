// Google Books API configuration
const API_BASE = 'https://www.googleapis.com/books/v1/volumes';

// DOM elements
const searchInput = document.getElementById('searchInput');
const authorFilter = document.getElementById('authorFilter');
const sortNewest = document.getElementById('sortNewest');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const clearRecentBtn = document.getElementById('clearRecentBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const recentSearches = document.getElementById('recentSearches');
const recentList = document.getElementById('recentList');
const resultsInfo = document.getElementById('resultsInfo');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const results = document.getElementById('results');

let allBooks = []; // Store all results for filtering

// Search function
async function searchBooks() {
    const query = searchInput.value.trim();
    if (!query) {
        showError('Please enter a search term');
        return;
    }
    
    addRecentSearch(query); // Add to recent
    
    showLoading(true);
    hideError();
    
    try {
        const orderBy = sortNewest.checked ? 'newest' : undefined;
        const url = new URL(API_BASE);
        url.searchParams.append('q', query);
        if (orderBy) {
            url.searchParams.append('orderBy', orderBy);
        }
        url.searchParams.append('maxResults', '40');

        const response = await fetch(url);

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        allBooks = data.items || [];
        displayBooks(allBooks);
        updateResultsCount(allBooks.length);
    } catch (err) {
        console.error(err);
        showError('Failed to fetch books: ' + err.message + '. Please check your internet connection and try again.');
    } finally {
        showLoading(false);
    }
}

// Display books (filtered)
function displayBooks(books) {
    results.innerHTML = '';
    
    if (books.length === 0) {
        results.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); font-size: 18px; padding: 60px 40px;"><div style="font-size: 48px; margin-bottom: 20px;">📚</div><p style="font-weight: 600; margin-bottom: 10px;">No books found</p><p style="font-size: 14px; opacity: 0.8;">Try adjusting your search term or filters</p></div>';
        updateResultsCount(0);
        return;
    }
    
    books.forEach(book => {
        const card = createBookCard(book);
        results.appendChild(card);
    });
    updateResultsCount(books.length);
}

// Create book card element
function createBookCard(book) {
    const volume = book.volumeInfo;
    const title = volume.title || 'No title';
    const authors = volume.authors ? volume.authors.join(', ') : 'Unknown author';
    const description = volume.description ? volume.description.replace(/<[^>]*>/g, '').substring(0, 180) + '...' : 'No description available.';
    const thumbnail = volume.imageLinks?.thumbnail || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI5MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij7mhYJmPC90ZXh0Pjwvc3ZnPg==';
    const link = volume.previewLink || '#';
    const publishedDate = volume.publishedDate ? new Date(volume.publishedDate).getFullYear() : 'Unknown';
    const pageCount = volume.pageCount ? `${volume.pageCount} pages` : 'Page count not available';
    const isbn = volume.industryIdentifiers ? volume.industryIdentifiers.find(id => id.type === 'ISBN_13' || id.type === 'ISBN_10')?.identifier : null;
    const publisher = volume.publisher ? volume.publisher : 'Unknown publisher';
    
    const card = document.createElement('div');
    card.className = 'book-card';
    
    card.innerHTML = `
        <img src="${thumbnail}" alt="${title}" class="book-thumbnail" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI5MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij7NoaWJva2U8L3RleHQ+PC9zdmc+'">
        <div class="book-info">
            <div class="book-title">${title}</div>
            <div class="book-author">✍️ ${authors}</div>
            <div class="book-meta">
                <span>📅 ${publishedDate}</span>
                <span>📖 ${pageCount}</span>
            </div>
            ${isbn ? `<div class="book-isbn">ISBN: ${isbn}</div>` : ''}
            <div class="book-description">${description}</div>
            <a href="${link}" target="_blank" class="book-link">View on Google Books →</a>
        </div>
    `;
    
    return card;
}

// Filter books by author
function filterBooks() {
    const filterValue = authorFilter.value.toLowerCase().trim();
    if (!allBooks.length) return;
    
    const filtered = allBooks.filter(book => {
        const authors = book.volumeInfo.authors || [];
        return authors.some(author => author.toLowerCase().includes(filterValue));
    });
    
    displayBooks(filtered);
}

// Show/hide loading
function showLoading(show) {
    loading.classList.toggle('hidden', !show);
}

// Show error
function showError(message) {
    let fullMsg = message;
    if (message.includes('fetch') || message.includes('failed')) {
        fullMsg += '\n💡 Tip: Use Live Server extension or `npx serve .` for API access (CORS issue)';
    }
    error.innerHTML = fullMsg.replace('\n', '<br>');
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

// Recent searches functions
function addRecentSearch(query) {
    let recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    recent = recent.filter(q => q !== query).slice(0, -5); // Remove duplicates, keep 5
    recent.unshift(query);
    localStorage.setItem('recentSearches', JSON.stringify(recent));
    renderRecentSearches();
}

function renderRecentSearches() {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    if (recent.length) {
        recentList.innerHTML = recent.map(q => `<button class="recent-btn" onclick="searchInput.value='${q.replace(/'/g, "\\'")}'; searchBooks();">${q}</button>`).join('');
        recentSearches.classList.remove('hidden');
    } else {
        recentSearches.classList.add('hidden');
    }
}

function clearRecent() {
    localStorage.removeItem('recentSearches');
    renderRecentSearches();
}

// Theme functions
function updateModeLabel() {
    const modeLabel = document.getElementById('modeLabel');
    if (darkModeToggle.checked) {
        modeLabel.textContent = '☀️ Light Mode';
    } else {
        modeLabel.textContent = '🌙 Dark Mode';
    }
}

function initTheme() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    darkModeToggle.checked = isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    updateModeLabel();
}

function toggleDarkMode() {
    const isDark = darkModeToggle.checked;
    localStorage.setItem('darkMode', isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    updateModeLabel();
}

// Results count
function updateResultsCount(count, total = allBooks.length) {
    resultsInfo.textContent = `Showing ${count} of ${total} books`;
    resultsInfo.classList.toggle('hidden', count === 0);
}

// Clear functions
function clearAll() {
    searchInput.value = '';
    authorFilter.value = '';
    allBooks = [];
    results.innerHTML = '';
    resultsInfo.classList.add('hidden');
    hideError();
    showRecent();
}

function showRecent() {
    renderRecentSearches();
}

// Enhanced error with CORS guidance

// Category button click handler
function handleCategoryClick(e) {
    const query = e.target.dataset.query;
    searchInput.value = query;
    searchBooks();
}

// Scroll handling for dark mode toggle
let ticking = false;

function handleScroll() {
    const container = document.querySelector('.dark-mode-container');
    if (window.scrollY <= 0) {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
    }
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderRecentSearches();
    showRecent();
    
    // Add event listeners for category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', handleCategoryClick);
    });
    
    // Initial scroll state
    handleScroll();
    
    // Scroll and resize listeners
    window.addEventListener('scroll', requestTick);
    window.addEventListener('resize', requestTick);
});

// Event listeners
searchBtn.addEventListener('click', searchBooks);
clearBtn.addEventListener('click', clearAll);
clearRecentBtn.addEventListener('click', clearRecent);
darkModeToggle.addEventListener('change', toggleDarkMode);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBooks();
});
authorFilter.addEventListener('input', filterBooks);
sortNewest.addEventListener('change', () => {
    if (allBooks.length) {
        // Re-search with new sort parameter
        searchBooks();
    }
});

