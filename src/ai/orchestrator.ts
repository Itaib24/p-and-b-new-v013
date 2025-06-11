import { OpenAI } from 'openai';
import {
  ClassificationAgent,
  GeneralAgent,
  NutritionAgent,
  SocialEventAgent,
} from './agents.ts';

export class FitnessOrchestrator {
  private openai: OpenAI;
  private classifier: ClassificationAgent;
  private nutrition: NutritionAgent;
  private general: GeneralAgent;
  private social: SocialEventAgent;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
    this.classifier = new ClassificationAgent(this.openai);
    this.nutrition = new NutritionAgent(this.openai);
    this.general = new GeneralAgent(this.openai);
    this.social = new SocialEventAgent(this.openai);
  }

  async process(message: string): Promise<string> {
    const category = await this.classify(message);
    switch (category) {
      case 'nutrition':
        return this.nutrition.respond(message);
      case 'social':
        return this.social.respond(message);
      default:
        return this.general.respond(message);
    }
  }

  private async classify(text: string): Promise<'nutrition' | 'general' | 'social'> {
    const answer = await this.classifier.respond(
      `${text}\nRespond with one word: nutrition, general, or social.`,
    );
    if (/nutrition/i.test(answer)) return 'nutrition';
    if (/social/i.test(answer)) return 'social';
    return 'general';
  }
}

const orchestrator = new FitnessOrchestrator(process.env.OPENAI_API_KEY ?? '');

export async function processUserMessage(message: string): Promise<string> {
  return orchestrator.process(message);
}
