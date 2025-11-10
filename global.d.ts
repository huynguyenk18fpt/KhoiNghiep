// global.d.ts
declare module '*.css';
declare module '*.scss';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

// Fallback declaration for Google Generative AI SDK if types are not present
declare module '@google/generative-ai' {
	// Minimal types used in the project; expand if needed.
	export class GoogleGenerativeAI {
		constructor(apiKey?: string);
		getGenerativeModel(opts: { model: string }): { generateContent(prompt: string): Promise<any> };
	}

	export default GoogleGenerativeAI;
}
