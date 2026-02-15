// Events Page Main JavaScript
// Handles loading events, recent streams, most watched videos, and next service countdown

// Load all content when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadEvents();
  calculateNextService();
});

// Load events from JSON and display them
async function loadEvents() {
  try {
    const response = await fetch('data/events.json');
    const data = await response.json();
    
    // Load regular events
    loadRegularEvents(data.events);
    
    // Load recent streams (1 shorts + 2 main)
    if (data.recentStreams && data.recentStreams.length > 0) {
      loadRecentStreams(data.recentStreams);
    }
    
    // Load most watched videos
    if (data.mostWatched && data.mostWatched.length > 0) {
      loadMostWatched(data.mostWatched);
    }
    
  } catch (error) {
    console.error('Error loading events:', error);
  }
}

// Load regular events schedule
function loadRegularEvents(events) {
  const container = document.getElementById('events-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  events.forEach(event => {
    const eventCard = createEventCard(event);
    container.appendChild(eventCard);
  });
}

// Create individual event card
function createEventCard(event) {
  const card = document.createElement('div');
  card.className = 'event-card';
  
  let mediaContent = '';
  if (event.type === 'video' && event.videoId) {
    mediaContent = `
      <div class="video-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
        <iframe 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          src="https://www.youtube.com/embed/${event.videoId}" 
          title="${event.title}"
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
    `;
  } else if (event.image) {
    mediaContent = `<img src="${event.image}" alt="${event.title}">`;
  }
  
  const timesHTML = event.times.map(time => `${time}<br>`).join('');
  
  card.innerHTML = `
    ${mediaContent}
    <div class="event-content">
      <h3>${event.title}</h3>
      <p><strong>📅 ${event.schedule}</strong><br>
      ${timesHTML}</p>
      <p>${event.description}</p>
      <a href="${event.youtubeLink || '#'}" class="btn ${event.buttonClass || 'register'}" target="_blank">${event.buttonText || 'Learn More'}</a>
    </div>
  `;
  
  return card;
}

// Load recent streams
function loadRecentStreams(streams) {
  const container = document.getElementById('recent-streams-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  streams.forEach(stream => {
    const streamCard = createVideoCard(stream, 'Watch Replay');
    container.appendChild(streamCard);
  });
}

// Load most watched videos
function loadMostWatched(videos) {
  const container = document.getElementById('most-watched-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  videos.forEach(video => {
    const videoCard = createVideoCard(video, 'Watch Now', true);
    container.appendChild(videoCard);
  });
}

// Create video card (for recent streams and most watched)
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
      ${showViews && video.views ? `<p style="color: #666; font-size: 14px; margin-bottom: 10px;">👁️ ${video.views}</p>` : ''}
      <p>${video.description}</p>
      <a href="${video.youtubeLink}" class="btn call" target="_blank">${buttonText}</a>
    </div>
  `;
  
  return card;
}

// Calculate next service and update countdown
function calculateNextService() {
  const container = document.getElementById('next-service-info');
  if (!container) return;
  
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  let nextService = {
    day: '',
    date: '',
    time: '',
    title: ''
  };
  
  // Sunday services: 5:30am, 8:30am, 12:00am
  // Friday service: 11:00am
  
  if (currentDay === 0) { // Sunday
    if (currentHour < 5 || (currentHour === 5 && currentMinute < 30)) {
      nextService = { day: 'Today', time: '05:30 AM', title: 'Sunday Worship Service' };
    } else if (currentHour < 8 || (currentHour === 8 && currentMinute < 30)) {
      nextService = { day: 'Today', time: '08:30 AM', title: 'Sunday Worship Service' };
    } else if (currentHour < 11 || (currentHour === 11 && currentMinute < 30)) {
      nextService = { day: 'Today', time: '12:00 AM', title: 'Sunday Worship Service' };
    } else {
      nextService = { day: 'Friday', time: '11:00 AM', title: 'Friday Prayer Meeting' };
    }
  } else if (currentDay === 5) { // Friday
    if (currentHour < 11) {
      nextService = { day: 'Today', time: '11:00 AM', title: 'Friday Prayer Meeting' };
    } else {
      nextService = { day: 'Sunday', time: '05:30 AM', title: 'Sunday Worship Service' };
    }
  } else if (currentDay < 5) { // Monday to Thursday
    nextService = { day: 'Friday', time: '11:00 AM', title: 'Friday Prayer Meeting' };
  } else { // Saturday
    nextService = { day: 'Sunday', time: '05:30 AM', title: 'Sunday Worship Service' };
  }
  
  container.innerHTML = `
    <div style="text-align: center; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h3 style="color: #667eea; margin-bottom: 10px;">📅 Next Live Service</h3>
      <p style="font-size: 1.3rem; font-weight: bold; color: #2c3e50; margin-bottom: 5px;">${nextService.title}</p>
      <p style="font-size: 1.1rem; color: #666;">${nextService.day} at ${nextService.time}</p>
    </div>
  `;
}
