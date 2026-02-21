// Events Page JavaScript - Elim New Jerusalem Church
// Complete rebuild with countdown timer and all features

document.addEventListener('DOMContentLoaded', () => {
  loadAllContent();
  startCountdownTimer();
  
  // Update countdown every second
  setInterval(updateCountdown, 1000);
});

// Load all content from JSON
async function loadAllContent() {
  try {
    const response = await fetch('data/events.json');
    const data = await response.json();
    
    // Load all sections
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

let countdownInterval;
let nextServiceData = null;

function startCountdownTimer() {
  calculateNextService();
  updateCountdown();
}

function calculateNextService() {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const services = [
    // Sunday services
    { day: 0, time: 330, endTime: 450, name: 'Sunday Worship Service', timeStr: '05:30 AM', image: src="${nextServiceData.image}" },
    { day: 0, time: 510, endTime: 630, name: 'Sunday Worship Service', timeStr: '08:30 AM', image: src="${nextServiceData.image}" },
    { day: 0, time: 720, endTime: 840, name: 'Sunday Worship Service', timeStr: '12:00 PM', image: src="${nextServiceData.image}" },
    // Friday
    { day: 5, time: 660, endTime: 840, name: 'Friday Prayer Meeting', timeStr: '11:00 AM', image:src="${nextServiceData.image}" },
    // Daily night prayer
    { day: 'daily', time: 1350, endTime: 1380, name: 'Daily Night Prayer', timeStr: '10:30 PM', image: src="${nextServiceData.image}" }, 
  ];

  // Find next service
  for (let i = 0; i < 7; i++) {
    const checkDay = (currentDay + i) % 7;
    const checkTime = i === 0 ? currentTime : 0;
    
    for (const service of services) {
      if (service.day === 'daily' || service.day === checkDay) {
        if (i === 0 && checkTime >= service.time && checkTime < service.endTime) {
          continue;
        }
        if (i === 0 && checkTime >= service.time) {
          continue;
        }
        
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
          dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][checkDay]
        };
        return;
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
    // Service starting now - recalculate
    calculateNextService();
    return;
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  container.innerHTML = `
    <div style="background: white; border-radius: 15px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 900px; margin: 0 auto;">
      
      <!-- Service Image -->
      <div style="position: relative; border-radius: 12px; overflow: hidden; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <img 
          src="images/live/${nextServiceData.image}" 
          alt="${nextServiceData.name}" 
          style="width: 100%; height: auto; display: block;"
          onerror="this.onerror=null; this.src='images/live/common.jpg'; console.error('Image not found: ${nextServiceData.image}');"
        >
        <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4)); display: flex; align-items: center; justify-content: center;">
          <div style="text-align: center; color: white;">
            <h3 style="font-size: 2.5rem; margin-bottom: 10px; text-shadow: 0 3px 10px rgba(0,0,0,0.8); font-weight: bold;">⏰ NEXT LIVE SERVICE</h3>
          </div>
        </div>
      </div>
      
      <!-- Service Info -->
      <div style="text-align: center; margin-bottom: 25px;">
        <h3 style="font-size: 1.8rem; color: #2c3e50; margin-bottom: 10px; font-weight: bold;">${nextServiceData.name}</h3>
        <p style="font-size: 1.2rem; color: #666; margin-bottom: 5px;">${nextServiceData.dayName} at ${nextServiceData.time}</p>
      </div>
      
      <!-- Countdown Timer -->
      <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
        ${days > 0 ? `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 30px; border-radius: 12px; min-width: 100px; text-align: center;">
          <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 5px;">${days}</div>
          <div style="font-size: 0.9rem; opacity: 0.9;">Day${days !== 1 ? 's' : ''}</div>
        </div>
        ` : ''}
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 30px; border-radius: 12px; min-width: 100px; text-align: center;">
          <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 5px;">${String(hours).padStart(2, '0')}</div>
          <div style="font-size: 0.9rem; opacity: 0.9;">Hours</div>
        </div>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 30px; border-radius: 12px; min-width: 100px; text-align: center;">
          <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 5px;">${String(minutes).padStart(2, '0')}</div>
          <div style="font-size: 0.9rem; opacity: 0.9;">Minutes</div>
        </div>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 30px; border-radius: 12px; min-width: 100px; text-align: center;">
          <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 5px;">${String(seconds).padStart(2, '0')}</div>
          <div style="font-size: 0.9rem; opacity: 0.9;">Seconds</div>
        </div>
      </div>
      
      <!-- Set Reminder Button -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://wa.me/919444345102?text=Please remind me about ${encodeURIComponent(nextServiceData.name)}" class="btn register" target="_blank">Set Reminder</a>
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
