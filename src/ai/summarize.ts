import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '' });

export async function summarizeText(text: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'Summarize the following text briefly.' },
      { role: 'user', content: text },
    ],
  });
  return completion.choices[0]?.message?.content?.trim() ?? '';
}
