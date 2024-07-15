export const formatDate = (date: Date) => {
    const localYear = date.getFullYear();
    const localMonth = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    const localDay = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    return `${localDay}/${localMonth}/${localYear}`
}

export const formatDateTime = (date: Date) => {
    const localYear = date.getFullYear();
    const localMonth = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    const localDay = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    const localHours = date.getHours();
    const localMinutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    return `${localHours}:${localMinutes}H ${localDay}/${localMonth}/${localYear}`
}