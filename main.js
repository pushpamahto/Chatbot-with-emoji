

// with voice assist


// main.js



// const chatBody = document.querySelector(".chat-body");
// const messageInput = document.querySelector(".message-input");
// const sendMessageButton = document.querySelector("#send-message");
// const fileInput = document.querySelector("#file-input");

// const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
// const fileCancelButton = document.querySelector("#file-cancel");

// const chatbotToggler = document.querySelector("#chatbot-toggler");
// const closeChatbot = document.querySelector("#close-chatbot");

// // Chat History elements
// const chatHistoryButton = document.querySelector("#chat-history");
// const chatHistorySidebar = document.querySelector(".chat-history-sidebar");
// const closeHistoryButton = document.querySelector("#close-history");
// const historyList = document.querySelector(".history-list");
// const deleteAllHistoryButton = document.querySelector("#delete-all-history");

// // Voice Assist elements
// const voiceAssistButton = document.querySelector("#voice-assist");

// // API setup
// const API_KEY = "AIzaSyCND8_k9nMfIrl8OhpVAYXoMGwh7dlR3Xs"; // Replace with your actual Gemini API Key
// const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// let currentChatId = null; // To keep track of the current chat (will be a string)
// let chatHistory = []; // Array to store all chat conversations

// const userData = {
//     message: null,
//     file: {
//         data: null,
//         mime_type: null
//     }
// };

// const initialInputHeight = messageInput.scrollHeight;

// // Speech Recognition API setup
// let recognition;
// let isListening = false;

// // Function to save chat history to localStorage
// const saveChatHistory = () => {
//     localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
// };

// // Function to load chat history from localStorage
// const loadChatHistory = () => {
//     const savedHistory = localStorage.getItem("chatHistory");
//     chatHistory = savedHistory ? JSON.parse(savedHistory) : [];
// };

// // Function to format chat timestamp
// const formatChatTimestamp = (timestamp) => {
//     if (!timestamp) return ""; // Handle null or undefined timestamps
//     const date = new Date(timestamp);
//     const now = new Date();

//     if (isNaN(date.getTime())) {
//         return ""; // Invalid timestamp
//     }

//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);
//     const oneWeekAgo = new Date(today);
//     oneWeekAgo.setDate(today.getDate() - 7);

//     const targetDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

//     if (targetDateOnly.getTime() === today.getTime()) { // Today
//         return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
//     } else if (targetDateOnly.getTime() === yesterday.getTime()) { // Yesterday
//         return "Yesterday";
//     } else if (date.getTime() > oneWeekAgo.getTime()) { // Within the last week (but not today or yesterday)
//         return date.toLocaleDateString('en-US', { weekday: 'short' });
//     } else { // Older than a week
//         return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
//     }
// };


// // Function to render chat history in the sidebar
// const renderChatHistory = () => {
//     historyList.innerHTML = ""; // Clear existing list

//     // Sort chat history by lastActive, most recent first
//     const sortedHistory = [...chatHistory].sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));

//     sortedHistory.forEach(chat => {
//         const chatItem = document.createElement("li");
//         chatItem.setAttribute("data-chat-id", chat.id);

//         const firstUserMessage = chat.messages.find(msg => msg.sender === "user" && msg.type === "text");
//         let chatTitleText = "New Chat";
//         if (firstUserMessage) {
//             chatTitleText = firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "");
//         } else if (chat.messages.length > 0 && chat.messages[0].content) {
//              // Fallback to first message content if no user text message
//             chatTitleText = chat.messages[0].content.substring(0, 30) + (chat.messages[0].content.length > 30 ? "..." : "");
//         }


//         const chatTime = formatChatTimestamp(chat.lastActive);

//         chatItem.innerHTML = `
//             <div class="chat-history-item-content">
//                 <span class="chat-title">${chatTitleText}</span>
//                 <span class="chat-time">${chatTime}</span>
//             </div>
//             <button class="material-symbols-rounded delete-chat-item">delete</button>
//         `;

//         chatItem.addEventListener("click", (e) => {
//             if (!e.target.closest(".delete-chat-item")) { // check if click is not on delete button or its children
//                 loadChat(chat.id);
//                 document.body.classList.remove("show-chat-history");
//             }
//         });

//         const deleteButton = chatItem.querySelector(".delete-chat-item");
//         deleteButton.addEventListener("click", (e) => {
//             e.stopPropagation(); // Prevent loading chat when deleting
//             deleteChat(chat.id);
//         });

//         historyList.appendChild(chatItem);
//     });
// };

// // Function to delete a specific chat from history
// const deleteChat = (idToDelete) => { // idToDelete is a string
//     chatHistory = chatHistory.filter(chat => chat.id !== idToDelete);
//     saveChatHistory();
//     renderChatHistory(); // Re-render the list

//     if (currentChatId === idToDelete) {
//         startNewChat();
//     }
// };

// // Function to clear all chat history
// const deleteAllHistory = () => {
//     if (confirm("Are you sure you want to delete all chat history? This action cannot be undone.")) {
//         chatHistory = [];
//         saveChatHistory();
//         renderChatHistory();
//         startNewChat(); // Start a new chat after deleting all history
//     }
// };


// // Function to load a specific chat into the main chat window
// const loadChat = (chatId) => { // chatId is a string
//     const chat = chatHistory.find(c => c.id === chatId);
//     if (!chat) {
//         startNewChat();
//         return;
//     }

//     currentChatId = chatId;
//     chatBody.innerHTML = ""; // Clear current messages
//     chat.messages.forEach(msg => {
//         let content = '';
//         let classes = [];

//         if (msg.sender === "bot") {
//             classes.push("bot-message");
//             content += `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
//                                 <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
//                              </svg>
//                              <div class="message-text">${msg.content}</div>`;
//         } else { // user message
//             classes.push("user-message");
//             content += `<div class="message-text">${msg.content}</div>`;
//             if (msg.type === "image" && msg.fileData) {
//                 content += `<img src="data:${msg.mimeType};base64,${msg.fileData}" class="attachment" />`;
//             }
//         }
//         const messageDiv = createMessageElement(content, ...classes);
//         chatBody.appendChild(messageDiv);
//     });
//     chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
// };

// // Function to start a new chat
// const startNewChat = () => {
//     currentChatId = Date.now().toString(); // Unique ID for the new chat, as string
//     chatHistory.push({ id: currentChatId, messages: [], lastActive: Date.now() });
//     saveChatHistory();
//     renderChatHistory(); // Update the sidebar with the new chat
//     clearChatMessages(); // Clear the main chat window
//     createWelcomeMessage();
// };

// // Function to clear messages in the main chat window
// const clearChatMessages = () => {
//     chatBody.innerHTML = "";
//     userData.message = null;
//     userData.file = { data: null, mime_type: null }; // Reset properly
//     fileUploadWrapper.classList.remove("file-uploaded");
//     messageInput.value = "";
//     messageInput.style.height = `${initialInputHeight}px`;
//     document.querySelector(".chat-form").style.borderRadius = "32px";
// };

// const createMessageElement = (content, ...classes) => {
//     const div = document.createElement("div");
//     div.classList.add("message", ...classes);
//     div.innerHTML = content;
//     return div;
// };

// const createWelcomeMessage = () => {
//     const welcomeMessageContent = "Hey there 👋 <br> How can I help you today?";
//     const welcomeMessageHTML = `
//         <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
//             <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
//         </svg>
//         <div class="message-text">${welcomeMessageContent}</div>
//     `;
//     const welcomeDiv = createMessageElement(welcomeMessageHTML, "bot-message");
//     chatBody.appendChild(welcomeDiv);

//     const currentChat = chatHistory.find(chat => chat.id === currentChatId);
//     if (currentChat) {
//         currentChat.messages.push({ sender: "bot", type: "text", content: welcomeMessageContent });
//         currentChat.lastActive = Date.now();
//         saveChatHistory();
//         renderChatHistory(); // Update sidebar if open
//     }
// };

// // Generate bot response using API
// const generateBotResponse = async (incomingMessageDiv) => {
//     const messageElement = incomingMessageDiv.querySelector(".message-text");

//     const requestOptions = {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             contents: [{
//                 parts: [{ text: userData.message }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])]
//             }]
//         })
//     };

//     let botResponseText = "";
//     try {
//         const response = await fetch(API_URL, requestOptions);
//         const data = await response.json();
        
//         if (data.error) throw new Error(data.error.message);
//         if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
        
//         botResponseText = data.candidates[0]?.content?.parts[0]?.text.replace(/\*\*(.*?)\*\*/g, "$1").trim() || "Sorry, I couldn't process that.";
//         messageElement.innerText = botResponseText;

//     } catch (error) {
//         console.error("API Error:", error);
//         botResponseText = error.message || "Oops! Something went wrong. Please try again.";
//         messageElement.innerText = botResponseText;
//         messageElement.style.color = "#ff0000";

//     } finally {
//         const currentChat = chatHistory.find(chat => chat.id === currentChatId);
//         if (currentChat) {
//             currentChat.messages.push({ sender: "bot", type: "text", content: botResponseText });
//             currentChat.lastActive = Date.now();
//             saveChatHistory();
//             renderChatHistory(); // Update sidebar if open
//         }

//         userData.file = { data: null, mime_type: null }; // Reset file data
//         incomingMessageDiv.classList.remove("thinking");
//         chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
//     }
// };

// const handleOutgoingMessage = (e) => {
//     e.preventDefault();
//     userData.message = messageInput.value.trim();
//     if (!userData.message && !userData.file.data) return;

//     const currentChat = chatHistory.find(chat => chat.id === currentChatId);
//     if (currentChat) {
//         currentChat.messages.push({
//             sender: "user",
//             type: userData.file.data ? "image" : "text",
//             content: userData.message,
//             fileData: userData.file.data,
//             mimeType: userData.file.mime_type
//         });
//         currentChat.lastActive = Date.now();
//         saveChatHistory();
//         renderChatHistory(); // Update sidebar with new chat title and time
//     }

//     const userMessageContent = userData.message; // Store before reset

//     messageInput.value = "";
//     fileUploadWrapper.classList.remove("file-uploaded");
//     messageInput.dispatchEvent(new Event("input")); // To resize textarea

//     const messageHTML = `<div class="message-text"></div>
//                             ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;

//     const outgoingMessageDiv = createMessageElement(messageHTML, "user-message");
//     outgoingMessageDiv.querySelector(".message-text").textContent = userMessageContent; // Set text content separately
//     chatBody.appendChild(outgoingMessageDiv);
//     chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

//     // Clear userData.message for the bot request after it's displayed
//     // userData.message is already captured for the bot by being set at the top of this function.
//     // userData.file will be reset in generateBotResponse's finally block.

//     setTimeout(() => {
//         const thinkingMessageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
//                                             <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
//                                         </svg>
//                                         <div class="message-text">
//                                             <div class="thinking-indicator">
//                                                 <div class="dot"></div>
//                                                 <div class="dot"></div>
//                                                 <div class="dot"></div>
//                                             </div>
//                                         </div>`;
//         const incomingMessageDiv = createMessageElement(thinkingMessageContent, "bot-message", "thinking");
//         chatBody.appendChild(incomingMessageDiv);
//         chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

//         generateBotResponse(incomingMessageDiv);
//     }, 600);
// };

// messageInput.addEventListener("keydown", (e) => {
//     const userMessage = e.target.value.trim();
//     if (e.key === "Enter" && (userMessage || userData.file.data) && !e.shiftKey && window.innerWidth > 768) {
//         handleOutgoingMessage(e);
//     }
// });

// messageInput.addEventListener("input", () => {
//     messageInput.style.height = `${initialInputHeight}px`;
//     messageInput.style.height = `${messageInput.scrollHeight}px`;
//     document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight >
//         initialInputHeight ? "15px" : "32px";
// });

// fileInput.addEventListener("change", () => {
//     const file = fileInput.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//         fileUploadWrapper.querySelector("img").src = e.target.result;
//         fileUploadWrapper.classList.add("file-uploaded");
//         const base64String = e.target.result.split(",")[1];

//         userData.file = {
//             data: base64String,
//             mime_type: file.type
//         };
//         fileInput.value = ""; // Clear file input for next selection
//     };
//     reader.readAsDataURL(file);
// });

// fileCancelButton.addEventListener("click", () => {
//     userData.file = { data: null, mime_type: null };
//     fileUploadWrapper.classList.remove("file-uploaded");
//     fileInput.value = ""; // Clear file input value
// });

// const picker = new EmojiMart.Picker({
//     theme: "light",
//     skinTonePosition: "none",
//     previewPosition: "none",
//     onEmojiSelect: (emoji) => {
//         const { selectionStart: start, selectionEnd: end } = messageInput;
//         messageInput.setRangeText(emoji.native, start, end, "end");
//         messageInput.focus();
//         messageInput.dispatchEvent(new Event("input")); // Trigger input event for height adjustment
//     },
//     onClickOutside: (e) => {
//         if (e.target.id === "emoji-picker") {
//             document.body.classList.toggle("show-emoji-picker");
//         } else {
//             document.body.classList.remove("show-emoji-picker");
//         }
//     }
// });

// document.querySelector(".chat-form").appendChild(picker);

// sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
// document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());
// document.querySelector("#emoji-picker").addEventListener("click", (e) => {
//     e.stopPropagation(); // Prevent click outside event when clicking the picker button
//     document.body.classList.toggle("show-emoji-picker");
// });


// chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
// closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

// const menuToggler = document.querySelector("#menu-toggler");
// const dropdownMenu = document.querySelector(".dropdown-menu");

// menuToggler.addEventListener("click", (e) => {
//     e.stopPropagation();
//     dropdownMenu.classList.toggle("show");
// });

// document.addEventListener("click", (e) => {
//     if (!e.target.closest(".header-actions")) {
//         dropdownMenu.classList.remove("show");
//     }
//     // Close emoji picker if clicking outside of it and not on its toggle button
//     if (!e.target.closest("em-emoji-picker") && e.target.id !== "emoji-picker") {
//         document.body.classList.remove("show-emoji-picker");
//     }
// });

// chatHistoryButton.addEventListener("click", () => {
//     dropdownMenu.classList.remove("show");
//     document.body.classList.toggle("show-chat-history");
//     renderChatHistory(); // Render history when opening sidebar
// });

// closeHistoryButton.addEventListener("click", () => {
//     document.body.classList.remove("show-chat-history");
// });

// document.querySelector("#clear-chat").addEventListener("click", () => {
//     dropdownMenu.classList.remove("show");
//     const chatToClearId = currentChatId;
    
//     clearChatMessages(); // Clears UI
    
//     // Remove the current chat from history
//     chatHistory = chatHistory.filter(chat => chat.id !== chatToClearId);
//     saveChatHistory();
//     renderChatHistory(); // Update history sidebar
    
//     startNewChat(); // Start a brand new chat
// });

// document.querySelector("#new-chat").addEventListener("click", () => {
//     dropdownMenu.classList.remove("show");
//     startNewChat();
// });

// deleteAllHistoryButton.addEventListener("click", deleteAllHistory);

// // --- Voice Assistant Functionality ---
// const setupVoiceRecognition = () => {
//     if (!('webkitSpeechRecognition' in window)) {
//         console.warn("Speech Recognition not supported in this browser.");
//         voiceAssistButton.style.display = "none"; // Hide button if not supported
//         return;
//     }

//     recognition = new webkitSpeechRecognition();
//     recognition.continuous = false; // Listen for a single utterance
//     recognition.interimResults = true; // Get interim results
//     recognition.lang = 'en-US'; // Set language

//     recognition.onstart = () => {
//         isListening = true;
//         voiceAssistButton.classList.add("listening"); // Add a visual indicator
//         console.log("Voice recognition started.");
//     };

//     recognition.onresult = (event) => {
//         let interimTranscript = '';
//         let finalTranscript = '';

//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//             const transcript = event.results[i][0].transcript;
//             if (event.results[i].isFinal) {
//                 finalTranscript += transcript;
//             } else {
//                 interimTranscript += transcript;
//             }
//         }
//         messageInput.value = finalTranscript || interimTranscript;
//         messageInput.dispatchEvent(new Event("input")); // Adjust textarea height
//     };

//     recognition.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//         isListening = false;
//         voiceAssistButton.classList.remove("listening");
//         // Optionally, inform the user about the error
//         // alert(`Speech recognition error: ${event.error}. Please try again.`);
//     };

//     recognition.onend = () => {
//         isListening = false;
//         voiceAssistButton.classList.remove("listening");
//         console.log("Voice recognition ended.");
//         // If there's final text, automatically send it
//         if (messageInput.value.trim() !== "") {
//             handleOutgoingMessage(new Event("submit")); // Trigger send
//         }
//     };
// };

// voiceAssistButton.addEventListener("click", () => {
//     if (isListening) {
//         recognition.stop(); // Stop listening
//     } else {
//         messageInput.value = ""; // Clear previous input
//         messageInput.focus();
//         try {
//             recognition.start(); // Start listening
//         } catch (error) {
//             console.error("Error starting speech recognition:", error);
//             alert("Could not start voice assistant. Please check your microphone and browser permissions.");
//             voiceAssistButton.classList.remove("listening");
//             isListening = false;
//         }
//     }
// });

// // Initialize
// loadChatHistory();
// setupVoiceRecognition(); // Setup voice recognition on load

// if (chatHistory.length > 0) {
//     // Sort by lastActive to ensure we load the truly most recent chat
//     chatHistory.sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));
//     if (chatHistory[0]) { // Check if after sorting, there's still a chat
//       loadChat(chatHistory[0].id);
//     } else { // Should not happen if length > 0, but as a safeguard
//       startNewChat();
//     }
// } else {
//     startNewChat();  
// }
































//  with email name card before chat


const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");

const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");

const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

// New User Info Form elements
const userInfoPopup = document.querySelector(".user-info-popup");
const userInfoForm = document.querySelector("#user-info-form");
const userNameInput = document.querySelector("#user-name");
const userEmailInput = document.querySelector("#user-email");

// Chat History elements
const chatHistoryButton = document.querySelector("#chat-history");
const chatHistorySidebar = document.querySelector(".chat-history-sidebar");
const closeHistoryButton = document.querySelector("#close-history");
const historyList = document.querySelector(".history-list");
const deleteAllHistoryButton = document.querySelector("#delete-all-history");

// Voice Assist elements
const voiceAssistButton = document.querySelector("#voice-assist");

// API setup
const API_KEY = "AIzaSyCND8_k9nMfIrl8OhpVAYXoMGwh7dlR3Xs"; // Replace with your actual Gemini API Key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

let currentChatId = null;
let chatHistory = [];
// This variable will now persist user data for the session
let userInfo = null; 

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
};

const initialInputHeight = messageInput.scrollHeight;
let recognition;
let isListening = false;

// Function to save chat history to localStorage
const saveChatHistory = () => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
};

// Function to load chat history from localStorage
const loadChatHistory = () => {
    const savedHistory = localStorage.getItem("chatHistory");
    chatHistory = savedHistory ? JSON.parse(savedHistory) : [];
};

// Function to format chat timestamp
const formatChatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    if (isNaN(date.getTime())) return "";

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const targetDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (targetDateOnly.getTime() === today.getTime()) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (targetDateOnly.getTime() === yesterday.getTime()) {
        return "Yesterday";
    } else if (date.getTime() > oneWeekAgo.getTime()) {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
        return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    }
};

// Function to render chat history in the sidebar
const renderChatHistory = () => {
    historyList.innerHTML = "";
    const sortedHistory = [...chatHistory].sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));

    sortedHistory.forEach(chat => {
        const chatItem = document.createElement("li");
        chatItem.setAttribute("data-chat-id", chat.id);

        const firstUserMessage = chat.messages.find(msg => msg.sender === "user" && msg.type === "text");
        let chatTitleText = "New Chat";
        if (firstUserMessage) {
            chatTitleText = firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "");
        } else if (chat.messages.length > 0 && chat.messages[0].content) {
            chatTitleText = chat.messages[0].content.substring(0, 30) + (chat.messages[0].content.length > 30 ? "..." : "");
        }

        const chatTime = formatChatTimestamp(chat.lastActive);

        chatItem.innerHTML = `
            <div class="chat-history-item-content">
                <span class="chat-title">${chatTitleText}</span>
                <span class="chat-time">${chatTime}</span>
            </div>
            <button class="material-symbols-rounded delete-chat-item">delete</button>
        `;

        chatItem.addEventListener("click", (e) => {
            if (!e.target.closest(".delete-chat-item")) {
                loadChat(chat.id);
                document.body.classList.remove("show-chat-history");
            }
        });

        const deleteButton = chatItem.querySelector(".delete-chat-item");
        deleteButton.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteChat(chat.id);
        });

        historyList.appendChild(chatItem);
    });
};

const deleteChat = (idToDelete) => {
    chatHistory = chatHistory.filter(chat => chat.id !== idToDelete);
    saveChatHistory();
    renderChatHistory();
    if (currentChatId === idToDelete) {
        startNewChat();
    }
};

const deleteAllHistory = () => {
    if (confirm("Are you sure you want to delete all chat history? This action cannot be undone.")) {
        chatHistory = [];
        saveChatHistory();
        renderChatHistory();
        startNewChat();
    }
};

const loadChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) {
        startNewChat();
        return;
    }

    currentChatId = chatId;
    chatBody.innerHTML = "";
    chat.messages.forEach(msg => {
        let content = '';
        let classes = [];

        if (msg.sender === "bot") {
            classes.push("bot-message");
            content += `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg><div class="message-text">${msg.content}</div>`;
        } else {
            classes.push("user-message");
            content += `<div class="message-text">${msg.content}</div>`;
            if (msg.type === "image" && msg.fileData) {
                content += `<img src="data:${msg.mimeType};base64,${msg.fileData}" class="attachment" />`;
            }
        }
        const messageDiv = createMessageElement(content, ...classes);
        chatBody.appendChild(messageDiv);
    });
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
};

const startNewChat = () => {
    currentChatId = Date.now().toString();
    chatHistory.push({ id: currentChatId, messages: [], lastActive: Date.now() });
    saveChatHistory();
    renderChatHistory();
    clearChatMessages();
    createWelcomeMessage();
};

const clearChatMessages = () => {
    chatBody.innerHTML = "";
    userData.message = null;
    userData.file = { data: null, mime_type: null };
    fileUploadWrapper.classList.remove("file-uploaded");
    messageInput.value = "";
    messageInput.style.height = `${initialInputHeight}px`;
    document.querySelector(".chat-form").style.borderRadius = "32px";
};

const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

const createWelcomeMessage = () => {
    const welcomeMessageContent = "Hey there 👋 <br> How can I help you today?";
    const welcomeMessageHTML = `
        <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
        </svg>
        <div class="message-text">${welcomeMessageContent}</div>
    `;
    const welcomeDiv = createMessageElement(welcomeMessageHTML, "bot-message");
    chatBody.appendChild(welcomeDiv);

    const currentChat = chatHistory.find(chat => chat.id === currentChatId);
    if (currentChat && currentChat.messages.length === 0) { // Only add welcome message if it's a new chat
        currentChat.messages.push({ sender: "bot", type: "text", content: welcomeMessageContent });
        currentChat.lastActive = Date.now();
        saveChatHistory();
        renderChatHistory();
    }
};

const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");

    const requestBody = {
        contents: [{
            parts: [{ text: userData.message }]
        }]
    };

    if (userData.file.data) {
        requestBody.contents[0].parts.push({
            inline_data: {
                mime_type: userData.file.mime_type,
                data: userData.file.data
            }
        });
    }

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    };

    let botResponseText = "";
    try {
        const response = await fetch(API_URL, requestOptions);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || `API Error: ${response.status}`);
        }
        const data = await response.json();
        botResponseText = data.candidates[0]?.content?.parts[0]?.text.replace(/\*\*(.*?)\*\*/g, "$1").trim() || "Sorry, I couldn't process that.";
        messageElement.innerHTML = botResponseText;

    } catch (error) {
        console.error("API Error:", error);
        botResponseText = `Oops! Something went wrong: ${error.message}. Please check your API key and try again.`;
        messageElement.innerText = botResponseText;
        messageElement.style.color = "#ff0000";

    } finally {
        const currentChat = chatHistory.find(chat => chat.id === currentChatId);
        if (currentChat) {
            currentChat.messages.push({ sender: "bot", type: "text", content: botResponseText });
            currentChat.lastActive = Date.now();
            saveChatHistory();
            renderChatHistory();
        }

        userData.file = { data: null, mime_type: null };
        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }
};

const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    if (!userData.message && !userData.file.data) return;

    const currentChat = chatHistory.find(chat => chat.id === currentChatId);
    if (currentChat) {
        currentChat.messages.push({
            sender: "user",
            type: userData.file.data ? "image" : "text",
            content: userData.message,
            fileData: userData.file.data,
            mimeType: userData.file.mime_type
        });
        currentChat.lastActive = Date.now();
        saveChatHistory();
        renderChatHistory();
    }

    const userMessageContent = userData.message;
    const messageHTML = `<div class="message-text"></div>
                         ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;

    const outgoingMessageDiv = createMessageElement(messageHTML, "user-message");
    outgoingMessageDiv.querySelector(".message-text").textContent = userMessageContent;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    messageInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded");
    messageInput.dispatchEvent(new Event("input"));

    setTimeout(() => {
        const thinkingMessageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg>
                                        <div class="message-text">
                                            <div class="thinking-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
                                        </div>`;
        const incomingMessageDiv = createMessageElement(thinkingMessageContent, "bot-message", "thinking");
        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
        generateBotResponse(incomingMessageDiv);
    }, 600);
};

// --- EVENT LISTENERS ---

// Handle User Info Form Submission
userInfoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();

    if (!name || !email) {
        alert("Please fill in both name and email.");
        return;
    }

    // Store user info for the session
    userInfo = { name, email };

    // Hide form and show chat
    document.body.classList.remove("show-user-form");
    document.body.classList.add("show-chatbot");
    userNameInput.value = "";
    userEmailInput.value = "";
});


// CORRECTED: Chatbot Toggler Logic for single session login
chatbotToggler.addEventListener("click", () => {
    const isAnythingOpen = document.body.classList.contains("show-user-form") || document.body.classList.contains("show-chatbot");
    
    if (isAnythingOpen) {
        // If any popup is open, clicking the toggler will close it.
        document.body.classList.remove("show-user-form");
        document.body.classList.remove("show-chatbot");
    } else {
        // If no popups are open, decide which one to show.
        if (userInfo) {
            // If the user has already provided info in this session, show the chat directly.
            document.body.classList.add("show-chatbot");
        } else {
            // Otherwise, show the info form.
            document.body.classList.add("show-user-form");
        }
    }
});


// Close button inside the chatbot
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 768) {
        handleOutgoingMessage(e);
    }
});

messageInput.addEventListener("input", () => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");
        const base64String = e.target.result.split(",")[1];
        userData.file = { data: base64String, mime_type: file.type };
        fileInput.value = "";
    };
    reader.readAsDataURL(file);
});

fileCancelButton.addEventListener("click", () => {
    userData.file = { data: null, mime_type: null };
    fileUploadWrapper.classList.remove("file-uploaded");
    fileInput.value = "";
});

const picker = new EmojiMart.Picker({
    theme: "light",
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        const { selectionStart: start, selectionEnd: end } = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
        messageInput.dispatchEvent(new Event("input"));
    },
    onClickOutside: (e) => {
        if (e.target.id !== "emoji-picker") {
            document.body.classList.remove("show-emoji-picker");
        }
    }
});

document.querySelector(".chat-form").appendChild(picker);
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());
document.querySelector("#emoji-picker").addEventListener("click", (e) => {
    e.stopPropagation();
    document.body.classList.toggle("show-emoji-picker");
});

const menuToggler = document.querySelector("#menu-toggler");
const dropdownMenu = document.querySelector(".dropdown-menu");

menuToggler.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle("show");
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".header-actions")) {
        dropdownMenu.classList.remove("show");
    }
    if (!e.target.closest("em-emoji-picker") && e.target.id !== "emoji-picker") {
        document.body.classList.remove("show-emoji-picker");
    }
});

chatHistoryButton.addEventListener("click", () => {
    dropdownMenu.classList.remove("show");
    document.body.classList.toggle("show-chat-history");
    renderChatHistory();
});

closeHistoryButton.addEventListener("click", () => {
    document.body.classList.remove("show-chat-history");
});

document.querySelector("#clear-chat").addEventListener("click", () => {
    dropdownMenu.classList.remove("show");
    const chatToClearId = currentChatId;
    clearChatMessages();
    chatHistory = chatHistory.filter(chat => chat.id !== chatToClearId);
    saveChatHistory();
    renderChatHistory();
    startNewChat();
});

document.querySelector("#new-chat").addEventListener("click", () => {
    dropdownMenu.classList.remove("show");
    startNewChat();
});

deleteAllHistoryButton.addEventListener("click", deleteAllHistory);

// --- Voice Assistant Functionality ---
const setupVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
        console.warn("Speech Recognition not supported.");
        voiceAssistButton.style.display = "none";
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isListening = true;
        voiceAssistButton.classList.add("listening");
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        messageInput.value = finalTranscript || interimTranscript;
        messageInput.dispatchEvent(new Event("input"));
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        isListening = false;
        voiceAssistButton.classList.remove("listening");
    };

    recognition.onend = () => {
        isListening = false;
        voiceAssistButton.classList.remove("listening");
        if (messageInput.value.trim() !== "") {
            handleOutgoingMessage(new Event("submit"));
        }
    };
};

voiceAssistButton.addEventListener("click", () => {
    if (isListening) {
        recognition.stop();
    } else {
        messageInput.value = "";
        messageInput.focus();
        try {
            recognition.start();
        } catch (error) {
            console.error("Error starting speech recognition:", error);
            alert("Could not start voice assistant. Check permissions.");
        }
    }
});

// --- Initialize ---
loadChatHistory();
setupVoiceRecognition();

if (chatHistory.length > 0) {
    chatHistory.sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));
    if (chatHistory[0]) {
        loadChat(chatHistory[0].id);
    } else {
        startNewChat();
    }
} else {
    startNewChat();
}