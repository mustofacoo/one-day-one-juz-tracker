// Jakarta timezone utilities with manual offset for accuracy

export const getJakartaTime = () => {
  // Use manual offset for Jakarta (UTC+7)
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const jakartaTime = new Date(utc + (7 * 3600000)); // UTC+7
  return jakartaTime;
};

export const getJakartaDate = () => {
  return getJakartaTime();
};

export const getJakartaDateKey = () => {
  const jakartaTime = getJakartaTime();
  return jakartaTime.toISOString().split('T')[0];
};

export const getJakartaTimeString = () => {
  const jakartaTime = getJakartaTime();
  return jakartaTime.toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export const formatDateDisplay = (date) => {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getTimeUntilMidnight = () => {
  const now = getJakartaTime();
  const nextMidnight = new Date(now.getTime());
  nextMidnight.setHours(0, 0, 0, 0);
  nextMidnight.setDate(nextMidnight.getDate() + 1);
  
  return nextMidnight.getTime() - now.getTime();
};

export const formatCountdown = (timeInMs) => {
  if (timeInMs <= 0) return { hours: 0, minutes: 0, seconds: 0 };
  
  const hours = Math.floor(timeInMs / (1000 * 60 * 60));
  const minutes = Math.floor((timeInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeInMs % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
};

export const getAvailableMonths = () => {
  const months = [];
  const startDate = new Date('2025-06-01');
  const currentMonth = getJakartaDate();
  
  while (startDate <= currentMonth) {
    const monthKey = startDate.toISOString().substring(0, 7);
    const monthName = startDate.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long'
    });
    months.push({ key: monthKey, name: monthName });
    startDate.setMonth(startDate.getMonth() + 1);
  }
  
  return months.reverse();
};