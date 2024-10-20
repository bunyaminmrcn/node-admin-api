export const selectMax = (str1, str2) => {
    const l1 = str1.length;
    const l2 = str2.length;

    if(l1 > l2) {
        return str1
    } else if(l2 > l1) {
        return str2
    } else {
        return str1;
    }
}