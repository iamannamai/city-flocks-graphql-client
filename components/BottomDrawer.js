import React from 'react';
import Drawer from 'rn-bottom-drawer';

const BottomDrawer = props => {
	return (
		<Drawer
			containerHeight={800}
			offset={0}
			downDisplay={700}
			startUp={false}
			backgroundColor="#fff"	
		>
			{props.children}
		</Drawer>
	);
};

export default BottomDrawer;
