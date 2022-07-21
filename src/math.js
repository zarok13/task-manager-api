const calculateTip = (total, tipPercent = 0.25) => total + (total * tipPercent);

const fahrenheitToCelcius = (temp) => {
    return (temp - 32) / 1.8;
}

const celciusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32;
}

const add = (a, b) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if(a<0 || b<0) {
                return rej('Numbers must be non-negative');
            }
            res(a + b);
        }, 2000);
    });
}

module.exports = {
    calculateTip,
    fahrenheitToCelcius,
    celciusToFahrenheit,
    add
}