const slides = document.querySelectorAll(".slide");

let index = 0;

function showSlide() {
  slides.forEach(s => s.classList.remove("active"));

  index++;
  if(index >= slides.length) index = 0;

  slides[index].classList.add("active");
}

setInterval(showSlide, 3000); // 3 seconds