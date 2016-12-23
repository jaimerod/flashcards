'use strict';

class Notifier {
  constructor () {
    this.getPermission();
  }

  hasPermission() {
    return new Promise((resolve, reject) => {
      if (Notification.permission === "granted") {
        resolve();
      } else {
        this.getPermission().then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      }
    });
  }

  getPermission() {
    return new Promise((resolve, reject) => {
      if (!window.Notification) {
        reject('could not get permission.');
      } else if (Notification.permission === 'denied') {
        reject('Permission was previously denied.');
      } else if (Notification.permission !== "granted") {
        Notification.requestPermission().then(function (status) {
          if (Notification.permission !== status) {
            Notification.permission = status;
          }

          if (status === "granted") {
            resolve();
          } else {
            reject('Permission was denied.');
          }
        });
      }
    });
  }

  sendMessage(message) {
    this.hasPermission().then(() => {
      this.lastNotification = new Notification(message);
    }).catch((err) => {
      console.log('Error: ' + err);
    });
  }
}


module.exports = Notifier;
