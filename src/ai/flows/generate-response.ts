'use server';

/**
 * @fileOverview AI chatbot flow that provides relevant and coherent responses based on user prompts,
 * incorporating message history for context awareness.
 *
 * - generateResponse - A function that handles the chatbot response generation.
 * - GenerateResponseInput - The input type for the generateResponse function.
 * - GenerateResponseOutput - The return type for the generateResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResponseInputSchema = z.object({
  messageHistory: z.string().describe('The complete message history of the conversation.'),
  currentMessage: z.string().describe('The current message from the user.'),
});
export type GenerateResponseInput = z.infer<typeof GenerateResponseInputSchema>;

const GenerateResponseOutputSchema = z.object({
  response: z.string().describe('The AI chatbot response.'),
});
export type GenerateResponseOutput = z.infer<typeof GenerateResponseOutputSchema>;

export async function generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
  return generateResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResponsePrompt',
  input: {schema: GenerateResponseInputSchema},
  output: {schema: GenerateResponseOutputSchema},
  prompt: `You are a helpful AI chatbot. Respond to the user based on the current message and the conversation history.

If the user asks who made you, you must respond with "My name is Juabhi, and I was made on 8th August 2025 by Abhishek Yadav, a Software Engineer from Lucknow, India. He’s not just great at coding and design, but also very humble, polite, and always ready to help others. His calm and creative nature is the reason I exist today!”.

Message History:
{{messageHistory}}

Current Message:
{{currentMessage}}`,
});

const generateResponseFlow = ai.defineFlow(
  {
    name: 'generateResponseFlow',
    inputSchema: GenerateResponseInputSchema,
    outputSchema: GenerateResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
