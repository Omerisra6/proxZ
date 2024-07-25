import React from 'react'; // Import React
import { describe, expect, it } from 'vitest';
import { proxZ } from '../index';
import { act, render } from '@testing-library/react';
import MockUser from './mocks/mock-user';

describe('proxZ', () => {
	describe('proxZ function', () => {
		it('should update the proxy when a property is changed', () => {
			// Arrange
			const obj = { count: 1 };
			const state = proxZ(obj);

			// Act
			state.count++;

			// Assert
			expect(state.count).toBe(2);
		});

		it('should update the proxy when a deconstructed object is changed', () => {
			// Arrange
			const obj = { user: { name: 'John' } };
			const state = proxZ(obj);

			// Act
			const { user } = state;
			user.name = 'Jane';

			// Assert
			expect(state.user.name).toBe('Jane');
		});
	});

	describe('useSnapshot function', () => {
		it('should rerender the component when the proxy is updated', () => {
			// Act
			const { getByText } = render(<MockUser />);
			const button = getByText('Change name');

			act(() => {
				button.click();
			});

			// Assert
			expect(getByText('Jane Doe')).toBeTruthy();
		});
	});
});
