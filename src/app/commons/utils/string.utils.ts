export const isNull = val => val === undefined || val === null;

export const isNullOrWhiteSpace = val => {
    try {
        if (isNull(val)) {
            return true;
        }
        return val.toString().replace(/\s/g, '').length < 1;
    } catch (e) {
        return false;
    }
};

export const isNullOrEmpty = value => {
    if (value === undefined)
        return true;

    if (value === null)
        return true;

    if (value === {})
        return true;

    if (value === [])
        return true;

    if(value === 'null')
        return true;
}
