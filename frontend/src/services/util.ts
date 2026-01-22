function capitalize(s: string): string {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatPhoneNumber(phone: string): string {
    if (!phone) return "";
    return `(${phone.slice(0, 2)}) ${phone[2]} ${phone.slice(3, 7)}-${phone.slice(7)}`;
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password: string): boolean {
    return password.length >= 4;
}

function isValidName(name: string): boolean {
    return name.trim().length > 8 && name.length <= 50 && /^[a-zA-Z\s]+$/.test(name);
}

function formatPrice(price: number | string): string {
    return Number(price).toFixed(2);
}

export { capitalize, formatPhoneNumber, isValidEmail, isValidPassword, isValidName, formatPrice };