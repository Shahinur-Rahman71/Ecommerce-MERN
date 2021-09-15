import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'


export const showNotifications = (title, message, type) => {
    store.addNotification({
        title,
        message,
        type,
        insert: "top",
        container: "top-center",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 8000,
          onScreen: true,
          showIcon: true
        }
    });
};

// export default Notifications;