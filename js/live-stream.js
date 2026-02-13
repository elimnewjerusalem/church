// Live Stream with Image/Thumbnail for Elim New Jerusalem Church
// Shows image with "LIVE NOW" button - fully automatic

const LIVE_STREAMS = {
  mainChannel: {
    name: 'Main Channel',
    channelUrl: 'https://www.youtube.com/@ElimNewJerusalemChurchOfficial',
    liveUrl: 'https://www.youtube.com/@ElimNewJerusalemChurchOfficial/live',
    // Add your church image/thumbnail here
    image: 'images/live-worship.jpg', // Change this to your image path
    days: [0, 5], // Sunday & Friday
    times: [
      { start: '05:30', end: '07:30' },
      { start: '08:30', end: '10:30' },
      { start: '11:00', end: '13:30' },
      { start: '11:30', end: '13:30' }
    ],
    title: 'Live Worship Service',
    description: 'Join us for live worship, prayer, and powerful messages'
  },
  
  shortsChannel: {
    name: 'Shorts Channel',
    channelUrl: 'https://www.youtube.com/@ENJCShorts',
    liveUrl: 'https://www.youtube.com/@ENJCShorts/live',
    // Add your shorts channel image here
    image: 'images/daily-devotional.jpg', // Change this to your image path
    days: [0, 1, 2, 3, 4, 5, 6], // Every day
    times: [{ start: '00:00', end: '23:59' }],
    title: 'Daily Devotional Live',
    description: 'Quick devotionals and faith encouragement throughout the day'
  }
};

// Check if within scheduled time
function isLiveTime(schedule) {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  if (!schedule.days.includes(currentDay)) return false;
  
  return schedule.times.some(slot => {
    const [startH, startM] = slot.start.split(':').map(Number);
    const [endH, endM] = slot.end.split(':').map(Number);
    return currentTime >= (startH * 60 + startM) && currentTime <= (endH * 60 + endM);
  });
}

// Get active stream
function getActiveLiveStream() {
  if (isLiveTime(LIVE_STREAMS.mainChannel)) return LIVE_STREAMS.mainChannel;
  if (isLiveTime(LIVE_STREAMS.shortsChannel)) return LIVE_STREAMS.shortsChannel;
  return null;
}

// Display live stream with image
function displayLiveStream() {
  const activeStream = getActiveLiveStream();
  const container = document.getElementById('live-stream-container');
  const section = document.getElementById('live-stream-section');
  
  if (!container || !section) return;
  
  if (activeStream) {
    section.style.display = 'block';
    
    container.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto;">
        
        <!-- Live Indicator -->
        <div style="background: #ff0000; color: white; padding: 12px 20px; text-align: center; font-weight: bold; margin-bottom: 20px; border-radius: 8px; animation: pulse 2s infinite;">
          🔴 LIVE NOW - ${activeStream.title}
        </div>
        
        <!-- Image/Thumbnail with Play Overlay -->
        <a href="${activeStream.liveUrl}" target="_blank" style="display: block; text-decoration: none; position: relative;">
          <div style="position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3); transition: transform 0.3s;">
            
            <!-- Church Image -->
            <img src="${activeStream.image}" alt="${activeStream.title}" style="width: 100%; height: auto; display: block; min-height: 400px; object-fit: cover;">
            
            <!-- Dark Overlay -->
            <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6));">
            </div>
            
            <!-- Play Button Overlay -->
            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
              
              <!-- Pulsing Play Button -->
              <div style="width: 120px; height: 120px; background: rgba(255,0,0,0.95); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 25px; animation: pulse 2s infinite; box-shadow: 0 8px 30px rgba(255,0,0,0.4);">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              
              <!-- Text -->
              <h3 style="font-size: 2rem; margin-bottom: 10px; text-shadow: 0 3px 8px rgba(0,0,0,0.5); font-weight: bold;">🔴 LIVE NOW</h3>
              <p style="font-size: 1.3rem; text-shadow: 0 2px 6px rgba(0,0,0,0.5);">Click to Join the Service</p>
            </div>
            
          </div>
        </a>
        
        <!-- Description & Button -->
        <div style="margin-top: 25px; text-align: center;">
          <p style="color: rgba(255,255,255,0.95); margin-bottom: 20px; font-size: 1.15rem; line-height: 1.6;">${activeStream.description}</p>
          <a href="${activeStream.liveUrl}" class="btn" style="background: white; color: #667eea; padding: 14px 35px; border-radius: 30px; text-decoration: none; display: inline-block; font-weight: bold; font-size: 1.05rem; box-shadow: 0 4px 15px rgba(0,0,0,0.2);" target="_blank">Watch on YouTube</a>
        </div>
        
      </div>
    `;
  } else {
    section.style.display = 'none';
  }
}

// CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.85; transform: scale(1.05); }
  }
  
  a:hover > div {
    transform: scale(1.02);
  }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  displayLiveStream();
  setInterval(displayLiveStream, 60000); // Check every minute
  
  console.log('🔴 Live stream with image initialized');
  console.log('⏰ Current time:', new Date().toLocaleTimeString());
  console.log('📅 Current day:', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]);
});
