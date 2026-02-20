// Live Stream with 4 Different Images Based on Schedule
// Elim New Jerusalem Church

const LIVE_STREAMS = {
  // MAIN CHANNEL - Friday & Sunday
  mainChannel: {
    name: 'Main Channel',
    channelUrl: 'https://www.youtube.com/@ElimNewJerusalemChurchOfficial',
    liveUrl: 'https://www.youtube.com/@ElimNewJerusalemChurchOfficial/live',
    
    // Different images for different days
    images: {
      friday: 'images/live/friday-prayer.jpg',      // Friday 10am-2pm
      sunday: 'images/live/sunday-worship.jpg',     // Sunday 4am-10pm
    },
    
    // Schedule
    schedule: [
      {
        day: 5, // Friday
        startTime: '10:00',
        endTime: '14:00',
        imageKey: 'friday',
        title: 'Friday Prayer Meeting - Live Now',
        description: 'Join us for powerful prayer and worship'
      },
      {
        day: 0, // Sunday
        startTime: '04:00',
        endTime: '22:00',
        imageKey: 'sunday',
        title: 'Sunday Worship Service - Live Now',
        description: 'Join us for inspiring worship, messages, and fellowship'
      }
    ]
  },
  
  // SHORTS CHANNEL - Daily Night Prayer
  shortsChannel: {
    name: 'Shorts Channel',
    channelUrl: 'https://www.youtube.com/@ENJCShorts',
    liveUrl: 'https://www.youtube.com/@ENJCShorts/live',
    
    image: 'images/live/night-prayer.jpg',  // Daily Night Prayer 10pm-11pm
    
    // Schedule - Daily Night Prayer
    schedule: [
      {
        day: 'all', // Every day
        startTime: '22:00',
        endTime: '23:00',
        title: 'Daily Night Prayer - Live Now',
        description: 'End your day with prayer and devotion'
      }
    ]
  },
  
  // COMMON IMAGE - When offline
  commonImage: {
    image: 'images/live/common.jpg',  // Shows when not live
    title: 'Join Us for Live Services',
    description: 'We go live for worship, prayer, and devotionals'
  }
};

// Check if current time matches schedule
function isLiveTime(schedule) {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;
  
  for (const slot of schedule) {
    // Check day
    if (slot.day !== 'all' && slot.day !== currentDay) continue;
    
    // Check time
    const [startH, startM] = slot.startTime.split(':').map(Number);
    const [endH, endM] = slot.endTime.split(':').map(Number);
    const startTime = startH * 60 + startM;
    const endTime = endH * 60 + endM;
    
    if (currentTime >= startTime && currentTime <= endTime) {
      return slot;
    }
  }
  
  return null;
}

// Get active live stream
function getActiveLiveStream() {
  // Priority 1: Check Main Channel (Friday & Sunday)
  const mainSlot = isLiveTime(LIVE_STREAMS.mainChannel.schedule);
  if (mainSlot) {
    return {
      stream: LIVE_STREAMS.mainChannel,
      slot: mainSlot,
      type: 'main'
    };
  }
  
  // Priority 2: Check Shorts Channel (Night Prayer)
  const shortsSlot = isLiveTime(LIVE_STREAMS.shortsChannel.schedule);
  if (shortsSlot) {
    return {
      stream: LIVE_STREAMS.shortsChannel,
      slot: shortsSlot,
      type: 'shorts'
    };
  }
  
  // No live stream - show common image
  return null;
}

// Display live stream
function displayLiveStream() {
  const activeData = getActiveLiveStream();
  const container = document.getElementById('live-stream-container');
  const section = document.getElementById('live-stream-section');
  
  if (!container || !section) return;
  
  if (activeData) {
    // LIVE STREAM IS ACTIVE
    section.style.display = 'block';
    
    const { stream, slot, type } = activeData;
    
    // Get correct image
    let imageUrl;
    if (type === 'main') {
      imageUrl = stream.images[slot.imageKey];
    } else {
      imageUrl = stream.image;
    }
    
    container.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto;">
        
        <!-- Live Indicator -->
        <div style="background: #ff0000; color: white; padding: 12px 20px; text-align: center; font-weight: bold; margin-bottom: 20px; border-radius: 8px; animation: pulse 2s infinite;">
          🔴 LIVE NOW - ${slot.title}
        </div>
        
        <!-- Image with Play Overlay - Clickable -->
        <a href="${stream.liveUrl}" target="_blank" style="display: block; text-decoration: none; position: relative; cursor: pointer;">
          <div style="position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3); transition: transform 0.3s ease;">
            
            <!-- Live Stream Image -->
            <img 
              src="${imageUrl}" 
              alt="${slot.title}" 
              style="width: 100%; height: auto; display: block; min-height: 400px; object-fit: cover;"
            >
            
            <!-- Dark Overlay -->
            <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6));">
            </div>
            
            <!-- Play Button Overlay -->
            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
              
              <!-- Large Pulsing Play Button -->
              <div style="width: 120px; height: 120px; background: rgba(255,0,0,0.95); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 25px; animation: pulse 2s infinite; box-shadow: 0 8px 30px rgba(255,0,0,0.5);">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              
              <!-- Text -->
              <h3 style="font-size: 2rem; margin-bottom: 10px; text-shadow: 0 3px 8px rgba(0,0,0,0.6); font-weight: bold;">🔴 LIVE NOW</h3>
              <p style="font-size: 1.3rem; text-shadow: 0 2px 6px rgba(0,0,0,0.5); margin-bottom: 5px;">Click to Join the Service</p>
              <p style="font-size: 1rem; opacity: 0.9; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Opens in YouTube</p>
            </div>
            
          </div>
        </a>
        
        <!-- Description & Button -->
        <div style="margin-top: 25px; text-align: center;">
          <p style="color: rgba(255,255,255,0.95); margin-bottom: 20px; font-size: 1.15rem; line-height: 1.6;">${slot.description}</p>
          <a href="${stream.liveUrl}" class="btn" style="background: white; color: #667eea; padding: 14px 35px; border-radius: 30px; text-decoration: none; display: inline-block; font-weight: bold; font-size: 1.05rem; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s ease;" target="_blank">Watch on YouTube</a>
        </div>
        
      </div>
    `;
    
  } else {
    // NOT LIVE - Hide the live section completely
    section.style.display = 'none';
  }
}

// CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { 
      opacity: 1; 
      transform: scale(1); 
    }
    50% { 
      opacity: 0.85; 
      transform: scale(1.05); 
    }
  }
  
  a:hover > div {
    transform: scale(1.02);
  }
  
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important;
  }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  displayLiveStream();
  setInterval(displayLiveStream, 60000); // Check every minute
  
  console.log('🔴 Live stream with 4 images initialized');
  console.log('⏰ Current time:', new Date().toLocaleTimeString());
  console.log('📅 Current day:', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]);
});