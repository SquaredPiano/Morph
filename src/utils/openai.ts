// Placeholder for OpenAI API integration
// TODO: Implement actual OpenAI API call
export async function getAIAnswer(_question: string, _apiKey: string): Promise<string> {
  return 'This is a placeholder answer from OpenAI.';
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    return response.ok
  } catch (error) {
    console.error('Error validating API key:', error)
    return false
  }
} 