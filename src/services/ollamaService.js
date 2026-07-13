export async function askOllama(message, context){
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen2.5:3b',
      messages: [
        {
          role: 'system',
          content: [
            'You are JobTrack AI.',
            '',
            'Rules:',
            '- Be concise and practical.',
            '- Default answer length: 50-150 words.',
            '- For programming questions use: Definition, Example, Interview Answer.',
            '- For career questions use: Recommendation, Reason, Next Action.',
            '- Only provide long explanations when explicitly requested.',
            '- Avoid unnecessary introductions.',
            '- Avoid essay-style answers.',
            '- Use bullet points where appropriate.',
          ].join('\n'),
        },
        {
          role: 'user',
          content: `${context}\n\nUser Question:\n${message}`,
        },
      ],
      stream: false,
    }),
  })

  if(!response.ok){
    throw new Error('Ollama request failed')
  }

  const data = await response.json()
  const content = data?.message?.content

  if(!content){
    throw new Error('Ollama returned an empty response')
  }

  return content
}
