// Events Page JavaScript - Elim New Jerusalem Church
// Optimized Version (No Continuous Re-rendering)

document.addEventListener('DOMContentLoaded', () => {
  loadAllContent();
  startCountdownTimer();

  // Update only numbers every second
  setInterval(updateCountdown, 1000);
});

// ==================== LOAD CONTENT ====================

async function loadAllContent() {
  try {
    const response = await fetch('data/events.json');
    const data = await response.json();

    loadRecentStreams(data.recentStreams);
    loadMostWatched(data.mostWatched);
    loadVerseReels(data.verseReels);
    loadSpecialEvents(data.specialEvents);
    loadTestimonials(data.testimonials);

  } catch (error) {
    console.error('Error loading events:', error);
  }
}

// ==================== COUNTDOWN TIMER ====================

let nextServiceData = null;

function startCountdownTimer() {
  calculateNextService();
  renderCountdownLayout();   // Render once
  updateCountdown();
}

function calculateNextService() {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const services = [
    { day: 0, time: 330, name: 'Sunday Worship Service', timeStr: '05:30 AM', image: 'images/Live/sunday-worship.jpg'},
    { day: 0, time: 510, name: 'Sunday Worship Service', timeStr: '08:30 AM', image: 'images/Live/sunday-worship.jpg'},
    { day: 0, time: 720, name: 'Sunday Worship Service', timeStr: '12:00 PM', image: 'images/Live/sunday-worship.jpg'},
    { day: 5, time: 660, name: 'Friday Prayer Meeting', timeStr: '11:00 AM', image: 'images/Live/friday-prayer.jpg'},
    { day: 'daily', time: 1350, name: 'Daily Night Prayer', timeStr: '10:30 PM', image: 'images/Live/night-prayer.jpg'}
  ];

  for (let i = 0; i < 7; i++) {
    const checkDay = (currentDay + i) % 7;
    const checkTime = i === 0 ? currentTime : 0;

    for (const service of services) {

      if (service.day !== 'daily' && service.day !== checkDay) continue;
      if (i === 0 && checkTime >= service.time) continue;

      const serviceDate = new Date(now);
      serviceDate.setDate(serviceDate.getDate() + i);
      serviceDate.setHours(Math.floor(service.time / 60));
      serviceDate.setMinutes(service.time % 60);
      serviceDate.setSeconds(0);

      nextServiceData = {
        name: service.name,
        time: service.timeStr,
        date: serviceDate,
        image: service.image,
        dayName: i === 0 ? 'Today' :
                 i === 1 ? 'Tomorrow' :
                 ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][checkDay]
      };

      return;
    }
  }
}

// Render layout once
function renderCountdownLayout() {
  const container = document.getElementById('next-service-countdown');
  if (!container || !nextServiceData) return;

  container.innerHTML = `
    <div style="background:white;border-radius:15px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,0.1);max-width:900px;margin:0 auto;">

      <div style="position:relative;border-radius:12px;overflow:hidden;margin-bottom:30px;">
        <img 
          src="${nextServiceData.image}" 
          alt="${nextServiceData.name}" 
          style="width:100%;display:block;"
          onerror="this.src='images/Live/common.jpg';"
        >
      </div>

      <div style="text-align:center;margin-bottom:25px;">
        <h3 style="font-size:1.8rem;font-weight:bold;">${nextServiceData.name}</h3>
        <p style="color:#666;">${nextServiceData.dayName} at ${nextServiceData.time}</p>
      </div>

      <div style="display:flex;justify-content:center;gap:20px;">
        <div style="text-align:center;">
          <div id="cd-hours" style="font-size:2rem;font-weight:bold;">00</div>
          <div>Hours</div>
        </div>
        <div style="text-align:center;">
          <div id="cd-minutes" style="font-size:2rem;font-weight:bold;">00</div>
          <div>Minutes</div>
        </div>
        <div style="text-align:center;">
          <div id="cd-seconds" style="font-size:2rem;font-weight:bold;">00</div>
          <div>Seconds</div>
        </div>
      </div>

      <div style="text-align:center;margin-top:30px;">
        <a href="https://wa.me/919444345102?text=Please remind me about ${encodeURIComponent(nextServiceData.name)}"
           target="_blank"
           style="padding:10px 20px;background:#667eea;color:white;border-radius:8px;text-decoration:none;">
           Set Reminder
        </a>
      </div>

    </div>
  `;
}

// Update only numbers
function updateCountdown() {
  if (!nextServiceData) return;

  const now = new Date();
  const diff = nextServiceData.date - now;

  if (diff <= 0) {
    calculateNextService();
    renderCountdownLayout();
    return;
  }

  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((diff % (1000*60)) / 1000);

  document.getElementById("cd-hours").textContent =
    String(hours).padStart(2, '0');

  document.getElementById("cd-minutes").textContent =
    String(minutes).padStart(2, '0');

  document.getElementById("cd-seconds").textContent =
    String(seconds).padStart(2, '0');
}

// ==================== VIDEO + OTHER SECTIONS ====================
// (Your existing functions can remain same below)

function createVideoCard(video, buttonText = 'Watch Now', showViews = false) {
  const card = document.createElement('div');
  card.className = 'event-card';

  card.innerHTML = `
    <div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;">
      <iframe 
        style="position:absolute;top:0;left:0;width:100%;height:100%;"
        src="https://www.youtube.com/embed/${video.videoId}"
        allowfullscreen>
      </iframe>
    </div>
    <div class="event-content">
      <h3>${video.title}</h3>
      ${video.date ? `<p>📅 ${video.date}</p>` : ''}
      ${video.verse ? `<p>📖 ${video.verse}</p>` : ''}
      ${showViews && video.views ? `<p>👁️ ${video.views}</p>` : ''}
      <p>${video.description}</p>
      <a href="${video.youtubeLink}" target="_blank">${buttonText}</a>
    </div>
  `;

  return card;
}