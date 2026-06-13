/**
 * LocalStorage utility for persisting analysis history.
 * Handles save, load, clear operations with error handling.
 */

const STORAGE_KEY = 'acnevision_history';
const MAX_HISTORY_ITEMS = 50;

/**
 * Load analysis history from localStorage.
 * 
 * @returns {Array} Array of past analysis results.
 */
export function loadHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

/**
 * Save a new analysis result to history.
 * 
 * @param {Object} result - The analysis result to save.
 * @param {string} result.predicted_class - The predicted severity class.
 * @param {number} result.confidence - The confidence percentage.
 * @param {string} result.imageName - The original file name.
 * @param {string} result.imagePreview - Base64 thumbnail of the image.
 */
export function saveToHistory(result) {
  try {
    const history = loadHistory();
    
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      timestamp: new Date().toISOString(),
      predicted_class: result.predicted_class,
      confidence: result.confidence,
      severity_index: result.severity_index,
      imageName: result.imageName || 'Unknown',
      imagePreview: result.imagePreview || null,
    };
    
    // Add to beginning (most recent first) and cap at max items
    history.unshift(entry);
    if (history.length > MAX_HISTORY_ITEMS) {
      history.pop();
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return entry;
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

/**
 * Clear all analysis history.
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

/**
 * Delete a specific history entry by ID.
 * 
 * @param {string} id - The entry ID to delete.
 */
export function deleteHistoryEntry(id) {
  try {
    const history = loadHistory();
    const filtered = history.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Failed to delete history entry:', error);
    return loadHistory();
  }
}

/**
 * Create a thumbnail preview from a File object.
 * 
 * @param {File} file - The image file.
 * @param {number} maxSize - Maximum dimension for the thumbnail.
 * @returns {Promise<string>} Base64 encoded thumbnail.
 */
export function createThumbnail(file, maxSize = 80) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
