declare module '@codemonster-ru/floater.js' {
    export type Placement = string;

    export type Middleware = unknown;
    export type MiddlewareFactory = (options?: Record<string, unknown>) => Middleware;

    export function computePosition(
        reference: HTMLElement,
        floating: HTMLElement,
        options?: {
            placement?: Placement;
            strategy?: 'absolute' | 'fixed';
            middleware?: Array<Middleware>;
        },
    ): Promise<{ x: number; y: number; placement?: string }>;

    export function autoUpdate(reference: HTMLElement, update: () => void): () => void;

    export const offset: (value?: number) => Middleware;
    export const flip: MiddlewareFactory;
    export const shift: MiddlewareFactory;
}
