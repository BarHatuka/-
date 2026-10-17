# PRD — Première (פרמיירה)

## 1. Pitch
A Hebrew guide to TV series: browse a wall of posters, open any show on its own page to see where and when it aired, who is in it and what it is about, keep your own list of shows to watch, and see what is on TV today.

## 2. Who it is for
Hebrew speakers looking for their next series. They want the essentials of a show on one screen — rating, genres, network, broadcast slot, cast and summary — a simple way to remember the ones they liked, and a link they can send to a friend.

## 3. Screens
- **List** · `/` — a wall of posters, highest rated first. Each poster shows the name, premiere year and rating. Above the wall: a search box and genre filters.
- **Details** · `/shows/:id` (e.g. `/shows/2`) — large poster, name, one line about where and when the show aired, genres, rating, episode length, language, summary, the main cast, a save button, and links to TVmaze and the official site.
- **My list** (הרשימה שלי) · `/my-list` — the shows I saved, with a way to remove each one.
- **On TV today** (היום בטלוויזיה) · `/today` — today's US broadcast schedule, by hour. Each entry links to the show's page.
- **Not found** · any other address — a short message and a link back to the wall.

A header with links to the wall, my list and today's schedule is on every page.

## 4. Must-have features
1. Load the data from TVmaze, with a loading state and an error state with a "נסו שוב" (try again) button, on every page that fetches.
2. A separate address for every page and for every show. Opening an address directly, or refreshing on it, shows the same page.
3. Search shows by name and filter by genre. Both are kept in the address, so going back from a show returns to the same filtered wall.
4. Save shows to "הרשימה שלי", kept after a page refresh.
5. Today's schedule, grouped by hour.

## 5. Acceptance criteria
- When I open the app, I see "טוענים את הסדרות…" and then a wall of posters, highest rated first; when the network is offline, I see an error message and a "נסו שוב" button, not a blank screen.
- When I click "Person of Interest", I see the address `/shows/2`, its rating 8.8, the line "שודרה בין 2011 ל-2016 ב-CBS" and its cast — and I see the same after refreshing the page.
- When I pick the "קומדיה" genre and type "new" in the search box, I see only comedies with "new" in their name, like New Girl, and the address ends with `?genre=Comedy&q=new`.
- When I save a show and refresh the page, I see it in "הרשימה שלי".
- When I open "היום בטלוויזיה", I see today's shows by hour, and clicking a show opens its page.

## 6. Not now
- Searching the whole TVmaze catalog (search works on the shows that were loaded).
- Seasons and episode lists for a show.
- Sorting by anything other than rating.
- A light theme.
- Accounts, or syncing "הרשימה שלי" between devices.

## 7. Data
- **API:** TVmaze — free, no key, open to the browser (CORS). Data and images © TVmaze, CC BY-SA 4.0, credited in the footer.
  - `https://api.tvmaze.com/shows` — the wall: page 0 of the catalog, about 240 shows.
  - `https://api.tvmaze.com/shows/:id?embed=cast` — a show page, together with the cast, so the page works without loading the wall first.
  - `https://api.tvmaze.com/schedule?country=US` — today's schedule.
- **Fields in the list:** `id`, `name`, `image.medium`, `premiered`, `rating.average`, `genres`.
- **Fields in the details:** the list fields, plus `image.original`, `status`, `ended`, `network.name` or `webChannel.name`, `schedule`, `runtime`, `language`, `summary` (HTML, shown as plain text), `url`, `officialSite`, and `_embedded.cast` (actor name and character name).
- **Fields in the schedule:** `airtime`, `name`, `season`, `number`, `show.id`, `show.name`, `show.network.name`.
- **localStorage:** `premiere:my-list` — the saved shows (id, name, poster, year, rating), so the page works without another request.
