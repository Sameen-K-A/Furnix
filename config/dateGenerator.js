const dateGenerator = () => {
    const currentDate = new Date();

    const day = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate();
    const month = (currentDate.getMonth() + 1) < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1);
    const year = currentDate.getFullYear();

    const formattedDate = `${year}/${month}/${day}`;

    return formattedDate;
}

module.exports = dateGenerator