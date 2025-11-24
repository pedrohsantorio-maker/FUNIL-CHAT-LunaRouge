# **App Name**: WhatsApp-Style Chatbot

## Core Features:

- Age Verification: Initial age gate to verify if the user is over 18 with 'Yes' and 'No' options. The 'Yes' option redirects to the chat interface. The 'No' option displays a message denying access and an option to return.
- Chat Interface: WhatsApp-style chat layout with message bubbles, user input, media attachments, and audio recording.
- Media Handling: Allow users to send images, audio, and video. Store these files in Firebase Storage. The function includes 'recording audio' to show audio count in seconds
- Data Capture: Capture user's name and email at the start of the chat via controlled inputs, and stores the data on Firestore
- Welcome Message & Automated Flow: Send a welcome message to the user and guide them through a predetermined conversational flow.
- Realistic Delays & Typing Indicator: Implement realistic delays between messages and typing indicators to mimic a real conversation.
- External Payment Links: Redirect users to external payment pages when they have completed data verification

## Style Guidelines:

- Primary color: Rose madder (#E7377B), reflecting a modern, vibrant tone reminiscent of the chat app.
- Background color: Pale pink (#F8E3E9), provides a soft, subtle base to allow UI elements to stand out.
- Accent color: Dark rose (#94204A), used in interactive elements and highlights for visual contrast.
- Body and headline font: 'PT Sans' for a modern, clear, and readable style throughout the app.
- Use flat style icons to match the modern design of the chat app. Icons for audio recording, file upload, send messages, and other elements within the app.
- WhatsApp-style layout featuring a chat interface with message bubbles (user on the right, bot on the left), clear separation of elements, and a dedicated input area at the bottom. Keep design minimal to provide simple navigation
- Subtle animations on message entry (slide + fade-in). Show a typing indicator (GIF/loader) before the bot sends a message.