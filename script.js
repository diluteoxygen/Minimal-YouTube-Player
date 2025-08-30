// Enhanced YouTube Player with better UX
class YouTubePlayer {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupKeyboardNavigation();
  }

  setupEventListeners() {
    const urlInput = document.getElementById('youtube-url');
    const playButton = document.getElementById('play-button');
    
    // Enter key support
    urlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.playVideo();
      }
    });

    // Real-time URL validation
    urlInput.addEventListener('input', () => {
      this.validateUrl(urlInput.value);
    });

    // Paste support
    urlInput.addEventListener('paste', (e) => {
      setTimeout(() => {
        this.validateUrl(urlInput.value);
      }, 100);
    });
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Focus input with Ctrl/Cmd + L
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        document.getElementById('youtube-url').focus();
      }
    });
  }

  validateUrl(url) {
    const urlInput = document.getElementById('youtube-url');
    const isValid = this.isValidYouTubeUrl(url);
    
    if (url && !isValid) {
      urlInput.style.borderColor = 'rgba(255, 107, 107, 0.5)';
    } else {
      urlInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    }
    
    return isValid;
  }

  isValidYouTubeUrl(url) {
    if (!url) return false;
    
    const patterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/v\/[\w-]+/
    ];
    
    return patterns.some(pattern => pattern.test(url));
  }

  getVideoId(youtubeUrl) {
    if (!youtubeUrl) return null;

    try {
      // Handle youtu.be URLs
      if (youtubeUrl.includes('youtu.be/')) {
        const urlParts = youtubeUrl.split('/');
        const videoId = urlParts[urlParts.length - 1].split('?')[0];
        return videoId;
      }

      // Handle youtube.com URLs
      if (youtubeUrl.includes('youtube.com')) {
        const url = new URL(youtubeUrl);
        return url.searchParams.get('v');
      }

      return null;
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return null;
    }
  }

  showError(message) {
    const errorElement = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const successElement = document.getElementById('success-message');
    
    errorText.textContent = message;
    errorElement.style.display = 'block';
    successElement.style.display = 'none';
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }

  showSuccess() {
    const errorElement = document.getElementById('error-message');
    const successElement = document.getElementById('success-message');
    
    errorElement.style.display = 'none';
    successElement.style.display = 'block';
    
    // Auto-hide success after 3 seconds
    setTimeout(() => {
      successElement.style.display = 'none';
    }, 3000);
  }

  setLoadingState(isLoading) {
    const playButton = document.getElementById('play-button');
    const buttonIcon = playButton.querySelector('i');
    const buttonText = playButton.querySelector('span');
    
    if (isLoading) {
      playButton.disabled = true;
      buttonIcon.className = 'loading';
      buttonText.textContent = 'Loading...';
    } else {
      playButton.disabled = false;
      buttonIcon.className = 'fas fa-play';
      buttonText.textContent = 'Play';
    }
  }

  async playVideo() {
    const youtubeUrl = document.getElementById('youtube-url').value.trim();
    
    // Clear previous messages
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('success-message').style.display = 'none';
    
    // Validate URL
    if (!youtubeUrl) {
      this.showError('Please enter a YouTube URL');
      document.getElementById('youtube-url').focus();
      return;
    }

    if (!this.validateUrl(youtubeUrl)) {
      this.showError('Please enter a valid YouTube URL');
      document.getElementById('youtube-url').focus();
      return;
    }

    // Get video ID
    const videoId = this.getVideoId(youtubeUrl);
    if (!videoId) {
      this.showError('Could not extract video ID from URL');
      return;
    }

    // Set loading state
    this.setLoadingState(true);

    try {
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      iframe.width = '100%';
      iframe.height = '540';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.title = 'YouTube video player';

      // Clear and show player
      const player = document.getElementById('player');
      player.innerHTML = '';
      player.appendChild(iframe);
      player.classList.add('show');

      // Show success message
      this.showSuccess();

      // Scroll to player smoothly
      player.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });

    } catch (error) {
      console.error('Error loading video:', error);
      this.showError('Failed to load video. Please try again.');
    } finally {
      this.setLoadingState(false);
    }
  }
}

// Initialize the player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.youtubePlayer = new YouTubePlayer();
});

// Global function for backward compatibility
function playVideo() {
  if (window.youtubePlayer) {
    window.youtubePlayer.playVideo();
  }
}