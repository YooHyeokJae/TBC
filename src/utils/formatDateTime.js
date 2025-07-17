export function formatDateTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // 월
    const day = String(date.getDate()).padStart(2, '0');         // 일
    const hour = String(date.getHours()).padStart(2, '0');       // 시
    const minute = String(date.getMinutes()).padStart(2, '0');   // 분
    const second = String(date.getSeconds()).padStart(2, '0');   // 초

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}