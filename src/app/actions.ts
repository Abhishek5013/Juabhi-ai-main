'use server';

import { generateResponse } from '@/ai/flows/generate-response';
import { login, signup, logout } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function getAiResponse(
  messageHistory: string,
  currentMessage: string
) {
  try {
    const result = await generateResponse({ messageHistory, currentMessage });
    if (result.response) {
      return { success: true, response: result.response };
    }
    return { success: false, error: 'Failed to get AI response.' };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function loginAction(
  prevState: { error: string | undefined },
  formData: FormData
) {
  try {
    const result = await login(formData);
    if (result.error) {
      return { error: result.error };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unexpected error occurred.' };
  }
  redirect('/');
}

export async function signupAction(
  prevState: { error: string | undefined },
  formData: FormData
) {
  try {
    const result = await signup(formData);
    if (result.error) {
      return { error: result.error };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unexpected error occurred.' };
  }
  redirect('/');
}

export async function logoutAction() {
  await logout();
  redirect('/login');
}
