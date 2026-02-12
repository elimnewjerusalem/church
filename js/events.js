// Load events from JSON and display them
async function loadEvents() {
  try {
    const response = await fetch('data/events.json');
    const data = await response.json();
    const container = document.getElementById('events-container');
    
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create event cards
    data.events.forEach(event => {
      const eventCard = createEventCard(event);
      container.appendChild(eventCard);
    });
    
    // Load recent streams if available
    if (data.recentStreams && data.recentStreams.length > 0) {
      loadRecentStreams(data.recentStreams);
    }
    
  } catch (error) {
    console.error('Error loading events:', error);
    const container = document.getElementById('events-container');
    if (container) {
      container.innerHTML = '<p style="color: #999;">Unable to load events. Please refresh the page.</p>';
    }
  }
}

// Create individual event card
function createEventCard(event) {
  const card = document.createElement('div');
  card.className = 'event-card';
  
  // Create video wrapper or image
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
  
  // Format schedule times
  const timesHTML = event.times.map(time => `${time}<br>`).join('');
  
  // Create card content
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
  
  // Clear existing content
  container.innerHTML = '';
  
  // Create stream cards
  streams.forEach(stream => {
    const streamCard = createRecentStreamCard(stream);
    container.appendChild(streamCard);
  });
}

// Create recent stream card
function createRecentStreamCard(stream) {
  const card = document.createElement('div');
  card.className = 'event-card';
  
  card.innerHTML = `
    <div class="video-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
      <iframe 
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        src="https://www.youtube.com/embed/${stream.videoId}" 
        title="${stream.title}"
        frameborder="0" 
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
    <div class="event-content">
      <h3>${stream.title}</h3>
      <p style="color: #999; font-size: 14px; margin-bottom: 10px;">📅 ${stream.date}</p>
      <p>${stream.description}</p>
      <a href="${stream.youtubeLink}" class="btn call" target="_blank">Watch Replay</a>
    </div>
  `;
  
  return card;
}

// Load events when page loads
document.addEventListener('DOMContentLoaded', loadEvents);
