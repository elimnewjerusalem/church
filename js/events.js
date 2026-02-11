/* ===================================
   ENJC Church - Events Script
   Dynamic event loading and filtering
=================================== */

document.addEventListener('DOMContentLoaded', function() {
  
  // Sample events data - you can replace this with data from events.json
  const eventsData = [
    {
      title: "Sunday Worship Service",
      image: "images/events/e1.jpg",
      date: "Every Sunday",
      time: "05:30am - 07:30am, 08:30am - 10:30am, 11:30am - 01:30pm",
      description: "Join us for powerful worship, inspiring messages, and fellowship with believers.",
      buttonText: "Get Directions",
      buttonLink: "contact.html",
      buttonClass: "register"
    },
    {
      title: "Friday Prayer Meeting",
      image: "images/events/e2.jpg",
      date: "Every Friday",
      time: "11:00am - 01:30pm",
      description: "Come together in unity and power as we lift our voices in prayer.",
      buttonText: "Learn More",
      buttonLink: "contact.html",
      buttonClass: "call"
    },
    {
      title: "Youth Fellowship",
      image: "images/events/e3.jpg",
      date: "Every Saturday",
      time: "06:00pm - 07:00pm",
      description: "Dynamic gatherings for young people to grow in faith and build friendships.",
      buttonText: "Join Us",
      buttonLink: "contact.html",
      buttonClass: "join"
    }
  ];
  
  // Function to create event card HTML
  function createEventCard(event) {
    return `
      <div class="event-card">
        <img src="${event.image}" alt="${event.title}">
        <div class="event-content">
          <h3>${event.title}</h3>
          <p><strong>📅 ${event.date}</strong><br>
          ${event.time}</p>
          <p>${event.description}</p>
          <a href="${event.buttonLink}" class="btn ${event.buttonClass}">${event.buttonText}</a>
        </div>
      </div>
    `;
  }
  
  // Load events into the page
  function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    
    if (eventsContainer) {
      // Clear existing content
      eventsContainer.innerHTML = '';
      
      // Add each event
      eventsData.forEach(event => {
        eventsContainer.innerHTML += createEventCard(event);
      });
      
      // Add fade-in animation
      const eventCards = eventsContainer.querySelectorAll('.event-card');
      eventCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          card.style.transition = 'all 0.5s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }
  }
  
  // Load events from JSON file (optional)
  function loadEventsFromJSON() {
    fetch('data/events.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Events file not found');
        }
        return response.json();
      })
      .then(data => {
        // Use JSON data if available
        if (data && data.events && data.events.length > 0) {
          eventsData.length = 0; // Clear existing data
          eventsData.push(...data.events);
          loadEvents();
        }
      })
      .catch(error => {
        // If JSON file doesn't exist, use hardcoded data
        console.log('Using default events data');
        loadEvents();
      });
  }
  
  // Initialize
  loadEventsFromJSON();
  
  // Add smooth scroll to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
});
