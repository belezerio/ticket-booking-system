import axios from 'axios';

const SUPABASE_URL = "https://wioblwqwmlmheuvfrfns.supabase.co/rest/v1";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpb2Jsd3F3bWxtaGV1dmZyZm5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODAzMjIzMSwiZXhwIjoyMDkzNjA4MjMxfQ.mhQTuKYgwbqjpK5dO5LWwjaLgcpRhpMyxru824GrsV4";

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal"
};

const events = [
  {
    title: "Coldplay - Music of the Spheres World Tour",
    description: "Experience the magic of Coldplay live in concert with stunning visuals and their greatest hits.",
    category: "concert",
    venue: "Wembley Stadium, London",
    event_date: "2026-08-15T19:00:00Z",
    total_seats: 50000,
    available_seats: 12000,
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1540039155733-d7696ba6e46d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    is_active: true
  },
  {
    title: "Tomorrowland 2026",
    description: "The world's biggest electronic dance music festival. Join the madness and unite with people from all over the world.",
    category: "concert",
    venue: "Boom, Belgium",
    event_date: "2026-07-17T12:00:00Z",
    total_seats: 100000,
    available_seats: 500,
    price: 35000,
    image_url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    is_active: true
  },
  {
    title: "Interstellar 10th Anniversary Screening",
    description: "Experience Christopher Nolan's epic sci-fi masterpiece in IMAX with a live orchestral accompaniment.",
    category: "movie",
    venue: "BFI IMAX, London",
    event_date: "2026-09-10T19:00:00Z",
    total_seats: 500,
    available_seats: 120,
    price: 2500,
    image_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    is_active: true
  },
  {
    title: "Hamilton - The Musical",
    description: "The multi-award-winning masterpiece by Lin-Manuel Miranda. A hip-hop musical about Alexander Hamilton.",
    category: "other",
    venue: "Richard Rodgers Theatre, NY",
    event_date: "2026-10-05T20:00:00Z",
    total_seats: 1300,
    available_seats: 45,
    price: 25000,
    image_url: "https://images.unsplash.com/photo-1507676184212-d0330a15673c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    is_active: true
  },
  {
    title: "Champions League Final",
    description: "The pinnacle of European club football. Watch two giants battle for the ultimate trophy.",
    category: "sports",
    venue: "Allianz Arena, Munich",
    event_date: "2026-05-30T19:45:00Z",
    total_seats: 75000,
    available_seats: 1500,
    price: 40000,
    image_url: "https://images.unsplash.com/photo-1518605368461-1ee125134707?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    is_active: true
  },
  {
    title: "Wimbledon Finals 2026",
    description: "Experience the prestige and drama of the world's oldest tennis tournament.",
    category: "sports",
    venue: "All England Club, London",
    event_date: "2026-07-12T14:00:00Z",
    total_seats: 15000,
    available_seats: 250,
    price: 45000,
    image_url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    is_active: true
  }
];

const routes = [
  {
    type: "flight",
    operator: "Emirates",
    source: "New York (JFK)",
    destination: "Dubai (DXB)",
    departure_time: "2026-06-01T22:30:00Z",
    arrival_time: "2026-06-02T19:00:00Z",
    total_seats: 350,
    available_seats: 42,
    price: 85000,
    is_active: true
  },
  {
    type: "train",
    operator: "Eurostar",
    source: "London (St Pancras)",
    destination: "Paris (Gare du Nord)",
    departure_time: "2026-06-05T08:30:00Z",
    arrival_time: "2026-06-05T11:47:00Z",
    total_seats: 900,
    available_seats: 120,
    price: 12000,
    is_active: true
  },
  {
    type: "bus",
    operator: "FlixBus",
    source: "Berlin",
    destination: "Prague",
    departure_time: "2026-06-10T10:00:00Z",
    arrival_time: "2026-06-10T14:30:00Z",
    total_seats: 75,
    available_seats: 25,
    price: 2500,
    is_active: true
  },
  {
    type: "flight",
    operator: "Singapore Airlines",
    source: "Singapore (SIN)",
    destination: "Tokyo (NRT)",
    departure_time: "2026-07-15T09:00:00Z",
    arrival_time: "2026-07-15T17:00:00Z",
    total_seats: 280,
    available_seats: 15,
    price: 65000,
    is_active: true
  },
  {
    type: "train",
    operator: "Shinkansen",
    source: "Tokyo",
    destination: "Kyoto",
    departure_time: "2026-07-16T10:00:00Z",
    arrival_time: "2026-07-16T12:15:00Z",
    total_seats: 1200,
    available_seats: 300,
    price: 10000,
    is_active: true
  },
  {
    type: "flight",
    operator: "Qantas",
    source: "Sydney (SYD)",
    destination: "Los Angeles (LAX)",
    departure_time: "2026-08-20T11:00:00Z",
    arrival_time: "2026-08-20T07:30:00Z",
    total_seats: 380,
    available_seats: 50,
    price: 95000,
    is_active: true
  }
];

async function seed() {
  try {
    console.log("Seeding events...");
    const evRes = await axios.post(`${SUPABASE_URL}/events`, events, { headers });
    console.log("Events seeded successfully.");

    console.log("Seeding routes...");
    const routeRes = await axios.post(`${SUPABASE_URL}/routes`, routes, { headers });
    console.log("Routes seeded successfully.");
  } catch (error) {
    console.error("Error seeding data:", error.response ? error.response.data : error.message);
  }
}

seed();
