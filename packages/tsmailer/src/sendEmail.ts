let fetchFn: (input: RequestInfo, init?: RequestInit) => Promise<Response>

/**
 * Initializes the `fetchFn` depending on the environment.
 *
 * If running in a browser, it uses the native `fetch` function.
 * If running in a Node.js environment, it imports `node-fetch`.
 *
 * @returns {Promise<void>} A promise that resolves once the fetch function is initialized.
 */
async function initializeFetchFn() {
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    // Use browser's native fetch
    fetchFn = window.fetch.bind(window)
  } else {
    // Use node-fetch in Node.js environments
    const nodeFetch = await import('node-fetch')

    fetchFn = (nodeFetch.default as unknown) as (
      input: RequestInfo,
      init?: RequestInit,
    ) => Promise<Response>
  }
}

/**
 * Interface representing dynamic variables to be injected into the email template.
 *
 * @property {string} toName - The recipient's name.
 * @property {string} fromName - The sender's name.
 * @property {string} yourMessage - The message to be included in the email.
 */
interface IDynamicEmailVariables {
  toName: string
  fromName: string
  yourMessage: string
}

/**
 * Initializes the email client with common parameters.
 *
 * @param {object} initParams - The initialization parameters.
 * @param {string} initParams.templateId - The email template to use.
 * @param {string} initParams.apiKey - The API key used for authentication.
 * @param {string} initParams.providerId - The email provider ID.
 *
 * @returns {Function} - A specialized sendEmail function that uses the initialized parameters.
 *
 * @example
 * // Initialize the email client
 * const send = tsmailer.init({
 *   apiKey: 'your-api-key',
 *   providerId: 'your-provider-id',
 *   templateId:  'template-id',
 * });
 *
 * // Use the `send` function to send an email
 * send({
 *   to: ['recipient@example.com'],
 *   options: {
 *     toName: 'John Doe',
 *     fromName: 'Your Company',
 *     yourMessage: 'This is a welcome message.',
 *   }
 * });
 */
function initEmailClient(initParams: {
  templateId: string
  apiKey: string
  providerId: string
}) {
  const { apiKey, providerId, templateId } = initParams

  /**
   * Sends an email using the initialized client parameters.
   *
   * @param {ISendEmailParams} params - Parameters for sending the email.
   * @returns {Promise<any>} - A promise resolving to the response of the email-sending API.
   *
   * @example
   * send({
   *   to: ['recipient@example.com'],
   *   options: {
   *     toName: 'John Doe',
   *     fromName: 'Your Company',
   *     yourMessage: 'This is a welcome message.',
   *   }
   * });
   */
  return async function sendEmail(params: {
    to: string[]
    options?: IDynamicEmailVariables
  }): Promise<any> {
    await initializeFetchFn() // Initialize fetch before using it

    const { to, options } = params

    return fetchFn('http://localhost:8083/api/sendEmail', {
      method: 'POST',
      body: JSON.stringify({
        to,
        templateId,
        apiKey,
        providerId,
        options,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        return json
      })
      .catch((err) => {
        return err
      })
  }
}

// Export the `init` method under the `tsmailer` namespace
const tsmailer = {
  init: initEmailClient,
}

export default tsmailer
