# Modify - Music Streaming App

## Overview
Modify is a modern music streaming platform designed for both listeners and musicians. Listeners can explore and play trending tracks, while musicians can showcase their work by uploading tracks and managing their profiles. Built with a sleek, responsive interface, Modify offers a seamless experience across devices, featuring a glassmorphism-inspired design with dynamic gradients and intuitive navigation.

## Features
- **For Listeners**:
  - Browse and play trending tracks with a clean, card-based interface.
  - Responsive footer navigation for quick access to home, profile, now playing, and search.
  - Smooth playback controls with a visually appealing play button.
- **For Musicians**:
  - Upload and manage tracks with cover images via a user-friendly modal.
  - Customize profiles with profile pictures and role descriptions.
  - Success notifications for track and profile picture uploads.
- **Responsive Design**:
  - Adapts to all screen sizes, from mobile phones to desktops, using CSS `clamp()` and media queries.
  - Dynamic viewport height handling for mobile browsers.
- **Aesthetic**:
  - Glassmorphism UI with translucent cards, blur effects, and animated gradients.
  - High-contrast, cyan-accented visuals for an engaging experience.

## Tech Stack
- **Frontend**:
  - HTML with EJS templating for dynamic content (tracks, musician data).
  - CSS with custom styles for glassmorphism and responsiveness.
  - Bootstrap 5.3 for grid layout and modal components.
  - Font Awesome for icons.
- **JavaScript**:
  - Client-side scripts for track playback and URL cleanup.
  - Dynamic viewport height adjustment for mobile compatibility.
- **Backend**:
  - Node.js/Express.
  - File uploads for tracks and profile pictures (multipart/form-data).

## Installation
1. **Clone the Repository**:
   ```bash
   git clone <https://github.com/he-is-mod/MODIFY.git>
   cd modify
