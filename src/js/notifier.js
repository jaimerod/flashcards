'use strict';

class Notifier {
  constructor () {
    this.getPermission();

    window.addEventListener('toast', (e) => {
      this.sendMessage(e.detail.message, (e2) => {
        e.detail.action();
        window.location.reload(true);
      });
    })
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

  sendMessage(message, cb) {
    this.hasPermission().then(() => {
      this.lastNotification = new Notification(message);

      this.lastNotification.addEventListener('click', function (e) {
        if (typeof cb === "function") {
          cb();
        }
      });
    }).catch((err) => {
      console.log('Error: ' + err);
    });
  }
}


module.exports = Notifier;
