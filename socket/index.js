import socket from './socket';
import { BASE_URL } from '../constants/constants';

socket.on('connect', () => {
  console.log(`Connection to ${BASE_URL} established`);
});

export default socket;
export * from './listeners';
export * from './emitters';
