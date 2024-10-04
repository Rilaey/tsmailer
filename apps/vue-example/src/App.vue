<template>
  <div class="wrapper">
    <div class="email-sender">
      <h1>Test tsmailer</h1>

      <!-- Multiple Email Inputs -->
      <h2>Recipient Emails</h2>
      <div v-for="(email, index) in toEmails" :key="index" class="email-input">
        <label>
          To Email {{ index + 1 }}:
          <input type="email" v-model="toEmails[index]" required />
        </label>
      </div>
      <button @click="handleAddEmail" class="add-email">Add Another Email</button>

      <!-- Other Inputs -->
      <div class="input-group">
        <label>
          From Name:
          <input type="text" v-model="fromName" required />
        </label>
      </div>

      <div class="input-group">
        <label>
          To Name:
          <input type="text" v-model="toName" required />
        </label>
      </div>

      <div class="input-group">
        <label>
          Your Message:
          <textarea v-model="yourMessage" required></textarea>
        </label>
      </div>

      <h2>API Configuration</h2>
      <div class="input-group">
        <label>
          API Key:
          <input type="text" v-model="apiKey" required />
        </label>
      </div>

      <div class="input-group">
        <label>
          Provider ID:
          <input type="text" v-model="providerId" required />
        </label>
      </div>

      <div class="input-group">
        <label>
          Template ID:
          <input type="text" v-model="templateId" required />
        </label>
      </div>

      <button @click="handleSendMail" :disabled="loading" class="send-button">
        <span v-if="loading">Sending...</span>
        <span v-else>Send Email</span>
      </button>


    </div>
    <!-- Display Response Data -->
    <div v-if="responseData" class="response-data">
      <h2>Email Status</h2>
      <pre>{{ JSON.stringify(responseData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import tsmailer from '@repo/tsmailer'

export default {
  setup() {
    // State to manage input fields
    const toEmails = ref<string[]>(['']) // Array for multiple recipient emails
    const fromName = ref('tester')
    const toName = ref('testee')
    const yourMessage = ref('test')
    const apiKey = ref('YOUR_API_KEY')
    const providerId = ref('YOUR_PROVIDER_ID')
    const templateId = ref('YOUR_TEMPLATE_ID')

    // State to hold the response data and loading state
    const responseData = ref<any>(null)
    const loading = ref(false)

    // Handle the email sending logic
    const handleSendMail = async () => {
      loading.value = true // Set loading state to true
      const send = tsmailer.init({
        apiKey: apiKey.value,
        providerId: providerId.value,
        templateId: templateId.value,
      })

      try {
        const data = await send({
          to: toEmails.value.filter(email => email.trim() !== ''), // Filter out empty emails
          options: {
            fromName: fromName.value,
            toName: toName.value,
            yourMessage: yourMessage.value,
          },
        })

        // Update responseData with the result from the API
        responseData.value = data
      } catch (error) {
        console.error('Error sending email:', error)
        // Optionally handle error feedback here
      } finally {
        loading.value = false // Reset loading state
      }
    }

    // Function to handle adding a new email input field
    const handleAddEmail = () => {
      toEmails.value.push('')
    }

    return {
      toEmails,
      fromName,
      toName,
      yourMessage,
      apiKey,
      providerId,
      templateId,
      handleSendMail,
      handleAddEmail,
      responseData,
      loading, // Expose loading state to the template
    }
  },
}
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.email-sender {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
}

.email-input {
  margin-bottom: 10px;
}

.send-button {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.add-email {
  margin-top: 10px;
}

.response-data {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
}
</style>
