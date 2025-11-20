// Google Calendar Integration
const CALENDAR_CONFIG = {
  calendarId: 'paul.chukwu.official@gmail.com',
  apiKey: 'AIzaSyBenS_qNqKUvAbSYpTji8YkjK9JZQxgc8I'
};

let allEvents = [];

// Initialize Google Calendar API
function initGoogleCalendar() {
  gapi.load('client', () => {
    gapi.client.init({
      apiKey: CALENDAR_CONFIG.apiKey,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    }).then(() => {
      loadGoogleCalendarEvents();
    }).catch(error => {
      console.error('Error initializing Google Calendar:', error);
      loadFallbackEvents();
    });
  });
}

// Load events from Google Calendar
function loadGoogleCalendarEvents() {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
  const sixMonthsLater = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());

  gapi.client.calendar.events.list({
    calendarId: CALENDAR_CONFIG.calendarId,
    timeMin: sixMonthsAgo.toISOString(),
    timeMax: sixMonthsLater.toISOString(),
    showDeleted: false,
    singleEvents: true,
    orderBy: 'startTime'
  }).then(response => {
    const events = response.result.items || [];
    allEvents = events.map(event => {
      const startDate = event.start.dateTime || event.start.date;
      return {
        date: startDate.split('T')[0],
        title: event.summary || 'Event',
        where: event.location || 'TBD',
        note: event.description || ''
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
    
    renderEvents('all');
  }).catch(error => {
    console.error('Error loading calendar events:', error);
    loadFallbackEvents();
  });
}

// Fallback to hardcoded events if API fails
function loadFallbackEvents() {
  allEvents = [
    {date:"2025-11-10", title:"Leonard Community Meeting", where:"Residence Hall", note:"Motivation wall build"},
    {date:"2025-11-12", title:"Meet & Munch", where:"Leonard Hall", note:"Upper‑year panel for first‑years"},
    {date:"2025-11-17", title:"Movie Night", where:"Leonard Hall", note:"Rescheduled"},
    {date:"2025-10-29", title:"TA Application — CEG3156", where:"uOttawa", note:"Cover letter submitted"},
    {date:"2025-09-26", title:"CEG 3155 Lab", where:"Campus Lab", note:"Atomic modules — structural VHDL"}
  ];
  renderEvents('all');
}

// Render events based on filter
function renderEvents(mode = 'all') {
  const tl = document.getElementById('timeline');
  if (!tl) return;
  
  tl.innerHTML = '';
  const today = new Date().toISOString().slice(0, 10);
  
  let filtered = allEvents;
  if (mode === 'upcoming') {
    filtered = allEvents.filter(ev => ev.date >= today);
  } else if (mode === 'past') {
    filtered = allEvents.filter(ev => ev.date < today);
  }

  if (filtered.length === 0) {
    tl.innerHTML = '<div class="muted" style="text-align: center; padding: 20px;">No events found</div>';
    return;
  }

  for (const ev of filtered) {
    const el = document.createElement('div');
    el.className = 'event';
    el.innerHTML = `
      <div class="when">${ev.date} • ${ev.where}</div>
      <div style="font-weight:700">${ev.title}</div>
      <div class="muted">${ev.note || ''}</div>
    `;
    tl.appendChild(el);
  }
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
  const showAll = document.getElementById('showAll');
  const showUpcoming = document.getElementById('showUpcoming');
  const showPast = document.getElementById('showPast');

  if (showAll) showAll.addEventListener('click', () => renderEvents('all'));
  if (showUpcoming) showUpcoming.addEventListener('click', () => renderEvents('upcoming'));
  if (showPast) showPast.addEventListener('click', () => renderEvents('past'));

  // Initialize Google Calendar
  initGoogleCalendar();
});
