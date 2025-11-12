import { StrictMode } from "react"; // <-- Nên dùng StrictMode
import { createRoot } from "react-dom/client";
import "./assets/css/common/reset.css";
import "./assets/css/common/index.css"; // <-- File này phải chứa CSS variables
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// 1. Import ThemeProvider từ file context của bạn
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
// (Hãy đảm bảo đường dẫn "./contexts/ThemeContext" là chính xác)

createRoot(document.getElementById("root")).render(
  // 2. Thêm StrictMode (khuyến khích)
  <StrictMode>
    {/* 3. Bọc ThemeProvider ở bên ngoài cùng */}
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);