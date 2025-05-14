const nearestPowerOfTwo = (num) => {
    if (num < 1) {
        return 1;
    }
    
    let lowerPower = Math.pow(2, Math.floor(Math.log2(num)));
    let upperPower = Math.pow(2, Math.ceil(Math.log2(num)));

    return (num - lowerPower < upperPower - num) ? lowerPower : upperPower;
}

export default nearestPowerOfTwo;