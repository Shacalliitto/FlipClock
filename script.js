class FlipCard {
  constructor(elementId, initialValue) {
    this.element = document.getElementById(elementId);
    this.currentValue = initialValue;
    this.isFlipping = false;

    // Build static halves
    this.topStatic = this.createHalf('top', initialValue);
    this.bottomStatic = this.createHalf('bottom', initialValue);
    
    this.element.appendChild(this.topStatic);
    this.element.appendChild(this.bottomStatic);
  }

  createHalf(type, value) {
    const half = document.createElement('div');
    half.className = `digit-half ${type}`;
    const span = document.createElement('span');
    span.textContent = value;
    half.appendChild(span);
    return half;
  }

  flipTo(newValue) {
    if (newValue === this.currentValue) return;

    if (this.isFlipping) {
      // Force end previous animation to prevent stacking
      this.bottomStatic.querySelector('span').textContent = this.currentValue;
      const flaps = this.element.querySelectorAll('.flap');
      flaps.forEach(flap => flap.remove());
    }

    this.isFlipping = true;

    // Update the top static layer to the new value instantly
    this.topStatic.querySelector('span').textContent = newValue;

    // Create flaps
    const topFlap = this.createHalf('top', this.currentValue);
    topFlap.classList.add('flap', 'flap-top');
    
    const bottomFlap = this.createHalf('bottom', newValue);
    bottomFlap.classList.add('flap', 'flap-bottom');

    this.element.appendChild(topFlap);
    this.element.appendChild(bottomFlap);

    // After animation is finished (0.4s + 0.4s = 0.8s)
    setTimeout(() => {
      this.bottomStatic.querySelector('span').textContent = newValue;
      if (this.element.contains(topFlap)) this.element.removeChild(topFlap);
      if (this.element.contains(bottomFlap)) this.element.removeChild(bottomFlap);
      this.isFlipping = false;
    }, 800);

    this.currentValue = newValue;
  }
}

// Ensure numbers are always two digits
const pad = (num) => num.toString().padStart(2, '0');

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  const hoursCard = new FlipCard('hours', pad(now.getHours()));
  const minutesCard = new FlipCard('minutes', pad(now.getMinutes()));
  const secondsCard = new FlipCard('seconds', pad(now.getSeconds()));

  const dateDisplay = document.getElementById('date-display');

  const updateDate = () => {
    const time = new Date();
    const options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
    let dateStr = time.toLocaleDateString('pt-BR', options);
    // Capitalize the first letter of the weekday
    dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    // Format to "Dia da semana, DD/MM/YYYY"
    dateStr = dateStr.replace(/, (\d{2})\/(\d{2})\/(\d{4})/, ', $1/$2/$3');
    dateDisplay.textContent = dateStr;
  };

  setInterval(() => {
    const time = new Date();
    hoursCard.flipTo(pad(time.getHours()));
    minutesCard.flipTo(pad(time.getMinutes()));
    secondsCard.flipTo(pad(time.getSeconds()));
    
    // Update date only when day changes (simplified check by running every minute or tick, it's cheap)
    updateDate();
  }, 1000);
  
  updateDate(); // Initial call
});
