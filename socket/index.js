import io from 'socket.io-client';
import { BASE_URL } from '../constants/constants';

const socket = io(BASE_URL);

socket.on('connect', () => {
  console.log(`Connection to ${BASE_URL} established`);
});


export default socket;
