fetch("data/events.json")
  .then(res => res.json())
  .then(events => {

    const container = document.getElementById("eventsContainer");

    events.forEach(e => {

      const dateObj = new Date(e.date);

      const day = dateObj.getDate();
      const month = dateObj.toLocaleString('en', { month: 'short' });
      const year = dateObj.getFullYear();

      const card = document.createElement("div");
      card.className = "event-card";

      card.innerHTML = `
        <div class="event-img">
          <img src="${e.image}" loading="lazy">
          <div class="date-badge">
            <span class="day">${day}</span>
            <span class="month">${month}</span>
          </div>
        </div>

        <div class="event-content">
          <h3>${e.title}</h3>
          <p>⏰ ${e.time}</p>

          <div class="event-buttons">
            <a href="${e.whatsapp}" target="_blank" class="btn join">Join WhatsApp</a>
            <button class="btn register">Register</button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

  });