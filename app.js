// Shared data loading, rendering, and page controllers for the directory.
const hasRemoteDataSource = () => GOOGLE_SHEET_CSV_URL.startsWith("http");

const normalizeHeader = (header) => header.toLowerCase().replace(/[^a-z0-9]/g, "");

// Handles commas, quoted values, escaped quotes, and line breaks inside CSV fields.
const parseCSV = (csv) => {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    const nextCharacter = csv[index + 1];
    if (character === '"' && insideQuotes && nextCharacter === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      insideQuotes = !insideQuotes;
    } else if (character === "," && !insideQuotes) {
      row.push(value.trim());
      value = "";
    } else if ((character === "\n" || character === "\r") && !insideQuotes) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      row.push(value.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  if (value || row.length) {
    row.push(value.trim());
    if (row.some(Boolean)) rows.push(row);
  }

  return rows;
};

const getColumn = (row, aliases) => {
  const aliasSet = aliases.map(normalizeHeader);
  const entry = Object.entries(row).find(([header]) => aliasSet.includes(normalizeHeader(header)));
  return entry?.[1] || "";
};

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const normalizeDate = (value) => {
  const trimmedValue = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) return trimmedValue;
  const match = trimmedValue.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (!match) return trimmedValue;
  const [, first, second, year] = match;
  const month = Number(first) > 12 ? second : first;
  const day = Number(first) > 12 ? first : second;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const normalizePhotoUrl = (value) => {
  const photoUrl = value.trim();
  if (!photoUrl) return "https://i.pravatar.cc/600?img=12";
  const driveFileMatch = photoUrl.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  const driveQueryMatch = photoUrl.match(/[?&]id=([^&]+)/);
  const fileId = driveFileMatch?.[1] || driveQueryMatch?.[1];
  return fileId ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w1000` : photoUrl;
};

const mapSheetRow = (row, index) => {
  const name = getColumn(row, ["name", "full name", "fullname"]) || "Unnamed member";
  return {
    id: getColumn(row, ["id", "member id"]) || `${slugify(name) || "member"}-${index + 1}`,
    name,
    nickname: getColumn(row, ["nickname", "nick name"]),
    dob: normalizeDate(getColumn(row, ["dob", "date of birth", "birthday"])),
    residence: getColumn(row, ["residence", "place", "location", "city"]),
    occupation: getColumn(row, ["working as", "occupation", "role", "job"]),
    organization: getColumn(row, ["organization", "organisation", "company"]),
    phone: getColumn(row, ["contact no", "phone", "phone number", "mobile", "contact"]),
    email: getColumn(row, ["email", "email address"]),
    bloodGroup: getColumn(row, ["blood group", "bloodgroup", "blood type"]),
    profilePic: normalizePhotoUrl(getColumn(row, ["photo", "profile pic", "profilepic", "profile picture", "image"]))
  };
};

const loadMembers = async () => {
  if (!hasRemoteDataSource()) return members;
  const response = await fetch(GOOGLE_SHEET_CSV_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`Google Sheet request failed: ${response.status}`);
  const csv = await response.text();
  if (!response.headers.get("content-type")?.includes("csv") || /<html[\s>]/i.test(csv.slice(0, 1000))) {
    throw new Error("The Google Sheet URL did not return CSV data. Use the published /pub?output=csv URL.");
  }
  const rows = parseCSV(csv);
  if (rows.length < 2) throw new Error("The published Google Sheet has no member rows.");
  const headers = rows[0];
  const loadedMembers = rows.slice(1).map((values, index) => mapSheetRow(
    Object.fromEntries(headers.map((header, columnIndex) => [header, values[columnIndex] || ""])),
    index
  )).filter((member) => member.name !== "Unnamed member");
  if (!loadedMembers.length) throw new Error("No usable member names were found in the Google Sheet.");
  members = loadedMembers;
  return members;
};

const getTodayBirthdays = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return members.filter((member) => /^\d{4}-\d{2}-\d{2}$/.test(member.dob) && member.dob.slice(5) === `${month}-${day}`);
};

const formatDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(date.getTime()) ? dateString || "Not provided" : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const calculateAge = (dateString) => {
  const birthDate = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return "";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age -= 1;
  return `${age} yrs`;
};

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  element.className = className;
  if (text) element.textContent = text;
  return element;
};

const createBirthdayItem = (member) => {
  const wrapper = createElement("div", "flex items-center gap-3");
  const image = createElement("img", "h-9 w-9 rounded-full object-cover");
  image.src = normalizePhotoUrl(member.profilePic);
  image.alt = member.name;
  const copy = createElement("div", "min-w-0");
  copy.append(createElement("p", "truncate text-sm font-semibold text-slate-900", member.name), createElement("p", "text-xs text-slate-500", "Send a warm birthday wish"));
  wrapper.append(image, copy);
  return wrapper;
};

const renderBirthdayBanner = () => {
  const banner = document.querySelector("[data-birthday-banner]");
  if (!banner) return;
  const birthdays = getTodayBirthdays();
  banner.querySelector("[data-banner-title]").textContent = birthdays.length ? `Happy Birthday ${birthdays.map((member) => member.name).join(" & ")}!` : "Class connections, made simple.";
  banner.querySelector("[data-banner-copy]").textContent = birthdays.length ? "Wishing you loads of joy, health and success from the whole class." : "Find a friend, catch up, and keep our class circle close.";
};

const renderBirthdayPanel = () => {
  const panel = document.querySelector("[data-birthday-list]");
  if (!panel) return;
  panel.replaceChildren();
  const birthdays = getTodayBirthdays();
  if (birthdays.length) birthdays.forEach((member) => panel.append(createBirthdayItem(member)));
  else panel.append(createElement("p", "text-sm text-slate-500", "No birthdays today. Check back tomorrow."));
};

const createMemberCard = (member) => {
  const link = createElement("a", "group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg");
  link.href = `member.html?id=${encodeURIComponent(member.id)}`;
  const image = createElement("img", "mb-4 aspect-square w-full rounded-xl object-cover");
  image.src = normalizePhotoUrl(member.profilePic);
  image.alt = `Portrait of ${member.name}`;
  link.append(image, createElement("p", "text-lg font-bold tracking-tight text-slate-900 group-hover:text-orange-600", member.name), createElement("p", "mt-1 text-sm font-medium text-slate-500", member.occupation), createElement("p", "mt-3 text-xs text-slate-400", member.residence));
  return link;
};

const renderDirectory = () => {
  const grid = document.querySelector("[data-member-grid]");
  const search = document.querySelector("[data-search]");
  if (!grid || !search) return;
  const updateGrid = () => {
    const query = search.value.trim().toLowerCase();
    const filteredMembers = members.filter((member) => [member.name, member.residence, member.occupation].some((value) => value.toLowerCase().includes(query)));
    grid.replaceChildren();
    if (filteredMembers.length) filteredMembers.forEach((member) => grid.append(createMemberCard(member)));
    else grid.append(createElement("div", "col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500", "No members match your search."));
  };
  if (!search.dataset.bound) {
    search.addEventListener("input", updateGrid);
    search.dataset.bound = "true";
  }
  updateGrid();
};

const renderMemberDetails = () => {
  const id = new URLSearchParams(window.location.search).get("id");
  const member = members.find((item) => item.id === id);
  const emptyState = document.querySelector("[data-empty-member]");
  const profile = document.querySelector("[data-member-profile]");
  if (!profile || !emptyState) return;
  if (!member) {
    profile.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }
  const setText = (selector, value) => { profile.querySelector(selector).textContent = value || "Not provided"; };
  setText("[data-member-name]", member.name);
  setText("[data-member-subtitle]", `${member.occupation || "Classmate"}${member.organization ? ` at ${member.organization}` : ""}`);
  setText("[data-member-dob]", `${formatDate(member.dob)}${calculateAge(member.dob) ? ` (${calculateAge(member.dob)})` : ""}`);
  setText("[data-member-residence]", member.residence);
  setText("[data-member-occupation]", member.occupation);
  setText("[data-member-phone]", member.phone);
  const image = profile.querySelector("[data-member-image]");
  image.src = normalizePhotoUrl(member.profilePic);
  image.alt = `Portrait of ${member.name}`;
  profile.querySelector("[data-call-link]").href = member.phone ? `tel:${member.phone}` : "#";
  profile.querySelector("[data-whatsapp-link]").href = member.phone ? `https://wa.me/${member.phone.replace(/\D/g, "")}` : "#";
};

const renderApp = () => {
  renderBirthdayBanner();
  renderBirthdayPanel();
  renderDirectory();
  renderMemberDetails();
};

loadMembers().then(renderApp).catch((error) => {
  console.error(error);
  renderApp();
});

if (hasRemoteDataSource()) setInterval(() => loadMembers().then(renderApp).catch((error) => console.error(error)), 60000);