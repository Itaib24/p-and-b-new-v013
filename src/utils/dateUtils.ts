export const calculateTimeLeft = (endDate: string) => {
  const now = new Date();
  const end = new Date(endDate);
  const difference = end.getTime() - now.getTime();

  if (difference > 0) {
    const timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      months: Math.floor(difference / (1000 * 60 * 60 * 24 * 30)),
    };
    return timeLeft.months > 0
      ? `${timeLeft.months} חודשים נותרו`
      : `${timeLeft.days} ימים נותרו`;
  } else {
    return "החברות פגה";
  }
};

export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'היום';
  } else if (diffDays === 1) {
    return 'אתמול';
  } else {
    // Format as dd/mm/yy
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }
};