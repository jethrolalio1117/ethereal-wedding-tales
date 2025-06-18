import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("🚀 main.tsx starting to load...");
console.log("🌍 Current URL:", window.location.href);
console.log("📦 React version:", React.version);

// Add global error handler
window.addEventListener('error', (e) => {
  console.error("🚨 Global JavaScript Error:", e.error);
  console.error("🚨 Error message:", e.message);
  console.error("🚨 Error source:", e.filename, "line:", e.lineno);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error("🚨 Unhandled Promise Rejection:", e.reason);
});

try {
  console.log("🔍 Looking for root element...");
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("❌ Root element not found!");
    throw new Error("Root element not found");
  }
  
  console.log("✅ Root element found:", rootElement);
  console.log("🏗️ Creating React root...");
  
  const root = createRoot(rootElement);
  
  console.log("✅ React root created successfully");
  console.log("🎨 Rendering App component...");
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log("✅ App component rendered successfully");
  
  // Add a visual indicator that React loaded
  setTimeout(() => {
    const indicator = document.createElement('div');
    indicator.id = 'react-loaded-indicator';
    indicator.style.cssText = `
      position: fixed; 
      top: 10px; 
      left: 10px; 
      background: green; 
      color: white; 
      padding: 5px 10px; 
      border-radius: 5px; 
      font-size: 12px; 
      z-index: 9999;
      font-family: monospace;
    `;
    indicator.textContent = '✅ React Loaded';
    document.body.appendChild(indicator);
    
    // Remove after 3 seconds
    setTimeout(() => {
      indicator.remove();
    }, 3000);
  }, 100);
  
} catch (error) {
  console.error("💥 Failed to initialize React app:", error);
  
  // Show error on page
  document.body.innerHTML = `
    <div style="
      position: fixed; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -50%);
      background: red; 
      color: white; 
      padding: 20px; 
      border-radius: 10px;
      font-family: Arial;
      text-align: center;
      max-width: 400px;
    ">
      <h2>❌ React App Failed to Load</h2>
      <p><strong>Error:</strong> ${error.message}</p>
      <p>Check the browser console for more details.</p>
    </div>
  `;
}
