// Favico.js service for showing notification count on browser favicon
// @ts-expect-error - favico.js doesn't have typescript definitions
import Favico from "favico.js";

class FaviconService {
  private favicon: typeof Favico | null = null;
  private isInitialized = false;

  /**
   * Initialize the favicon service
   */
  init() {
    if (this.isInitialized || typeof window === "undefined") return;

    try {
      this.favicon = new Favico({
        animation: "pop",
        bgColor: "#ff3b30", // Red background like iOS
        textColor: "#ffffff",
        position: "up", // Top right position
        type: "circle",
      });
      this.isInitialized = true;
      console.log("✅ Favicon service initialized");
    } catch (error) {
      console.error("Failed to initialize favicon service:", error);
    }
  }

  /**
   * Set badge count on favicon
   * @param count - Number to display (0 to clear)
   */
  setBadge(count: number) {
    if (!this.favicon) {
      this.init();
    }

    if (this.favicon) {
      if (count > 0) {
        this.favicon.badge(count > 99 ? "99+" : count);
      } else {
        this.favicon.reset();
      }
    }
  }

  /**
   * Reset/clear the favicon badge
   */
  reset() {
    if (this.favicon) {
      this.favicon.reset();
    }
  }
}

// Export singleton instance
export const faviconService = new FaviconService();
