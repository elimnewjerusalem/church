// Events Page JavaScript - Elim New Jerusalem Church

document.addEventListener('DOMContentLoaded', () => {
  loadAllContent();
  startCountdownTimer();
  setInterval(updateCountdown, 1000);
});

// ==================== LOAD JSON ====================

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

// ==================== COUNTDOWN ====================

let nextServiceData = null;

function startCountdownTimer() {
  calculateNextService();
  renderCountdownLayout(); // render once
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

    for (const service of services) {

      if (service.day === 'daily' || service.day === checkDay) {

        const serviceDate = new Date(now);
        serviceDate.setDate(serviceDate.getDate() + i);
        serviceDate.setHours(Math.floor(service.time / 60));
        serviceDate.setMinutes(service.time % 60);
        serviceDate.setSeconds(0);

        if (serviceDate > now) {
          nextServiceData = {
            name: service.name,
            time: service.timeStr,
            date: serviceDate,
            image: service.image
          };
          return;
        }
      }
    }
  }
}

function updateCountdown() {

  const container = document.getElementById('next-service-countdown');
  if (!container || !nextServiceData) return;

  const now = new Date();
  const diff = nextServiceData.date - now;

  if (diff <= 0) {
    calculateNextService();
    return;
  }

  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  container.innerHTML = `
    <div style="background:white; padding:40px; border-radius:15px; box-shadow:0 4px 20px rgba(0,0,0,0.1); text-align:center;">

      <img src="${nextServiceData.image}" 
           style="width:100%; max-width:500px; border-radius:12px; margin-bottom:20px;" />

      <h3>${nextServiceData.name}</h3>
      <p style="color:#666;">${nextServiceData.time}</p>

      <div style="display:flex; justify-content:center; gap:20px; margin-top:20px;">
        <div><strong>${String(hours).padStart(2,'0')}</strong><br>Hours</div>
        <div><strong>${String(minutes).padStart(2,'0')}</strong><br>Minutes</div>
        <div><strong>${String(seconds).padStart(2,'0')}</strong><br>Seconds</div>
      </div>

    </div>
  `;
}

// ==================== VIDEO SECTIONS ====================

function createVideoCard(video, buttonText = 'Watch Now', showViews = false) {
  const card = document.createElement('div');
  card.className = 'event-card';
  
  card.innerHTML = `
    <div class="video-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
      <iframe 
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        src="https://www.youtube.com/embed/${video.videoId}" 
        title="${video.title}"
        frameborder="0" 
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
    <div class="event-content">
      <h3>${video.title}</h3>
      ${video.date ? `<p style="color: #999; font-size: 14px; margin-bottom: 10px;">📅 ${video.date}</p>` : ''}
      ${video.verse ? `<p style="color: #667eea; font-size: 14px; margin-bottom: 10px; font-weight: bold;">📖 ${video.verse}</p>` : ''}
      ${showViews && video.views ? `<p style="color: #666; font-size: 14px; margin-bottom: 10px;">👁️ ${video.views}</p>` : ''}
      <p>${video.description}</p>
      <a href="${video.youtubeLink}" class="btn call" target="_blank">${buttonText}</a>
    </div>
  `;
  
  return card;
}

function loadRecentStreams(streams) {
  const container = document.getElementById('recent-streams-container');
  if (!container || !streams) return;
  
  container.innerHTML = '';
  streams.forEach(stream => {
    container.appendChild(createVideoCard(stream, 'Watch Replay'));
  });
}

function loadMostWatched(videos) {
  const container = document.getElementById('most-watched-container');
  if (!container || !videos) return;
  
  container.innerHTML = '';
  videos.forEach(video => {
    container.appendChild(createVideoCard(video, 'Watch Now', true));
  });
}

function loadVerseReels(reels) {
  const container = document.getElementById('verse-reels-container');
  if (!container || !reels) return;
  
  container.innerHTML = '';
  reels.forEach(reel => {
    container.appendChild(createVideoCard(reel, 'Watch Reel'));
  });
}

// ==================== SPECIAL EVENTS ====================

function loadSpecialEvents(events) {
  const container = document.getElementById('special-events-container');
  if (!container || !events) return;
  
  container.innerHTML = '';
  
  events.forEach(event => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${event.icon} ${event.title}</h3>
      <p><strong>${event.schedule}</strong>${event.time ? `<br>${event.time}` : ''}</p>
      <p>${event.description}</p>
    `;
    container.appendChild(card);
  });
}

// ==================== TESTIMONIALS ====================

function loadTestimonials(testimonials) {
  const track = document.getElementById('testimonial-track');
  if (!track || !testimonials) return;
  
  track.innerHTML = '';
  
  testimonials.forEach(testimonial => {
    const slide = document.createElement('div');
    slide.className = 'testimonial-slide';
    slide.style.cssText = 'min-width: 100%; padding: 30px; box-sizing: border-box;';
    slide.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 1.1rem; color: #555; font-style: italic; margin-bottom: 20px; line-height: 1.6;">
          "${testimonial.text}"
        </p>
        <p style="font-weight: bold; color: #2c3e50;">- ${testimonial.author}</p>
      </div>
    `;
    track.appendChild(slide);
  });
}