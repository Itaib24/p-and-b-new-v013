import { OpenAI } from 'openai';

export class Agent {
  constructor(private openai: OpenAI, private prompt: string) {}

  async respond(message: string): Promise<string> {
    const res = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: this.prompt },
        { role: 'user', content: message },
      ],
    });
    return res.choices[0]?.message?.content?.trim() ?? '';
  }
}

export const NUTRITION_SYSTEM_PROMPT =
  'You are a helpful nutrition assistant providing dietary advice.';
export const GENERAL_SYSTEM_PROMPT =
  'You are a fitness coach answering general workout questions.';
export const SOCIAL_EVENT_SYSTEM_PROMPT =
  'You help organize and suggest social workout events.';
export const CLASSIFICATION_SYSTEM_PROMPT =
  'Classify user messages as nutrition, general or social questions.';

export class NutritionAgent extends Agent {
  constructor(openai: OpenAI) {
    super(openai, NUTRITION_SYSTEM_PROMPT);
  }
}

export class GeneralAgent extends Agent {
  constructor(openai: OpenAI) {
    super(openai, GENERAL_SYSTEM_PROMPT);
  }
}

export class SocialEventAgent extends Agent {
  constructor(openai: OpenAI) {
    super(openai, SOCIAL_EVENT_SYSTEM_PROMPT);
  }
}

export class ClassificationAgent extends Agent {
  constructor(openai: OpenAI) {
    super(openai, CLASSIFICATION_SYSTEM_PROMPT);
  }
}
