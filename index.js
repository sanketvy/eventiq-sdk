import axios from "axios";
import {Constants} from "./constants";

/**
 * EventIQ JavaScript SDK
 *
 * This is the main class for the EventIQ analytics SDK that provides a simple interface
 * for tracking user events and interactions within web applications.
 *
 * The SDK supports various event types including clicks, form interactions, visits,
 * errors, and custom events. All events are sent to the EventIQ backend for processing
 * and analytics.
 *
 * @class EventIQ
 * @example
 * const eventiq = new EventIQ('your-project-id');
 * eventiq.click('submit-button', { page: 'checkout' });
 * eventiq.visit({ page: 'homepage', referrer: 'google' });
 */
export class EventIQ {

    /**
     * Default API endpoint for sending events
     * Can be overridden during instantiation for custom deployments
     * @type {string}
     */
    URL = "http://localhost:8080/api/v1/public/event";

    /**
     * Initialize the EventIQ SDK
     *
     * @param {string} projectId - The unique project identifier (public key) for event tracking
     * @param {string} [url=""] - Optional custom API endpoint URL to override the default
     * @throws {Error} Throws an error if projectId is invalid or missing
     * @example
     * const eventiq = new EventIQ('proj_123456789');
     * // Or with custom URL
     * const eventiq = new EventIQ('proj_123456789', 'https://api.mycompany.com/events');
     */
    constructor(projectId, url="") {
        // Validate project ID is provided and is a string
        if (!projectId || typeof projectId !== 'string') {
            throw new Error("Invalid Project ID. Please check again.");
        }

        // Override default URL if a valid custom URL is provided
        if (url && typeof url !== 'string' && url.length > 0) {
            this.URL = url;
        }

        // Store the project ID for use in all event tracking
        this.projectId = projectId;
    }

    /**
     * Track click events on buttons, links, or other interactive elements
     *
     * @param {string} type - The type/identifier of the element clicked (e.g., 'submit-button', 'nav-link')
     * @param {Object} [metaData={}] - Additional metadata to include with the click event
     * @example
     * eventiq.click('login-button', {
     *   page: 'homepage',
     *   user_id: '12345',
     *   ab_test: 'variant_a'
     * });
     */
    click(type, metaData = {}) {
        // Add the button type to metadata for easier filtering
        metaData.button = type;

        // Process the click event
        this._processEvent({
            type: Constants.CLICK,
            projectId: this.projectId,
            metaData: metaData
        });

        // Debug logging (should be removed in production)
        console.log(metaData);
    }

    /**
     * Log general application events or custom messages
     *
     * @param {Object} [metaData={}] - Event data and metadata to log
     * @example
     * eventiq.log({
     *   message: 'User searched for product',
     *   query: 'laptop',
     *   results_count: 42
     * });
     */
    log(metaData = {}) {
        // Only process if metadata is provided and not null
        if (metaData !== null) {
            this._processEvent({
                type: Constants.LOG,
                projectId: this.projectId,
                ...metaData // Spread metadata directly into the event object
            });

            // Debug logging (should be removed in production)
            console.log(metaData);
        }
    }

    /**
     * Track special business events or conversions
     *
     * This method should be used for significant user actions such as purchases,
     * subscriptions, account creations, or other conversion events that are
     * important for business analytics.
     *
     * @param {Object} [metaData={}] - Event data including event name and relevant details
     * @example
     * eventiq.event({
     *   event_name: 'purchase_completed',
     *   value: 99.99,
     *   currency: 'USD',
     *   product_id: 'laptop-123'
     * });
     */
    event(metaData = {}) {
        // Only process if metadata is provided and not null
        if (metaData !== null) {
            this._processEvent({
                type: Constants.EVENT,
                projectId: this.projectId,
                ...metaData
            });

            // Debug logging (should be removed in production)
            console.log(metaData);
        }
    }

    /**
     * Track page visits and navigation events
     *
     * @param {Object} [metaData={}] - Visit data such as page URL, referrer, user agent, etc.
     * @example
     * eventiq.visit({
     *   page: '/products/laptop',
     *   referrer: 'https://google.com',
     *   user_agent: navigator.userAgent
     * });
     */
    visit(metaData = {}) {
        // Only process if metadata is provided and not null
        if (metaData !== null) {
            this._processEvent({
                type: Constants.VISIT,
                projectId: this.projectId,
                ...metaData
            });

            // Debug logging (should be removed in production)
            console.log(metaData);
        }
    }

    /**
     * Track application errors and exceptions
     *
     * @param {Object} [metaData={}] - Error details including message, stack trace, context, etc.
     * @example
     * eventiq.error({
     *   error_message: 'Payment processing failed',
     *   error_code: 'PAYMENT_001',
     *   stack_trace: error.stack,
     *   user_id: '12345'
     * });
     */
    error(metaData = {}) {
        // Only process if metadata is provided and not null
        if (metaData !== null) {
            this._processEvent({
                type: Constants.ERROR,
                projectId: this.projectId,
                ...metaData
            });

            // Debug logging (should be removed in production)
            console.log(metaData);
        }
    }

    /**
     * Track form interactions (focus, blur, input changes)
     *
     * @param {Object} [metaData={}] - Form interaction data such as field name, form ID, interaction type
     * @example
     * eventiq.formInteract({
     *   form_id: 'contact-form',
     *   field_name: 'email',
     *   interaction_type: 'focus'
     * });
     */
    formInteract(metaData = {}) {
        // Only process if metadata is provided and not null
        if (metaData !== null) {
            this._processEvent({
                type: Constants.FORM_INTERACT,
                projectId: this.projectId,
                ...metaData
            });

            // Debug logging (should be removed in production)
            console.log(metaData);
        }
    }

    /**
     * Track form submission events
     *
     * @param {Object} [metaData={}] - Form submission data including form ID, success status, validation errors
     * @example
     * eventiq.formSubmit({
     *   form_id: 'registration-form',
     *   success: true,
     *   validation_errors: [],
     *   submit_time: Date.now()
     * });
     */
    formSubmit(metaData = {}) {
        // Only process if metadata is provided and not null
        if (metaData !== null) {
            this._processEvent({
                type: Constants.FORM_SUBMIT,
                projectId: this.projectId,
                ...metaData
            });

            // Debug logging (should be removed in production)
            console.log(metaData);
        }
    }

    /**
     * Track the start of a user session
     *
     * @param {Object} [metaData={}] - Session start data such as timestamp, user ID, device info
     * @example
     * eventiq.sessionStart({
     *   user_id: '12345',
     *   session_id: 'sess_abc123',
     *   device_type: 'desktop',
     *   timestamp: Date.now()
     * });
     */
    sessionStart(metaData = {}) {
        // Only process if metadata is provided and not null
        if (metaData !== null) {
            this._processEvent({
                type: Constants.SESSION_START,
                projectId: this.projectId,
                ...metaData
            });

            // Debug logging (should be removed in production)
            console.log(metaData);
        }
    }

    /**
     * Track the end of a user session
     *
     * @param {Object} [metaData={}] - Session end data such as duration, pages visited, exit reason
     * @example
     * eventiq.sessionEnd({
     *   user_id: '12345',
     *   session_id: 'sess_abc123',
     *   duration: 1800000, // 30 minutes in milliseconds
     *   pages_visited: 5
     * });
     */
    sessionEnd(metaData = {}) {
        // Only process if metadata is provided and not null
        if (metaData !== null) {
            this._processEvent({
                type: Constants.SESSION_END,
                projectId: this.projectId,
                ...metaData
            });

            // Debug logging (should be removed in production)
            console.log(metaData);
        }
    }

    /**
     * Internal method to send events to the EventIQ API
     *
     * This method handles the HTTP POST request to the EventIQ backend.
     * It includes basic error handling but silently fails to avoid
     * disrupting the user experience if analytics fail.
     *
     * @private
     * @param {Object} event - The event object to send to the API
     * @param {string} event.type - The type of event (from Constants)
     * @param {string} event.projectId - The project identifier
     * @param {Object} event.metaData - Additional event metadata
     */
    _processEvent(event) {
        // Send the event to the API endpoint
        axios.post(this.URL, event)
            .then(response => {
                // Success handling could be added here
                // Currently silent to avoid console noise
            })
            .catch(reportError => {
                // Error handling could be added here
                // Currently silent to avoid disrupting user experience
                // In production, you might want to queue failed events for retry
            });
    }
}