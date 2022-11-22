
export const utilService = {
    getDate,
    getRandomColor
}


function getDate(newDate) {
    const date = new Date(newDate)
    const minutes =
        date.getMinutes() > 9
            ? date.getMinutes()
            : `0${date.getMinutes()}`;
    const seconds =
        date.getSeconds() > 9
            ? date.getSeconds()
            : `0${date.getSeconds()}`;
    const currDate = `${date.getDay()}/${date.getMonth() + 1}`
    const time = `${date.getHours()}:${minutes}`;
    const res = `${currDate},  ${time}  `
    return time
}


function getRandomColor(num) {
    
    const colors = ['#112e3e', '#0f6f02', '#b75b53', '#211407', '#12435a', '#0e601b', '#2077d8', '#890000', '#001c00', '#442547', '#e96dac', '#0d2379', '#ff8d3e', '#00f697', '#ffd5f4', '#99850b', '#bc0050', '#0f6f02', '#112e3e', '#0f6f02', '#b75b53', , '#0e601b', '#2077d8', '#890000', '#001c00', '#442547', '#e96dac', '#0d2379', '#ff8d3e', '#00f697', '#ffd5f4', '#99850b', '#bc0050', '#0f6f02', '#112e3e', '#0f6f02', '#b75b53','#112e3e', '#0f6f02', '#b75b53', '#211407', '#12435a', '#0e601b', '#2077d8', '#890000', '#001c00', '#442547',]
    if (num > colors.length) {
        return 'black'
    }
    console.log('num',colors[num])

    return colors[num];
}