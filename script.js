// Starter Community Aid Listings (Stored in Browser LocalStorage so new donations persist)
const defaultListings = [
  {
    id: 1,
    category: "Housing",
    title: "Safe Night Shelter & 6 Clean Bunk Beds",
    location: "Egbeda, Alimosho, Lagos",
    desc: "Clean, secure temporary shelter space with fresh bedding, shower access, and morning tea. Open for individuals and mothers with children.",
    contact: "+234 800 555 0101 (Hope Haven Outreach)",
    claimed: false
  },
  {
    id: 2,
    category: "Food",
    title: "50 Hot Plates of Jollof Rice, Beans & Bottled Water",
    location: "Ikeja Underbridge Community Kitchen, Lagos",
    desc: "Freshly cooked daily lunch distribution from 12:30 PM to 3:00 PM. Walk-ins welcome, zero cost.",
    contact: "+234 800 555 0102 (Feed Lagos Initiative)",
    claimed: false
  },
  {
    id: 3,
    category: "Clothes",
    title: "Clean Adult & Children Clothing Bundles + Sneakers",
    location: "Yaba Bus Terminal Outreach Point, Lagos",
    desc: "Washed and neatly sorted shirts, trousers, wrappers, children's wear, and durable footwear in all sizes.",
    contact: "+234 800 555 0103 (Clothe With Love)",
    claimed: false
  },
  {
    id: 4,
    category: "Housing",
    title: "30-Day Transitional Room for Displaced Family",
    location: "Surulere, Lagos",
    desc: "Private furnished room with running water and electricity provided free for a family transitioning back onto their feet.",
    contact: "+234 800 555 0104 (SafeStart Housing)",
    claimed: false
  },
  {
    id: 5,
    category: "Food",
    title: "Dry Food Pantry Packs (Rice, Garri, Beans & Oil)",
    location: "Iyana Ipaja, Alimosho, Lagos",
    desc: "Weekly take-home grocery packs for vulnerable individuals and families. Available every Saturday morning.",
    contact: "+234 800 555 0105 (Alimosho Food Bank)",
    claimed: false
  },
  {
    id: 6,
    category: "Clothes",
    title: "Blankets, Raincoats & Warm Sweaters Pack",
    location: "Oshodi Community Center, Lagos",
    desc: "Weather protection essentials including thick blankets, waterproof jackets, and socks for street outreach.",
    contact: "+234 800 555 0106 (Warmth Project)",
    claimed: false
  }
];

let listings = JSON.parse(localStorage.getItem("havenShareListings")) || defaultListings;
let activeCategory = "All";
let selectedItemId = null;

function saveListings() {
  localStorage.setItem("havenShareListings", JSON.stringify(listings));
}

function getCategoryIcon(category) {
  if (category === "Housing") return "🏠";
  if (category === "Food") return "🍲";
  return "👕";
}

function updateCounters() {
  const available = listings.filter(item => !item.claimed);
  document.getElementById("count-total").innerText = available.length;
  document.getElementById("count-houses").innerText = available.filter(i => i.category === "Housing").length;
  document.getElementById("count-food").innerText = available.filter(i => i.category === "Food").length;
  document.getElementById("count-clothes").innerText = available.filter(i => i.category === "Clothes").length;
}

function filterCategory(category, btn) {
  activeCategory = category;
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderListings();
}

function renderListings() {
  const grid = document.getElementById("aid-grid");
  const query = document.getElementById("search-input").value.toLowerCase().trim();
  grid.innerHTML = "";

  const filtered = listings.filter(item => {
    const matchesCat = activeCategory === "All" || item.category === activeCategory;
    const matchesText =
      item.title.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query);
    return matchesCat && matchesText;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 2rem;">No matching free aid listings found. Try clearing your search or add a new donation below!</p>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "aid-card";
    card.innerHTML = `
      <div>
        <div class="card-banner banner-${item.category}">
          ${getCategoryIcon(item.category)}
        </div>
        <div class="card-body">
          <div class="card-top">
            <span class="card-tag">${item.category}</span>
            <span class="free-price">FREE • ₦0</span>
          </div>
          <h3>${item.title}</h3>
          <p class="card-loc">📍 ${item.location}</p>
          <p class="card-desc">${item.desc}</p>
        </div>
      </div>
      <div class="card-footer">
        ${
          item.claimed
            ? `<button class="btn-claimed" disabled>✓ Claimed / Reserved</button>`
            : `<button class="btn-claim" onclick="openModal(${item.id})">Request / View Pickup Info</button>`
        }
      </div>
    `;
    grid.appendChild(card);
  });

  updateCounters();
}

function addDonation(event) {
  event.preventDefault();
  const newItem = {
    id: Date.now(),
    category: document.getElementById("item-category").value,
    title: document.getElementById("item-title").value.trim(),
    location: document.getElementById("item-location").value.trim(),
    desc: document.getElementById("item-desc").value.trim(),
    contact: document.getElementById("item-contact").value.trim(),
    claimed: false
  };

  listings.unshift(newItem);
  saveListings();
  renderListings();
  document.getElementById("donation-form").reset();
  alert("Thank you! Your free aid listing is now live on HavenShare.");
  document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
}

function openModal(id) {
  const item = listings.find(i => i.id === id);
  if (!item) return;

  selectedItemId = id;
  document.getElementById("modal-badge").innerText = item.category;
  document.getElementById("modal-title").innerText = item.title;
  document.getElementById("modal-location").innerText = "📍 " + item.location;
  document.getElementById("modal-desc").innerText = item.desc;
  document.getElementById("modal-contact").innerText = item.contact;
  document.getElementById("claim-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("claim-modal").classList.add("hidden");
  selectedItemId = null;
}

function confirmClaim() {
  if (!selectedItemId) return;
  listings = listings.map(item =>
    item.id === selectedItemId ? { ...item, claimed: true } : item
  );
  saveListings();
  renderListings();
  closeModal();
}

// Initialize Page
window.addEventListener("DOMContentLoaded", renderListings);
