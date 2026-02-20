// Events Page JavaScript - Elim New Jerusalem Church
// Loads: Next Service, Recent Streams, Most Watched Videos

document.addEventListener('DOMContentLoaded', () => {
  loadEvents();
  calculateNextService();
});

// Load events from JSON and display them
async function loadEvents() {
  try {
    const response = await fetch('data/events.json');
    const data = await response.json();
    
    // Load recent streams (1 shorts + 2 main)
    if (data.recentStreams && data.recentStreams.length > 0) {
      loadRecentStreams(data.recentStreams);
    }
    
    // Load most watched videos (1 shorts + 2 main)
    if (data.mostWatched && data.mostWatched.length > 0) {
      loadMostWatched(data.mostWatched);
    }
    
  } catch (error) {
    console.error('Error loading events:', error);
  }
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

// Calculate next service and display it
function calculateNextService() {
  const container = document.getElementById('next-service-info');
  if (!container) return;
  
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;
  
  let nextService = {
    day: '',
    time: '',
    title: '',
    description: ''
  };
  
  // Sunday services: 5:30am-7:30am, 8:30am-10:30am, 12:00pm-2:00pm
  // Friday service: 11:00am-2:00pm
  // Daily night: 10:30pm-11:00pm
  
  if (currentDay === 0) { // Sunday
    if (currentTime < 330) { // Before 5:30am
      nextService = { 
        day: 'Today', 
        time: '05:30 AM', 
        title: 'Sunday Worship Service',
        description: 'First service of the day'
      };
    } else if (currentTime >= 330 && currentTime < 510) { // 5:30am-8:30am
      nextService = { 
        day: 'Today', 
        time: '08:30 AM', 
        title: 'Sunday Worship Service',
        description: 'Second service'
      };
    } else if (currentTime >= 510 && currentTime < 720) { // 8:30am-12:00pm
      nextService = { 
        day: 'Today', 
        time: '12:00 PM', 
        title: 'Sunday Worship Service',
        description: 'Afternoon service'
      };
    } else if (currentTime >= 720 && currentTime < 1350) { // After 12pm, before 10:30pm
      nextService = { 
        day: 'Today', 
        time: '10:30 PM', 
        title: 'Daily Night Prayer',
        description: 'End your day with prayer'
      };
    } else {
      nextService = { 
        day: 'Friday', 
        time: '11:00 AM', 
        title: 'Friday Prayer Meeting',
        description: 'Family Blessing Prayer'
      };
    }
  } else if (currentDay === 5) { // Friday
    if (currentTime < 660) { // Before 11:00am
      nextService = { 
        day: 'Today', 
        time: '11:00 AM', 
        title: 'Friday Prayer Meeting',
        description: 'Family Blessing Prayer'
      };
    } else if (currentTime >= 660 && currentTime < 1350) { // After 11am, before 10:30pm
      nextService = { 
        day: 'Today', 
        time: '10:30 PM', 
        title: 'Daily Night Prayer',
        description: 'End your day with prayer'
      };
    } else {
      nextService = { 
        day: 'Sunday', 
        time: '05:30 AM', 
        title: 'Sunday Worship Service',
        description: 'First service of the day'
      };
    }
  } else if (currentTime < 1350) { // Any other day before 10:30pm
    if (currentDay < 5) { // Monday to Thursday
      nextService = { 
        day: 'Friday', 
        time: '11:00 AM', 
        title: 'Friday Prayer Meeting',
        description: 'Family Blessing Prayer'
      };
    } else { // Saturday
      nextService = { 
        day: 'Sunday', 
        time: '05:30 AM', 
        title: 'Sunday Worship Service',
        description: 'First service of the day'
      };
    }
  } else { // After 10:30pm on any day
    nextService = { 
      day: 'Today', 
      time: '10:30 PM', 
      title: 'Daily Night Prayer',
      description: 'End your day with prayer'
    };
  }
  
  container.innerHTML = `
    <div style="text-align: center; padding: 25px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto;">
      <h3 style="color: #667eea; margin-bottom: 15px; font-size: 1.3rem;">📅 Next Live Service</h3>
      <p style="font-size: 1.5rem; font-weight: bold; color: #2c3e50; margin-bottom: 8px;">${nextService.title}</p>
      <p style="font-size: 1.2rem; color: #666; margin-bottom: 8px;">${nextService.day} at ${nextService.time}</p>
      <p style="font-size: 0.95rem; color: #999;">${nextService.description}</p>
    </div>
  `;
}
