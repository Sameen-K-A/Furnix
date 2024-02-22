const timeGenerator = () => {
    let currentDate = new Date();
    currentDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let currentTime = hours + ':' + minutes + ampm;
    return currentTime;
}

module.exports = timeGenerator;