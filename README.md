# BOOK SEARCH APPLICATION 

## Developer info
- Email: c.anigbogu@gmail.com
- GitHub Username: Chidi-max
- Repo link: https://github.com/Chidi-max/web-infra-summative-assessement.git
- Demo video link: https://youtu.be/VPBooN3Zs0o
- Live deployment (via load balancer): https://www.chidi-max.tech

---

## Project Overview

This is a Book Search Web Application that allows users to search for books using the Google Books API. The application displays results in a clean grid layout and provides useful information such as title, author, publication year, description, and a direct preview link.

It also includes features like recent searches, filtering by author, sorting by newest publications, and dark mode support.

---

## Purpose of the Application

Finding structured, reliable information about a book — beyond a single blog review or a bare Amazon listing — usually means checking several different sites. This application solves that by giving students, researchers, and general readers a single place to search, filter, and compare book information pulled directly from Google's own book database.

It's particularly useful for:
- Students and researchers looking for source material on a topic
- Readers deciding between books before committing to one
- Anyone building a personal reading list who wants quick, structured comparisons (author, year, description) rather than scattered search results

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
- Requires an API key (see **API Key Setup** below)

### Attribution
This application uses the Google Books API provided by Google Developers: https://developers.google.com/books

---

## API Key Setup

This application requires a Google Books API key to function (unauthenticated requests are heavily rate-limited).

**To run this project yourself:**

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select an existing one)
3. Enable the **Books API** for that project
4. Create a new API key under **Credentials**
5. (Recommended) Restrict the key to the **Books API** only, and restrict it to your own domain(s) under **Application restrictions → Websites**
6. Create a file named `config.js` in the project root with the following content:

```
const API_KEY = 'API_KEY';
```

7. `config.js` is excluded from version control via `.gitignore` 

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
- JavaScript 
- Google Books API
- LocalStorage API
- Nginx (web server)
- HAProxy (load balancing)

---

## Project Structure

```
/project-folder
│
├── index.html
├── styles.css
├── script.js
├── config.js        (git-ignored, holds API_KEY)
├── Background image.png
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

## Deployment

The application is deployed as static files (HTML/CSS/JS) served by **Nginx** on `web-02`, sitting behind an **HAProxy** load balancer (`lb-01`) that routes incoming traffic to the web server pool. The load balancer is reachable via `www.chidi-max.tech`, with HTTPS termination and an automatic HTTP → HTTPS redirect configured on `lb-01`.

### Deployment steps

1. **Copy the application files to the web server** via `scp`:
  
   scp -i <private_key> index.html styles.css script.js config.js "Background image.png" ubuntu@<web-02-ip>:/tmp/
   ```

2. **Move the files into Nginx's web root**:
  
   ssh -i <private_key> ubuntu@<web-02-ip>
   sudo mv /tmp/index.html /tmp/styles.css /tmp/script.js /tmp/config.js "/tmp/Background image.png" /var/www/html/
   ```

3. **Load balancer configuration** — HAProxy on `lb-01` is configured with a backend pool using round-robin distribution and health checks:
   ```
   backend web_servers
       balance roundrobin
       server web-02 <web-02-ip>:80 check

   frontend http_front
       bind *:80
       bind *:443 ssl crt /etc/haproxy/certs/www.chidi-max.tech.pem
       redirect scheme https code 301 if !{ ssl_fc }
       default_backend web_servers
   ```

4. **DNS** — `www.chidi-max.tech` resolves to the load balancer's IP, so all traffic is routed through HAProxy rather than hitting a web server directly.

### Testing the deployment

- Access the app via `https://www.chidi-max.tech` (the load balancer's address), not a web server's IP directly, to confirm requests genuinely pass through HAProxy.
- The `X-Served-By` response header confirms which backend server handled the request:
  ```bash
  curl -sI https://www.chidi-max.tech | grep X-Served-By
  ```
- Perform several searches through the live URL to confirm the deployed version functions identically to the local version.

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
- Deployment across a load-balanced multi-server infrastructure
