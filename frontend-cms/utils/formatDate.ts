export function formatDate(date: string) {
    const splitDate = date.split('-');
    const year = splitDate[0];
    const month = splitDate[1];
    const day = splitDate[2].slice(0,2);
    return `${day}/${month}/${year}`;
}