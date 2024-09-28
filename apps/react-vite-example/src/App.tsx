import { useState, useCallback } from 'react'
import tsmailer from '@repo/tsmailer'

function App() {
  // State to manage input fields
  const [loading, setLoading] = useState(false)
  const [toEmails, setToEmails] = useState<string[]>([''])
  const [fromName, setFromName] = useState('tester')
  const [toName, setToName] = useState('testee')
  const [yourMessage, setYourMessage] = useState('testing!')
  const [apiKey, setApiKey] = useState('YOUR_API_KEY')
  const [providerId, setProviderId] = useState('YOUR_PROVIDER_ID')
  const [templateId, setTemplateId] = useState('YOUR_TEMPLATE_ID')

  // State to manage response data
  const [response, setResponse] = useState<string | null>(null)

  // Initialize tsmailer with predefined apiKey, providerId, and templateId
  const send = tsmailer.init({
    apiKey,
    providerId,
    templateId,
  })

  // Handle the email sending logic
  const handleSendMail = useCallback(() => {
    setLoading(true) // Set loading to true
    setResponse(null) // Reset response state
    send({
      to: toEmails.filter((email) => email.trim() !== ''), // Filter out empty emails
      options: {
        fromName,
        toName,
        yourMessage,
      },
    })
      .then((data) => {
        setResponse(JSON.stringify(data, null, 2)) // Store response data
      })
      .catch((error) => {
        console.error('Error sending email:', error)
        alert('Failed to send email.')
        setResponse(JSON.stringify(error, null, 2)) // Store error response
      })
      .finally(() => {
        setLoading(false) // Reset loading state after the operation
      })
  }, [send, toEmails, fromName, toName, yourMessage])

  // Function to handle adding a new email input field
  const handleAddEmail = () => {
    setToEmails([...toEmails, ''])
  }

  // Function to handle changing an email input field
  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...toEmails]
    newEmails[index] = value
    setToEmails(newEmails)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: '#333' }}>Test tsmailer</h1>

        {/* Multiple Email Inputs */}
        <h2 style={{ color: '#555' }}>Recipient Emails</h2>
        {toEmails.map((email, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <label>
              To Email {index + 1}:
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                required
                style={{
                  marginLeft: '10px',
                  padding: '5px',
                  borderRadius: '4px',
                }}
              />
            </label>
          </div>
        ))}
        <button
          onClick={handleAddEmail}
          style={{ marginBottom: '20px', padding: '10px', borderRadius: '4px' }}
        >
          Add Another Email
        </button>

        {/* Other Inputs */}
        <div style={{ marginBottom: '20px' }}>
          <label>
            From Name:
            <input
              type="text"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              required
              style={{
                marginLeft: '10px',
                padding: '5px',
                borderRadius: '4px',
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>
            To Name:
            <input
              type="text"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              required
              style={{
                marginLeft: '10px',
                padding: '5px',
                borderRadius: '4px',
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>
            Your Message:
            <textarea
              value={yourMessage}
              onChange={(e) => setYourMessage(e.target.value)}
              required
              style={{
                marginLeft: '10px',
                padding: '5px',
                borderRadius: '4px',
                width: '100%',
                height: '100px',
              }}
            />
          </label>
        </div>

        <h2 style={{ color: '#555' }}>API Configuration</h2>
        <div style={{ marginBottom: '20px' }}>
          <label>
            API Key:
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
              style={{
                marginLeft: '10px',
                padding: '5px',
                borderRadius: '4px',
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>
            Provider ID:
            <input
              type="text"
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              required
              style={{
                marginLeft: '10px',
                padding: '5px',
                borderRadius: '4px',
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>
            Template ID:
            <input
              type="text"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              required
              style={{
                marginLeft: '10px',
                padding: '5px',
                borderRadius: '4px',
              }}
            />
          </label>
        </div>

        <button
          onClick={handleSendMail}
          disabled={loading} // Disable button while loading
          style={{
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Sending...' : 'Send Email'}
        </button>
      </div>
      {/* Response Section */}
      {response && (
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#f0f0f0',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          <h3 style={{ color: '#333' }}>Response:</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{response}</pre>
        </div>
      )}
    </div>
  )
}

export default App
