# VoidIRC

A simple web-based IRC-style chat application built with Koa and WebSockets.

## Features

- Real-time messaging with WebSockets
- Multiple chat rooms
- Nickname system with duplicate prevention
- Simple web interface

## Commands

- `/nick <name>` - Set your nickname
- `/join <room>` - Join a chat room
- `/msg <message>` - Send a message
- `/list` - Show active rooms
- `/quit` - Disconnect

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   node app.js
   ```

3. Open `http://localhost:8080` in your browser

## Network Access

To allow other users on your network to connect, the server runs on `0.0.0.0:8080`. 
Find your local IP and share `http://YOUR_IP:8080` with others.