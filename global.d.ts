// global.d.ts
declare module '*.css';
declare module '*.scss';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

type GoogleCredentialResponse = {
	credential?: string;
	select_by?: string;
	clientId?: string;
};

type GoogleIdInitializeOptions = {
	client_id: string;
	callback: (response: GoogleCredentialResponse) => void;
	auto_select?: boolean;
	cancel_on_tap_outside?: boolean;
};

type GoogleButtonOptions = {
	theme?: 'outline' | 'filled_blue' | 'filled_black';
	size?: 'large' | 'medium' | 'small';
	text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
	shape?: 'rectangular' | 'pill' | 'circle' | 'square';
	width?: string | number;
	logo_alignment?: 'left' | 'center';
};

interface Window {
	google?: {
		accounts: {
			id: {
				initialize(options: GoogleIdInitializeOptions): void;
				renderButton(parent: HTMLElement, options: GoogleButtonOptions): void;
				prompt(): void;
				disableAutoSelect(): void;
			};
		};
	};
}

// Fallback declaration for Google Generative AI SDK if types are not present
declare module '@google/generative-ai' {
	// Minimal types used in the project; expand if needed.
	export class GoogleGenerativeAI {
		constructor(apiKey?: string);
		getGenerativeModel(opts: { model: string }): { generateContent(prompt: string): Promise<any> };
	}

	export default GoogleGenerativeAI;
}
