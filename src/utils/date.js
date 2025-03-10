export const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Unknown date";
    }
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium", // e.g., "Oct 5, 2023"
      timeStyle: "medium"  // e.g., "2:48:00 PM"
    }).format(date); // Output: "Oct 5, 2023, 2:48:00 PM"
  };