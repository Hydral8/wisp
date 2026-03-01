# Wisp Use Cases

Wisp's core value: **one prompt orchestrates multiple MCP tools + browser automation**. Each use case below combines browser-use with other MCP servers to do things no single tool can.

---

## 1. LinkedIn: Job Search + Easy Apply

**Prompt:** "Search LinkedIn for 5 software engineer jobs matching my background and apply using Easy Apply"

- browser-use: Search LinkedIn jobs, filter by Easy Apply, fill out application form (resume, contact info, work experience), submit
- Memory/Profile: User's resume, work history, contact info stored in Wisp
- **Prereqs:** LinkedIn auth (cookie or session), user profile in memory

**Simpler variant:** "Find 5 people at [company] on LinkedIn and send them a connection request with a cold message"
- browser-use: Search company employees, send connect + message
- **Prereqs:** LinkedIn auth

**Why Easy Apply:** Most LinkedIn jobs use Easy Apply (in-platform form), no external email needed. Browser-use can fill the multi-step form directly.

**Difficulty:** Medium-Hard (LinkedIn anti-bot, auth complexity)

---

## 2. GitHub Trending → Notion Database

**Prompt:** "Fetch today's top trending repositories on GitHub, check if I've already starred them, star the new ones, and save them all to my Notion database"

- browser-use: Scrape GitHub Trending page (or GitHub MCP: use API)
- GitHub MCP: Check star status, star repos
- Notion MCP: Create entries in a database with repo name, description, stars, language, URL
- **Prereqs:** GitHub token, Notion integration token + database ID

**Difficulty:** Easy — great demo candidate

---

## 3. Form Filling / Event Registration

**Prompt:** "Sign up for [Eventbrite link] using my profile"

- browser-use: Navigate to event page, fill registration form (name, email, etc.), submit
- Memory/Profile: Simple key-value store for user info (name, email, phone, company)
- **Prereqs:** User profile stored in Wisp memory

**Extensions:**
- "Register me for all AI meetups in SF this weekend on Eventbrite"
- "Fill out this Google Form with my details"
- "Apply to this YC batch using my saved application info"

**Difficulty:** Easy-Medium

---

## 4. Food Delivery Price Comparison

**Prompt:** "I want to order pad thai — compare price and delivery time on UberEats, DoorDash, and Grubhub"

- browser-use: Open each platform, search for the item, extract price + ETA + fees
- Output: Side-by-side comparison table with total cost and delivery time
- **Extension:** "Order from the cheapest one" → browser-use completes checkout

**Difficulty:** Medium (3 parallel browser sessions, different site structures)

---

## 5. Competitive Intelligence Dashboard

**Prompt:** "Monitor [competitor website] and [their Product Hunt page], summarize any changes since last week"

- browser-use: Scrape competitor site, Product Hunt page, changelog
- Notion/Sheets MCP: Log changes to a tracking database
- Slack MCP: Send summary to #competitive-intel channel
- **Extension:** Schedule as recurring workflow

**Difficulty:** Medium

---

## 6. Research + Report Generation

**Prompt:** "Research the top 5 AI agent frameworks, compare their features, and create a report in Google Docs"

- browser-use: Visit each framework's site, docs, GitHub — extract features, stars, pros/cons
- Google Docs MCP: Create formatted comparison document
- **Alternative output:** Notion page, Markdown file, or email

**Difficulty:** Medium

---

## 7. Travel Planning

**Prompt:** "Find the cheapest round-trip flight from SF to Tokyo in June and the top-rated Airbnb near Shibuya under $150/night"

- browser-use: Search Google Flights + Airbnb, extract options
- Notion/Sheets MCP: Save options to a planning doc
- Email MCP: Send summary to self

**Difficulty:** Medium

---

## 8. Social Media Cross-Post

**Prompt:** "Post this announcement to Twitter, LinkedIn, and our company blog"

- browser-use: Navigate to each platform, create post, paste content, submit
- **Prereqs:** Auth for each platform
- **Extension:** "Schedule it for 9am PST tomorrow"

**Difficulty:** Medium (multi-platform auth)

---

## 9. Invoice / Receipt Processing

**Prompt:** "Go to my [service] dashboard, download last month's invoices, and log them in my expense tracker on Notion"

- browser-use: Login to service dashboard, navigate to billing, download PDFs
- Notion MCP: Create expense entries with date, amount, vendor, link to PDF

**Difficulty:** Medium

---

## 10. Diagram Generation (Draw.io)

**Prompt:** "Create a system architecture diagram in Draw.io for our microservices: auth, user, payment, notification"

- browser-use: Open draw.io, create shapes, connect them, label services
- **Alternative:** Use Mermaid MCP to generate diagram code, browser-use to render in draw.io

**Difficulty:** Hard (precise UI manipulation)

---

---

## Why Browser-Use? When API/MCP Can't Replace It

Browser-use is necessary when:
- **No API exists** — the site only has a web UI
- **JS rendering required** — content loads dynamically (SPA, infinite scroll)
- **Login session required** — cookie/session auth, no OAuth API available
- **Form interaction** — multi-step forms, dropdowns, file uploads, CAPTCHAs
- **Visual verification** — need to see what a human sees (screenshots, layout)

**Best demo structure: browser-use does what APIs can't + MCP does what APIs can.**

---

## Top Demo Candidates (browser-use + MCP hybrid)

### A. Food Delivery Comparison (BEST DEMO)

**Prompt:** "I want pad thai — compare price and delivery time on UberEats, DoorDash, and Grubhub"

| Step | Tool | Why this tool? |
|------|------|----------------|
| Search each platform for "pad thai" | browser-use | No public API for menu search, need login/location, JS-rendered |
| Extract price, fees, ETA | browser-use | Data only visible in rendered UI |
| Format comparison table | Gemini (built-in) | Text processing |
| Send result to Slack/email | Slack MCP / Email MCP | Has API, no browser needed |

**Why browser-use is irreplaceable:** UberEats/DoorDash/Grubhub have no public API for menu search. Prices depend on your address, login, and promos — only visible in the actual UI.

---

### B. Event Signup + Calendar (EASIEST DEMO)

**Prompt:** "Sign up for [Eventbrite/Lu.ma link] using my profile, then add it to my Google Calendar"

| Step | Tool | Why this tool? |
|------|------|----------------|
| Open event page, fill form, submit | browser-use | Form filling on arbitrary sites, no API |
| Extract event date/time/location | browser-use | Parse from rendered page |
| Create calendar event | Google Calendar MCP | Has API, structured data |
| Send confirmation to Slack | Slack MCP | Has API |

**Why browser-use is irreplaceable:** Eventbrite/Lu.ma registration forms are arbitrary HTML — no standard API for "sign up for this event."

---

### C. Competitor Price Monitoring + Alert

**Prompt:** "Check the pricing page of [competitor.com], compare with our prices, and alert me on Slack if they changed"

| Step | Tool | Why this tool? |
|------|------|----------------|
| Scrape competitor pricing page | browser-use | No API, JS-rendered pricing tables, may need cookie consent |
| Compare with our prices | Gemini (built-in) or Sheets MCP | Data comparison |
| Send Slack alert if changed | Slack MCP | Has API |
| Log to spreadsheet | Google Sheets MCP | Has API |

**Why browser-use is irreplaceable:** Competitor websites don't offer APIs for their pricing. Many use JS rendering, cookie consent walls, or A/B test different prices.

---

### D. GitHub Trending → Star + Notion (GOOD DEMO)

**Prompt:** "Get today's trending repos on GitHub, star the ones I haven't starred, and save them to my Notion database"

| Step | Tool | Why this tool? |
|------|------|----------------|
| Scrape GitHub Trending page | browser-use | GitHub Trending has NO API endpoint |
| Check star status + star repos | GitHub MCP | Has API, faster and more reliable |
| Save to Notion database | Notion MCP | Has API, structured writes |

**Why browser-use is irreplaceable:** GitHub has a great API but `/trending` is NOT in it — it's a server-rendered page with no API equivalent.

---

### E. LinkedIn Easy Apply

**Prompt:** "Find 5 remote ML engineer jobs on LinkedIn and apply with Easy Apply"

| Step | Tool | Why this tool? |
|------|------|----------------|
| Search jobs, filter, click Easy Apply | browser-use | LinkedIn API is restricted, Easy Apply is form-based |
| Fill multi-step application form | browser-use | Dynamic forms, file upload, dropdowns |
| Log applied jobs to Notion | Notion MCP | Has API |
| Send summary to email | Email MCP | Has API |

**Why browser-use is irreplaceable:** LinkedIn's job API is heavily gated (requires partner access). Easy Apply is a multi-step in-browser form.

---

## Summary: What MUST Use Browser-Use

| Site/Task | Has Public API? | Must use browser-use? |
|-----------|-----------------|----------------------|
| UberEats/DoorDash menu search | No | Yes |
| Eventbrite/Lu.ma signup form | No (for registration) | Yes |
| Competitor pricing pages | No | Yes |
| GitHub Trending | No | Yes |
| LinkedIn Easy Apply | No (restricted) | Yes |
| GitHub star/unstar | Yes | No — use GitHub MCP |
| Notion read/write | Yes | No — use Notion MCP |
| Slack messages | Yes | No — use Slack MCP |
| Google Calendar | Yes | No — use Calendar MCP |
| Google Sheets | Yes | No — use Sheets MCP |
| Email sending | Yes | No — use Email MCP |
