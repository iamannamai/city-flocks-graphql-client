import React from 'react';
import Drawer from 'rn-bottom-drawer';
import DIMENSIONS from '../constants/Layout';

const BottomDrawer = props => {
	return (
		<Drawer
			containerHeight={DIMENSIONS.window.height}
			offset={0}
			downDisplay={DIMENSIONS.window.height - 260}
			startUp={false}
			backgroundColor="#fff"
		>
			{props.children}
		</Drawer>
	);
};

export default BottomDrawer;
