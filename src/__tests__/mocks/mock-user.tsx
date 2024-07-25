import React from 'react';
import { proxZ, useSnapshot } from '../../index';

const obj = { name: { first: 'John', last: 'Doe' } };
const state = proxZ(obj);

const MockUser = () => {
	const snap = useSnapshot(state.name);

	return (
		<div>
			{snap.first} {snap.last}
			<button onClick={() => (snap.first = 'Jane')}>Change name</button>
		</div>
	);
};

export default MockUser;
