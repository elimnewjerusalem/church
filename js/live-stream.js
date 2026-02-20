// Live Stream Handler - Elim New Jerusalem Church
// Sunday: 5:30am-7:30am, 8:30am-10:30am, 12:00pm-2:00pm (Main Channel)
// Friday: 11:00am-2:00pm (Main Channel)
// Daily Night: 10:30pm-11:00pm (Shorts Channel)
// Main Channel Priority: ALWAYS FIRST

const LIVE_STREAMS = {
  // MAIN CHANNEL - Sunday & Friday (PRIORITY)
  mainChannel: {
    name: 'Main Channel',
    channelUrl: 'https://www.youtube.com/@ElimNewJerusalemChurchOfficial',
    liveUrl: 'https://www.youtube.com/@ElimNewJerusalemChurchOfficial/live',
    
    // Images for different services
    images: {
      friday: 'images/live/friday-prayer.jpg',      // Friday - "FAMILY BLESSING PRAYER"
      sunday: 'images/live/sunday-worship.jpg',     // Sunday - "SUNDAY SERVICE"
    },
    
    // Schedule
    schedule: [
      // FRIDAY
      {
        day: 5,
        startTime: '11:00',
        endTime: '14:00',
        imageKey: 'friday',
        title: 'Family Blessing Prayer - Live Now',
        description: 'Join us for Family Blessing Prayer and powerful worship'
      },
      // SUNDAY - 3 Services
      {
        day: 0,
        startTime: '05:30',
        endTime: '07:30',
        imageKey: 'sunday',
        title: 'Sunday Service - Live Now',
        description: 'Join us for inspiring worship, messages, and fellowship'
      },
      {
        day: 0,
        startTime: '08:30',
        endTime: '10:30',
        imageKey: 'sunday',
        title: 'Sunday Service - Live Now',
        description: 'Join us for inspiring worship, messages, and fellowship'
      },
      {
        day: 0,
        startTime: '12:00',
        endTime: '14:00',
        imageKey: 'sunday',
        title: 'Sunday Service - Live Now',
        description: 'Join us for inspiring worship, messages, and fellowship'
      }
    ]
  },
  
  // SHORTS CHANNEL - Daily Night Prayer
  shortsChannel: {
    name: 'Shorts Channel',
    channelUrl: 'https://www.youtube.com/@ENJCShorts',
    liveUrl: 'https://www.youtube.com/@ENJCShorts/live',
    
    image: 'images/live/night-prayer.jpg',  // "FAMILY PRAYER"
    
    // Schedule - Daily Night Prayer
    schedule: [
      {
        day: 'all',
        startTime: '22:30',
        endTime: '23:00',
        title: 'Family Prayer - Live Now',
        description: 'End your day with prayer and devotion'
      }
    ]
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

// Get active live stream (MAIN CHANNEL PRIORITY)
function getActiveLiveStream() {
  // PRIORITY 1: Main Channel (Sunday & Friday) - MOST IMPORTANT
  const mainSlot = isLiveTime(LIVE_STREAMS.mainChannel.schedule);
  if (mainSlot) {
    return {
      stream: LIVE_STREAMS.mainChannel,
      slot: mainSlot,
      type: 'main'
    };
  }
  
  // PRIORITY 2: Shorts Channel (Daily Night Prayer)
  const shortsSlot = isLiveTime(LIVE_STREAMS.shortsChannel.schedule);
  if (shortsSlot) {
    return {
      stream: LIVE_STREAMS.shortsChannel,
      slot: shortsSlot,
      type: 'shorts'
    };
  }
  
  // Not live - hide section
  return null;
}

// Display live stream
function displayLiveStream() {
  const activeData = getActiveLiveStream();
  const container = document.getElementById('live-stream-container');
  const section = document.getElementById('live-stream-section');
  
  if (!container || !section) return;
  
  if (activeData) {
    // LIVE NOW - SHOW IT
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
        
        <!-- Image with Play Button - Clickable -->
        <a href="${stream.liveUrl}" target="_blank" style="display: block; text-decoration: none; position: relative; cursor: pointer;">
          <div style="position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3); transition: transform 0.3s ease;">
            
            <!-- Custom Image -->
            <img 
              src="${imageUrl}" 
              alt="${slot.title}" 
              style="width: 100%; height: auto; display: block; object-fit: cover;"
            >
            
            <!-- Dark Overlay -->
            <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.2);">
            </div>
            
            <!-- Play Button Overlay -->
            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
              
              <!-- Pulsing Play Button -->
              <div style="width: 120px; height: 120px; background: rgba(255,0,0,0.95); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 25px; animation: pulse 2s infinite; box-shadow: 0 8px 30px rgba(255,0,0,0.5);">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              
              <!-- Text -->
              <h3 style="font-size: 2rem; margin-bottom: 10px; text-shadow: 0 3px 8px rgba(0,0,0,0.8); font-weight: bold;">🔴 LIVE NOW</h3>
              <p style="font-size: 1.3rem; text-shadow: 0 2px 6px rgba(0,0,0,0.8); margin-bottom: 5px;">Click to Join the Service</p>
              <p style="font-size: 1rem; opacity: 0.9; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">Opens in YouTube</p>
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
    // NOT LIVE - Hide section
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
  
  console.log('🔴 Live stream initialized - Main Channel Priority');
  console.log('⏰ Current time:', new Date().toLocaleTimeString());
  console.log('📅 Current day:', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]);
  
  // Debug
  const active = getActiveLiveStream();
  if (active) {
    console.log('✅ LIVE NOW:', active.slot.title, '(' + active.type + ' channel)');
  } else {
    console.log('❌ Not live - section hidden');
  }
});
