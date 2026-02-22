// Live Stream Handler - Elim New Jerusalem Church
// Updated: Button below video, no top banner

const LIVE_STREAMS = {
  mainChannel: {
    name: 'Main Channel',
    channelUrl: 'https://www.youtube.com/@ElimNewJerusalemChurchOfficial',
    liveUrl: 'https://www.youtube.com/@ElimNewJerusalemChurchOfficial/live',
    
    images: {
      friday: 'images/Live/friday-prayer.jpg',
      sunday: 'images/Live/sunday-worship.jpg',
    },
    
    schedule: [
      {
        day: 5,
        startTime: '11:00',
        endTime: '14:00',
        imageKey: 'friday',
        title: 'Family Blessing Prayer',
        description: 'Join us for powerful prayer and worship'
      },
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
  
  shortsChannel: {
    name: 'Shorts Channel',
    channelUrl: 'https://www.youtube.com/@ENJCShorts',
    liveUrl: 'https://www.youtube.com/@ENJCShorts/live',
    
    image: 'images/Live/night-prayer.jpg',
    
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
  const mainSlot = isLiveTime(LIVE_STREAMS.mainChannel.schedule);
  if (mainSlot) {
    return {
      stream: LIVE_STREAMS.mainChannel,
      slot: mainSlot,
      type: 'main'
    };
  }
  
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
        
        <!-- Clickable Live Stream Image (NO button inside) -->
        <a href="${stream.liveUrl}" target="_blank" style="display: block; text-decoration: none; position: relative; cursor: pointer;">
          <div style="position: relative; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 50px rgba(0,0,0,0.3); transition: transform 0.3s ease;">
            
            <!-- Live Image -->
            <img 
              src="${imageUrl}" 
              alt="${slot.title}" 
              style="width: 100%; height: auto; display: block; object-fit: cover;"
              onerror="this.onerror=null; this.src='images/live/common.jpg';"
            >
            
            <!-- Small LIVE badge in corner -->
            <div style="position: absolute; top: 20px; right: 20px; background: #ff0000; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; font-size: 0.9rem; animation: pulse 2s infinite;">
              🔴 LIVE
            </div>
            
            <!-- Overlay -->
            <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.25);">
            </div>
            
            <!-- Play Button ONLY -->
            <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;">
              <div style="width: 130px; height: 130px; background: rgba(255,0,0,0.95); border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite; box-shadow: 0 10px 40px rgba(255,0,0,0.6);">
                <svg width="55" height="55" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            
          </div>
        </a>
        
        <!-- Description (centered) -->
        <div style="margin-top: 20px; text-align: center;">
          <p style="color: #555; margin-bottom: 20px; font-size: 1.1rem;">${slot.description}</p>
        </div>
        
        <!-- LIVE NOW Button BELOW video -->
        <div style="text-align: center; margin-top: 25px;">
          <a href="${stream.liveUrl}" class="btn" style="background: #ff0000; color: white; padding: 16px 45px; font-size: 1.2rem; border-radius: 30px; text-decoration: none; display: inline-block; font-weight: bold; box-shadow: 0 4px 15px rgba(255,0,0,0.4); animation: pulse 2s infinite;" target="_blank">
            🔴 LIVE NOW - ${slot.title}
          </a>
        </div>
        
      </div>
    `;
    
  } else {
    section.style.display = 'none';
  }
}

// Animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.85; transform: scale(1.05); }
  }
  
  a:hover > div {
    transform: scale(1.02);
    box-shadow: 0 15px 60px rgba(0,0,0,0.4) !important;
  }
  
  .btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255,0,0,0.5) !important;
  }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  displayLiveStream();
  setInterval(displayLiveStream, 60000);
  
  console.log('🔴 Live stream initialized');
  const active = getActiveLiveStream();
  if (active) {
    console.log('✅ LIVE:', active.slot.title);
  }
});
