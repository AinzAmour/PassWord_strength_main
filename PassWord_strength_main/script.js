// Prevent right-click
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

// Theme toggle functionality
let currentTheme = 'dark';
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  currentTheme = savedTheme;
  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    themeIcon.textContent = '☀️';
  }
}

themeToggle.addEventListener('click', () => {
  if (currentTheme === 'dark') {
    document.body.classList.add('light-theme');
    currentTheme = 'light';
    themeIcon.textContent = '☀️';
  } else {
    document.body.classList.remove('light-theme');
    currentTheme = 'dark';
    themeIcon.textContent = '🌙';
  }
  
  // Save theme preference
  localStorage.setItem('theme', currentTheme);
});



// Copy to clipboard functionality
const copyBtn = document.getElementById('copyBtn');
const passwordInput = document.getElementById('YourPassword');

copyBtn.addEventListener('click', async () => {
  const password = passwordInput.value;
  
  if (!password) {
    // Show feedback for empty password
    copyBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;
      copyBtn.classList.remove('copied');
    }, 1000);
    return;
  }
  
  try {
    await navigator.clipboard.writeText(password);
    
    // Show success feedback
    copyBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
    `;
    copyBtn.classList.add('copied');
    
    setTimeout(() => {
      copyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;
      copyBtn.classList.remove('copied');
    }, 2000);
    
  } catch (err) {
    // Fallback for older browsers
    passwordInput.select();
    document.execCommand('copy');
    
    // Show success feedback
    copyBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
    `;
    copyBtn.classList.add('copied');
    
    setTimeout(() => {
      copyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;
      copyBtn.classList.remove('copied');
    }, 2000);
  }
});

// Banned passwords list
let bannedPasswords = [];

// Load banned passwords from file
async function loadBannedPasswords() {
  try {
    const response = await fetch('banned_passwords.txt');
    const data = await response.text();
    bannedPasswords = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  } catch (error) {
    console.log('Failed to load banned passwords:', error);
    // Fallback to common banned passwords
    bannedPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
      'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'hello',
      'freedom', 'whatever', 'qazwsx', 'trustno1', 'jordan', 'harley',
      'ranger', 'iwantu', 'jennifer', 'hunter', 'buster', 'soccer', 'tiger'
    ];
  }
}

// Data breach check function using local file
function checkDataBreach(password) {
  return bannedPasswords.includes(password.toLowerCase());
}

function Strength(password) {
    let i = 0;
    let contains = [];
    
    if (password.length > 6) {
      i++;
    }
    if (password.length >= 10) {
      i++;
    }
  
    if (/[A-Z]/.test(password)) {
      i++;
      contains.push("uppercase");
    }
  
    if (/[0-9]/.test(password)) {
      i++;
      contains.push("number");
    }
  
    if (/[a-z]/.test(password)) {
      i++;
      contains.push("lowercase");
    }
    
    if (/[^A-Za-z0-9]/.test(password)) {
      i++;
      contains.push("symbol");
    }
  
    return { strength: i, contains: contains };
  }
  
  let container = document.querySelector(".container");
  let resultDiv = document.querySelector(".result");
  
  // Load banned passwords on page load
  loadBannedPasswords();
  
  // Show default results on page load
  displayResults("None", 0, [], false);
  
  document.addEventListener("keyup", function (e) {
    let password = document.querySelector("#YourPassword").value;
  
    if (password.length === 0) {
      container.classList.remove("weak", "moderate", "strong");
      displayResults("None", 0, [], false);
      return;
    }
  
    let analysis = Strength(password);
    let strength = analysis.strength;
    let contains = analysis.contains;
    
    // Check for data breach
    let isBreached = checkDataBreach(password);
    
    // Determine strength level
    let strengthValue = "";
    if (strength <= 2) {
      container.classList.add("weak");
      container.classList.remove("moderate", "strong");
      strengthValue = "Weak";
    } else if (strength >= 3 && strength <= 4) {
      container.classList.remove("weak", "strong");
      container.classList.add("moderate");
      strengthValue = "Moderate";
    } else {
      container.classList.remove("weak", "moderate");
      container.classList.add("strong");
      strengthValue = "Strong";
    }
    
    // Display detailed results
    displayResults(strengthValue, password.length, contains, isBreached);
  });
  
  function displayResults(strength, length, contains, isBreached) {
    // Remove existing result div if present
    if (resultDiv) resultDiv.remove();
    
    // Create result display
    resultDiv = document.createElement("div");
    resultDiv.className = "result";
    
    // Add empty class if no password
    if (length === 0) {
      resultDiv.classList.add("empty");
    }
    
    // Add breached class if password is found in data breach
    if (isBreached) {
      resultDiv.classList.add("breached");
    }
    
    let breachStatus = isBreached ? 
      '<div class="breach-warning">⚠️ Password found in data breach!</div>' : 
      '<div class="breach-safe">✅ Password not found in known breaches</div>';
    
    resultDiv.innerHTML = `
      <h3>Password Analysis Result</h3>
      <div class="result-item">
        <strong>Strength value:</strong> ${strength}
      </div>
      <div class="result-item">
        <strong>Length:</strong> ${length}
      </div>
      <div class="result-item">
        <strong>Contains:</strong> [${contains.map(item => `"${item}"`).join(",")}]
      </div>
      <div class="result-item breach-status">
        <strong>Security:</strong> ${breachStatus}
      </div>
    `;
    
    // Insert directly after the container
    container.after(resultDiv);
  }
  
  let password = document.querySelector("#YourPassword");
  let show = document.querySelector(".show");
  show.onclick = function () {
    if (password.type === "password") {
      password.setAttribute("type", "text");
      show.classList.add("hide");
    } else {
      password.setAttribute("type", "password");
      show.classList.remove("hide");
    }
  };