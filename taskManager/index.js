import { TaskManager } from 'expo';
import { Alert } from 'react-native';
import store from '../store';

TaskManager.defineTask('geofence', ({data, error}) => {
  if (error) return;
  console.log(data);

  const { eventType } = data;
  if (eventType === Location.GeofencingEventType.Enter) {

    let state = store.getState();

    Alert.alert(
      `You found it!`,
      `Entered ${state.game.tasks.filter(task => task.id === data.region.identifier)[0].name}`,
      [{
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      }],
      { cancelable: true }
    );
    // insert thunk here that takes identifier (event id);
  }
  // else if (eventType === Location.GeofencingEventType.Exit) {

  // }
});

export default TaskManager;
