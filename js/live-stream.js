// Live Stream Handler - Elim New Jerusalem Church
// Main Channel Priority with Professional Animations

const LIVE_STREAMS = {
  // MAIN CHANNEL - Sunday & Friday (HIGHEST PRIORITY)
  mainChannel: {
    name: 'Main Channel',
    channelUrl: 'https://www.youtube.com/@ElimNewJerusalemChurchOfficial',
    liveUrl: 'https://www.youtube.com/@ElimNewJerusalemChurchOfficial/live',
    
    images: {
      friday: 'images/live/friday-prayer.jpg',
      sunday: 'images/live/sunday-worship.jpg',
    },
    
    schedule: [
      // FRIDAY
      {
        day: 5,
        startTime: '11:00',
        endTime: '14:00',
        imageKey: 'friday',
        title: 'Family Blessing Prayer',
        description: 'Join us for powerful prayer and worship'
      },
      // SUNDAY - 3 Services
      {
        day: 0,
        startTime: '05:30',
        endTime: '07:30',
        imageKey: 'sunday',
        title: 'Sunday Worship Service',
        description: 'Join us for inspiring worship and messages'
      },
      {
        day: 0,
        startTime: '08:30',
        endTime: '10:30',
        imageKey: 'sunday',
        title: 'Sunday Worship Service',
        description: 'Join us for inspiring worship and messages'
      },
      {
        day: 0,
        startTime: '12:00',
        endTime: '14:00',
        imageKey: 'sunday',
        title: 'Sunday Worship Service',
        description: 'Join us for inspiring worship and messages'
      }
    ]
  },
  
  // SHORTS CHANNEL - Daily Night Prayer
  shortsChannel: {
    name: 'Shorts Channel',
    channelUrl: 'https://www.youtube.com/@ENJCShorts',
    liveUrl: 'https://www.youtube.com/@ENJCShorts/live',
    
    image: 'images/live/night-prayer.jpg',
    
    schedule: [
      {
        day: 'all',
        startTime: '22:30',
        endTime: '23:00',
        title: 'Daily Night Prayer',
        description: 'End your day with prayer and devotion'
      }
    ]
  }
};

function isLiveTime(schedule) {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  for (const slot of schedule) {
    if (slot.day !== 'all' && slot.day !== currentDay) continue;
    
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

function getActiveLiveStream() {
  // PRIORITY 1: Main Channel (ALWAYS FIRST)
  const mainSlot = isLiveTime(LIVE_STREAMS.mainChannel.schedule);
  if (mainSlot) {
    return {
      stream: LIVE_STREAMS.mainChannel,
      slot: mainSlot,
      type: 'main'
    };
  }
  
  // PRIORITY 2: Shorts Channel
  const shortsSlot = isLiveTime(LIVE_STREAMS.shortsChannel.schedule);
  if (shortsSlot) {
    return {
      stream: LIVE_STREAMS.shortsChannel,
      slot: shortsSlot,
      type: 'shorts'
    };
  }
  
  return null;
}

function displayLiveStream() {
  const activeData = getActiveLiveStream();
  const container = document.getElementById('live-stream-container');
  const section = document.getElementById('live-stream-section');
  
  if (!container || !section) return;
  
  if (activeData) {
    // LIVE NOW - SHOW IT WITH ANIMATIONS
    section.style.display = 'block';
    
    const { stream, slot, type } = activeData;
    
    let imageUrl;
    if (type === 'main') {
      imageUrl = stream.images[slot.imageKey];
    } else {
      imageUrl = stream.image;
    }
    
    container.innerHTML = `
      <div style="max-width: 1000px; margin: 0 auto;">
        
        <!-- Live Indicator Badge -->
        <div style="background: #ff0000; color: white; padding: 15px 25px; text-align: center; font-weight: bold; margin-bottom: 25px; border-radius: 10px; animation: pulse 2s infinite; box-shadow: 0 4px 15px rgba(255,0,0,0.4);">
          <span style="font-size: 1.3rem;">🔴 LIVE NOW - ${slot.title}</span>
        </div>
        
        <!-- Clickable Live Stream Image -->
        <a href="${stream.liveUrl}" target="_blank" style="display: block; text-decoration: none; position: relative; cursor: pointer;">
          <div style="position: relative; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 50px rgba(0,0,0,0.3); transition: transform 0.3s ease, box-shadow 0.3s ease;">
            
            <!-- Live Image -->
            <img 
              src="${imageUrl}" 
              alt="${slot.title}" 
              style="width: 100%; height: auto; display: block; object-fit: cover;"
            >
            
            <!-- Overlay -->
            <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.25);">
            </div>
            
            <!-- Play Button with Animation -->
            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
              
              <!-- Pulsing Play Button -->
              <div style="width: 130px; height: 130px; background: rgba(255,0,0,0.95); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 30px; animation: pulse 2s infinite; box-shadow: 0 10px 40px rgba(255,0,0,0.6);">
                <svg width="55" height="55" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              
              <!-- Text -->
              <h3 style="font-size: 2.2rem; margin-bottom: 12px; text-shadow: 0 4px 10px rgba(0,0,0,0.9); font-weight: bold; animation: fadeIn 1s;">🔴 LIVE NOW</h3>
              <p style="font-size: 1.4rem; text-shadow: 0 3px 8px rgba(0,0,0,0.9); margin-bottom: 8px;">Click to Join the Service</p>
              <p style="font-size: 1.1rem; opacity: 0.95; text-shadow: 0 2px 6px rgba(0,0,0,0.9);">Opens in YouTube</p>
            </div>
            
          </div>
        </a>
        
        <!-- Description & Button -->
        <div style="margin-top: 30px; text-align: center;">
          <p style="color: #333; margin-bottom: 25px; font-size: 1.2rem; line-height: 1.7;">${slot.description}</p>
          <a href="${stream.liveUrl}" class="btn register" style="padding: 16px 40px; font-size: 1.1rem; animation: bounce 2s infinite;" target="_blank">Watch on YouTube</a>
        </div>
        
      </div>
    `;
    
  } else {
    // NOT LIVE - Hide section
    section.style.display = 'none';
  }
}

// Professional CSS Animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { 
      opacity: 1; 
      transform: scale(1); 
    }
    50% { 
      opacity: 0.85; 
      transform: scale(1.08); 
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  a:hover > div {
    transform: scale(1.02);
    box-shadow: 0 15px 60px rgba(0,0,0,0.4) !important;
  }
  
  .btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important;
  }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  displayLiveStream();
  setInterval(displayLiveStream, 60000);
  
  console.log('🔴 Live stream initialized - Main Channel Priority Active');
  console.log('⏰', new Date().toLocaleTimeString());
  console.log('📅', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]);
  
  const active = getActiveLiveStream();
  if (active) {
    console.log('✅ LIVE:', active.slot.title, '(' + active.type + ')');
  } else {
    console.log('❌ Offline - section hidden');
  }
});
