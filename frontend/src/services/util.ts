function capitalize(s: string) {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatPhoneNumber(phone: string) {
    if (!phone) return "";
    return `(${phone.slice(0, 2)}) ${phone[2]} ${phone.slice(3, 7)}-${phone.slice(7)}`;
}

export { capitalize, formatPhoneNumber };