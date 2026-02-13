// AUTOMATIC Live Stream for Elim New Jerusalem Church
// Shows embedded video automatically - NO MANUAL UPDATES NEEDED!

const LIVE_STREAMS = {
  mainChannel: {
    name: 'Main Channel',
    // RSS feed method - automatically gets latest live stream
    channelId: 'CHANNEL_ID_HERE', // We'll get this - see instructions below
    channelUrl: 'https://www.youtube.com/@ElimNewJerusalemChurchOfficial',
    livePageUrl: 'https://www.youtube.com/@ElimNewJerusalemChurchOfficial/live',
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
    channelId: 'SHORTS_CHANNEL_ID_HERE',
    channelUrl: 'https://www.youtube.com/@ENJCShorts',
    livePageUrl: 'https://www.youtube.com/@ENJCShorts/live',
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

// Fetch latest live video from channel
async function getLatestLiveVideo(channelId) {
  try {
    // Using YouTube RSS feed (no API key needed!)
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`);
    const text = await response.text();
    
    // Parse RSS XML
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const entries = xml.querySelectorAll('entry');
    
    if (entries.length > 0) {
      const firstVideo = entries[0];
      const videoId = firstVideo.querySelector('yt\\:videoId, videoId')?.textContent;
      return videoId;
    }
  } catch (error) {
    console.log('Could not fetch live video, using fallback');
  }
  return null;
}

// Display live stream
async function displayLiveStream() {
  const activeStream = getActiveLiveStream();
  const container = document.getElementById('live-stream-container');
  const section = document.getElementById('live-stream-section');
  
  if (!container || !section) return;
  
  if (activeStream) {
    section.style.display = 'block';
    
    // Show loading first
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.8);">
        <p>Loading live stream...</p>
      </div>
    `;
    
    // Try to get latest video ID
    let videoId = await getLatestLiveVideo(activeStream.channelId);
    
    // If we can't get video ID, show clickable link to live page
    if (!videoId) {
      container.innerHTML = `
        <div style="max-width: 900px; margin: 0 auto;">
          <div style="background: #ff0000; color: white; padding: 12px 20px; text-align: center; font-weight: bold; margin-bottom: 20px; border-radius: 8px; animation: pulse 2s infinite;">
            🔴 LIVE NOW - ${activeStream.title}
          </div>
          
          <a href="${activeStream.livePageUrl}" target="_blank" style="display: block; text-decoration: none;">
            <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); cursor: pointer; transition: transform 0.3s;">
              <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
                <div style="width: 100px; height: 100px; background: rgba(255,0,0,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; animation: pulse 2s infinite;">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <h3 style="font-size: 1.8rem; margin-bottom: 10px;">🔴 LIVE NOW</h3>
                <p style="font-size: 1.2rem;">Click to Watch</p>
              </div>
            </div>
          </a>
          
          <div style="margin-top: 25px; text-align: center;">
            <p style="color: rgba(255,255,255,0.95); margin-bottom: 20px; font-size: 1.15rem;">${activeStream.description}</p>
            <a href="${activeStream.livePageUrl}" class="btn" style="background: white; color: #667eea; padding: 14px 35px; border-radius: 30px; text-decoration: none; display: inline-block; font-weight: bold;" target="_blank">Watch on YouTube</a>
          </div>
        </div>
      `;
    } else {
      // Embed the video
      container.innerHTML = `
        <div style="max-width: 900px; margin: 0 auto;">
          <div style="background: #ff0000; color: white; padding: 12px 20px; text-align: center; font-weight: bold; margin-bottom: 20px; border-radius: 8px; animation: pulse 2s infinite;">
            🔴 LIVE NOW - ${activeStream.title}
          </div>
          <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            <iframe 
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
              src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
              title="${activeStream.title}"
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>
          <div style="margin-top: 25px; text-align: center;">
            <p style="color: rgba(255,255,255,0.95); margin-bottom: 20px; font-size: 1.15rem;">${activeStream.description}</p>
            <a href="${activeStream.livePageUrl}" class="btn" style="background: white; color: #667eea; padding: 14px 35px; border-radius: 30px; text-decoration: none; display: inline-block; font-weight: bold;" target="_blank">Watch on YouTube</a>
          </div>
        </div>
      `;
    }
  } else {
    section.style.display = 'none';
  }
}

// CSS
const style = document.createElement('style');
style.textContent = `@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }`;
document.head.appendChild(style);

// Init
document.addEventListener('DOMContentLoaded', () => {
  displayLiveStream();
  setInterval(displayLiveStream, 120000); // Check every 2 minutes
  console.log('🔴 Automatic live stream initialized');
});
