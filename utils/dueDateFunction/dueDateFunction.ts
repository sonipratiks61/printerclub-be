export const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);

    const year = result.getFullYear();
    const month = String(result.getMonth() + 1).padStart(2, '0');
    const day = String(result.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
}

