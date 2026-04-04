/**
 * Base Tool class for the strategy pattern
 * Defines the interface for tool behavior
 */
export class Tool {
  /**
   * Called when a mouse button is pressed
   * @param {Object} state - The editor state
   * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
   */
  onMouseDown(state, button) {}

  /**
   * Called when the mouse moves
   * @param {Object} state - The editor state
   */
  onMouseMove(state) {}

  /**
   * Called when a mouse button is released
   * @param {Object} state - The editor state
   * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
   */
  onMouseUp(state, button) {}

  /**
   * Called when a key is pressed
   * @param {Object} state - The editor state
   * @param {string} key - The key that was pressed
   */
  onKeyDown(state, key) {}

  /**
   * Called when a key is released
   * @param {Object} state - The editor state
   * @param {string} key - The key that was released
   */
  onKeyUp(state, key) {}

  /**
   * Called when this tool becomes active
   * @param {Object} state - The editor state
   */
  onEnter(state) {}

  /**
   * Called when this tool becomes inactive
   * @param {Object} state - The editor state
   */
  onExit(state) {}

  /**
   * Get the name of this tool (for debugging/UI purposes)
   * @return {string} The name of the tool
   */
  getName() {}
}