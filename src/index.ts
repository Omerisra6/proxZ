import { useEffect, useReducer } from 'react';

const hasProxySymbol = Symbol('hasProxy');
const subscribersSymbol = Symbol('subscribers');

export const proxzy = <T extends Record<string, any>>(target: T) => {
	return new Proxy<T>(target, handler);
};

const subscribe = (
	proxy: Record<string | symbol, any>,
	callback: (updated: Record<string, any>) => void,
) => {
	proxy[subscribersSymbol].add(callback);

	return () => {
		proxy[subscribersSymbol].delete(callback);
	};
};

export const useSnapshot = <T extends object>(proxy: T) => {
	const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

	const set = () => {
		forceUpdate();
	};

	useEffect(() => subscribe(proxy, set), [proxy]);

	return proxy;
};

const handler = {
	get: (target: Record<string | symbol, any>, prop: string | symbol) => {
		if (prop === hasProxySymbol || prop === subscribersSymbol) {
			return Reflect.get(target, prop);
		}

		if (
			!!target[prop] &&
			typeof target[prop] === 'object' &&
			!(hasProxySymbol in target[prop])
		) {
			target[prop][hasProxySymbol] = true;
			target[prop][subscribersSymbol] = new Set();

			const innerProxy = new Proxy<Record<string, any>>(
				target[prop] as Record<string, any>,
				handler,
			);

			target[prop] = innerProxy;

			return innerProxy;
		}

		return Reflect.get(target, prop);
	},
	set: (target: Record<string, any>, prop: string, value: unknown) => {
		Reflect.set(target, prop, value);

		if (!target[prop]) {
			return true;
		}

		Reflect.get(target, subscribersSymbol)?.forEach((cb: () => void) => {
			cb();
		});

		return true;
	},
};
