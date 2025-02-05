import {JsonValue} from '@croct/plug/sdk/json';
import {EvaluationOptions} from '@croct/sdk/facade/evaluatorFacade';
import {useSuspense} from './useSuspense';
import {useCroct} from './useCroct';

function cleanEvaluationOptions(options: EvaluationOptions): EvaluationOptions {
    const result: EvaluationOptions = {};

    for (const [key, value] of Object.entries(options)) {
        if (value !== undefined) {
            result[key] = value;
        }
    }

    return result;
}

export type UseEvaluationOptions<T extends JsonValue> = EvaluationOptions & {
    fallback?: T,
    cacheKey?: string,
    expiration?: number,
};

export function useEvaluation<T extends JsonValue>(expression: string, options: UseEvaluationOptions<T> = {}): T {
    const {cacheKey, fallback, expiration, ...evaluationOptions} = options;
    const croct = useCroct();

    return useSuspense({
        cacheKey: `useEvaluation:${cacheKey ?? ''}:${expression}:${JSON.stringify(options.attributes ?? '')}`,
        loader: () => croct.evaluate<T>(expression, cleanEvaluationOptions(evaluationOptions)),
        fallback: fallback,
        expiration: expiration,
    });
}
