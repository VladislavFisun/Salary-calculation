module.exports =function(timesheet, hourRate) {
    let totalPay = 0;
    let prevTime = 0;
    let prevEvent = '';
    function timeToHour(time) {
    return Math.round(time / 3600000);
  }
  
  
    for (let i = 0; i < timesheet.length; i++) {
      let event = timesheet[i][0];
      let time = new Date(timesheet[i][1]).getTime();
  
      if (prevEvent === 'login' && event === 'logout') {
        let hours = (time - prevTime) / 3600000; // вычисляем количество отработанных часов
  
        // ограничиваем количество отработанных часов 12 часами
        hours = Math.min(hours, 12);
  
        let rate = hourRate;
  
        let prevHour = new Date(prevTime).getUTCHours();
        let currentHour = new Date(time).getUTCHours();
  
        if (prevHour >= 8 && prevHour < 18 && currentHour >= 8 && currentHour < 18) {
          // отработано с 08 до 18
          totalPay += rate * Math.min(hours, 12);
        } else if ((prevHour >= 18 || prevHour < 5) && (currentHour >= 18 || currentHour < 5)) {
          // отработано с 18 до 23 или с 00 до 08
          totalPay += rate * Math.min(hours, 12);
          totalPay += rate * 0.5 * Math.max(Math.min(hours, 8) - 0, 0);
          totalPay += rate * 1.5 * Math.max(Math.min(hours, 12) - 8, 0);
        } else {
          // отработано с 23 до 08
          totalPay += rate * Math.min(hours, 12);
          totalPay += rate * 1.5 * Math.max(Math.min(hours, 8) - 0, 0);
          totalPay += rate * 2 * Math.max(Math.min(hours, 12) - 8, 0);
        }
      }
  
      prevEvent = event;
      prevTime = time;
    }
  
    return totalPay.toFixed(2);
  }