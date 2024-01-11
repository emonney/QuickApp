// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

export declare let alertify: Alertify;

export interface Alertify {
  /**
   * Create an alert dialog box
   * @param message   The message passed from the callee
   * @param fn        Callback function
   * @param cssClass  Class(es) to append to dialog box
   * @return alertify (ie this)
   * @since 0.0.1
   */
  alert(message: string, callback?: (ok: boolean) => void, cssClass?: string): Alertify;

  /**
   * Create a confirm dialog box
   * @param message   The message passed from the callee
   * @param fn        Callback function
   * @param cssClass  Class(es) to append to dialog box
   * @return alertify (ie this)
   * @since 0.0.1
   */
  confirm(message: string, callback?: (ok: boolean) => void, cssClass?: string): Alertify;

  /**
   * Extend the log method to create custom methods
   * @param type  Custom method name
   * @return function for logging
   * @since 0.0.1
   */
  extend(type: string): (message: string, wait?: number) => Alertify;

  /**
   * Initialize Alertify and create the 2 main elements.
   * Initialization will happen automatically on the first
   * use of alert, confirm, prompt or log.
   * @since 0.0.1
   */
  init(): void;

  /**
   * Show a new log message box
   * @param message   The message passed from the callee
   * @param type      Optional type of log message
   * @param wait      Optional time (in ms) to wait before auto-hiding
   * @return alertify (ie this)
   * @since 0.0.1
   */
  log(message: string, type?: string, wait?: number): Alertify;

  /**
   * Create a prompt dialog box
   * @param message   The message passed from the callee
   * @param fn        Callback function
   * @param placeholder Default value for prompt input
   * @param cssClass  Class(es) to append to dialog
   * @return alertify (ie this)
   * @since 0.0.1
   */
  prompt(message: string, callback?: (ok: boolean, val: string) => void, placeholder?: string, cssClass?: string): Alertify;

  /**
   * Shorthand for log messages
   * @param message The message passed from the callee
   * @return alertify (ie this)
   * @since 0.0.1
   */
  success(message: string): Alertify;

  /**
   * Shorthand for log messages
   * @param message The message passed from the callee
   * @return alertify (ie this)
   * @since 0.0.1
   */
  error(message: string): Alertify;

  /**
   * Used to set alertify properties
   * @param Properties
   * @since 0.2.11
   */
  set(args: Properties): void;

  /**
   * The labels used for dialog buttons
   */
  labels: Labels;

  /**
   * Attaches alertify.error to window.onerror method
   * @since 0.3.8
   */
  debug(): void;
}

/**
 * Properties for alertify.set function
 */
export interface Properties {
  /** Default value for milliseconds display of log messages */
  delay?: number | undefined;

  /** Default values for display of labels */
  labels?: Labels | undefined;

  /** Default button for focus */
  buttonFocus?: string | undefined;

  /** Should buttons be displayed in reverse order */
  buttonReverse?: boolean | undefined;
}

/** Labels for altertify.set function */
export interface Labels {
  ok?: string | undefined;
  cancel?: string | undefined;
}

