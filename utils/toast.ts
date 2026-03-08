import "../styles/toast.css";

type ToastType = "success" | "error" | "info";

export const showToast = (
  message: string,
  type: ToastType = "info",
  duration?: number
) => {
  // Create container if not exists
  let container = document.getElementById("customToastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "customToastContainer";
    document.body.appendChild(container);
  }

  // Toast element
  const toast = document.createElement("div");
  toast.className = `custom-toast ${type}`;

  // Icon (left only)
  const icon = type === "success" ? "✔" : type === "error" ? "✖" : "ℹ";
  const iconEl = document.createElement("div");
  iconEl.className = "toast-icon";
  iconEl.textContent = icon;

  // Text
  const textEl = document.createElement("div");
  textEl.className = "toast-text";
  textEl.textContent = message;

  toast.appendChild(iconEl);
  toast.appendChild(textEl);

  container.appendChild(toast);

  
};
