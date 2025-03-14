export const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Unknown date";
    }
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium", // "mar 5, 2025"
      timeStyle: "short"  // "08:48 "
    }).format(date); // "mar 5, 2025, 08:48"
  };