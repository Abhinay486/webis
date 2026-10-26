Act as an expert frontend developer. I want to create a web application called "Class of 10th - Members Directory". Please generate the complete code including HTML, CSS (using Tailwind CSS via CDN), JavaScript, and a sample JSON data structure.

The project consists of two main views: a Home Page (Directory) and a Member Detail Page.

1. DATA STRUCTURE (mockData.js)
Create a mock JSON array of member objects. Each object should have the following properties: 
- id (string)
- name (string)
- nickname (string)
- dob (string, format: YYYY-MM-DD)
- residence (string, e.g., "Vijayawada, Andhra Pradesh")
- occupation (string)
- organization (string)
- phone (string)
- email (string)
- bloodGroup (string)
- profilePic (string, URL to placeholder image)

2. HOME PAGE (index.html)
Layout & UI Requirements:
- Background: Very light gray/off-white minimalist background.
- Header: Text saying "Class of 10th - Members Directory" with a subtext "Tap on any friend to see their full details and contact them."
- Dynamic Event Banner: A full-width banner at the top with a vibrant orange/purple gradient and a confetti pattern. This banner should dynamically display "Happy Birthday [Name]!" if the current date matches a member's 'dob' (ignoring the year). Include a subtext: "Wishing you loads of joy, health and success from the whole class."
- Dashboard Sections: Below the header, include two small column sections side-by-side: "BIRTHDAYS & GREETINGS" (showing today's birthdays with a tiny avatar) and "UPCOMING EVENTS" (showing a placeholder text like "No upcoming events. Add one in CMS").
- Search Bar: A full-width search input with the placeholder "Search by name, place or occupation...". 
- Member Grid: A responsive CSS grid (1 column on mobile, 4 columns on desktop). Each card in the grid should display:
  - A circular profile picture.
  - Name (bold, dark text).
  - Occupation (gray text, smaller).
  - Residence (gray text, smaller).
- Functionality: 
  - The search bar must filter the grid in real-time based on name, residence, or occupation.
  - Clicking on a member's card should redirect to `member.html?id=[member_id]`.
  - JavaScript should calculate if it is currently someone's birthday based on the mock data and inject the gradient banner automatically.

3. MEMBER DETAIL PAGE (member.html)
Layout & UI Requirements:
- Navigation: A simple "← Back to all members" text link at the top left that goes back to index.html.
- Profile Layout: A two-column layout on desktop (stacking on mobile).
  - Left Column: A large, square profile picture with slightly rounded corners.
  - Right Column: 
    - Heading with the person's Name.
    - Subheading with "[Occupation] at [Organization]".
    - A 2x4 grid displaying their detailed information: Nickname, Date of Birth (calculate and append current age, e.g., "26 Jun 1998 (28 yrs)"), Residence, Occupation, Organization, Phone, Email, Blood Group. Use small caps/gray text for the labels and dark text for the values.
- Action Buttons: Below the details, include three dark, pill-shaped buttons side-by-side:
  - "Call" (href="tel:[phone]")
  - "Email" (href="mailto:[email]")
  - "WhatsApp" (href="https://wa.me/[phone]")
- Functionality:
  - On page load, JavaScript should read the `?id=` parameter from the URL, find the matching user in the mock JSON data, and dynamically populate the DOM elements with their specific details.

Code Requirements:
- Use clean, semantic HTML5.
- Use Tailwind CSS utility classes for all styling. Do not write custom CSS unless absolutely necessary.
- Write modular, well-commented vanilla JavaScript.
- Make sure the UI perfectly matches a clean, modern corporate directory aesthetic with soft shadows and rounded borders.
