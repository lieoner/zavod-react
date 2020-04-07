import React from 'react';

const getColSum = matrix => {
    let sumRow = [];
    for (let i = 0; i < matrix[0].length; i++) {
        let sum = 0;
        for (let j = 0; j < matrix.length; j++) {
            sum += matrix[j][i];
        }
        sumRow.push(sum);
    }
    return sumRow;
};

class Matrix extends React.Component {
    constructor(props) {
        super(props);
        this.state = { matrix: this.props.matrix };
    }

    render() {
        const matrix = this.state.matrix;

        const rows = matrix.map((row, index) => {
            if (this.props.labels) {
                return (
                    <tr key={index}>
                        <Row row={row} firstCol={this.props.labels[index]} />
                    </tr>
                );
            } else {
                return (
                    <tr key={index}>
                        <Row row={row} firstCol={index + 1} />
                    </tr>
                );
            }
        });

        let headRow = [];
        matrix[0].forEach((col, index) => {
            headRow.push(index + 1);
        });
        const head = (
            <tr>
                <Row row={headRow} th={true} firstCol={this.props.title} />
            </tr>
        );

        let footRow = [];
        let foot;
        if (this.props.foot) {
            footRow = getColSum(matrix);
            foot = (
                <tr>
                    <Row row={footRow} firstCol="Сумма" />
                </tr>
            );
        }

        return (
            <table>
                <thead>{head}</thead>
                <tbody>{rows}</tbody>
                <tfoot>{foot}</tfoot>
            </table>
        );
    }
}

class Row extends React.Component {
    constructor(props) {
        super(props);
        this.state = { row: this.props.row };
    }
    render() {
        const row = this.state.row;
        const table_row = row.map((col, index) => {
            if (this.props.th) {
                return <th key={index}>{col}</th>;
            } else {
                return <td key={index}>{col}</td>;
            }
        });
        table_row.unshift(<th key={row.length}>{this.props.firstCol}</th>);

        return table_row;
    }
}

class OptimQueue {
    constructor(matrix) {
        this.matrix = matrix;
        this.queue = [];
    }

    sortByVal(arr, type) {
        switch (type) {
            case 'asc':
                arr.sort((a, b) => (a.val > b.val ? 1 : -1));
                break;
            case 'desc':
                arr.sort((a, b) => (a.val < b.val ? 1 : -1));
                break;
            default:
                break;
        }
    }

    getMaxOfMatrix(matrix) {
        let max = 0;
        matrix.forEach(row => {
            row.forEach(element => {
                if (element > max) {
                    max = element;
                }
            });
        });
        return max;
    }

    getElements(arr, type = 'asc') {
        let elements = [];
        arr.forEach((col, index) => {
            let element = { val: 0, index: 0 };
            element.val = col;
            element.index = index + 1;
            elements.push(element);
        });
        this.sortByVal(elements, type);
        return elements;
    }

    transp(matrix) {
        let transp_matrix = [];
        for (let i = 0; i < matrix[0].length; i++) {
            const row = [];
            for (let j = 0; j < matrix.length; j++) {
                row.push(matrix[j][i]);
            }
            transp_matrix.push(row);
        }
        return transp_matrix;
    }

    getMaxElem(row) {
        let element = [];

        let max = row => {
            let item = { val: 0, index: 0, row: 0 };
            let max = row[row.length - 1].val;
            let coordY = row.length - 1;
            let coordX = row[row.length - 1].index;
            for (let i = row.length - 1; i > 0; i--) {
                if (max < row[i].val) {
                    max = row[i].val;
                    coordX = row[i].index;
                    coordY = i + 1;
                }
            }
            item.val = max;
            item.index = coordX;
            item.row = coordY;
            return item;
        };

        element = max(row);
        return element;
    }

    getDefQueue() {
        let queue = [];
        this.matrix[0].forEach((row, index) => {
            queue.push(index + 1);
        });
        return queue;
    }

    getFirstQueue() {
        let queue = [];
        let elements = [];

        elements = this.getElements(this.matrix[0], 'asc');

        elements.forEach(element => {
            queue.push(element.index);
        });
        return queue;
    }

    getSecQueue() {
        let queue = [];
        let elements = [];

        elements = this.getElements(this.matrix[this.matrix.length - 1], 'desc');

        elements.forEach(element => {
            queue.push(element.index);
        });
        return queue;
    }

    getThirdQueue() {
        let queue = [];
        let elements = [];
        elements = this.getElements(getColSum(this.matrix), 'desc');
        elements.forEach(element => {
            queue.push(element.index);
        });
        return queue;
    }

    getFourQueue() {
        let queue = [];
        /* let sorted_matrix = [];
        this.matrix.forEach((row, index) => {
            let elements = [];
            elements = this.getElements(row, '');
            sorted_matrix.push(elements);
        });
        let transp_matrix = this.transp(sorted_matrix);

        //console.log(transp_matrix);

        //82531764
        console.log('82531764');
        console.log(' ');

        let elements = [];
        transp_matrix.forEach(row => {
            elements.push(this.getMaxElem(row));
        });
        this.sortByVal(elements, 'desc');
        elements.forEach(element => {
            queue.push(element.index);
        }); */

        let matrix = this.matrix.map(function func(el) {
            if (Object.prototype.toString.call(el) === '[object Array]') {
                return el.map(func);
            }
            return el;
        });

        let max = this.getMaxOfMatrix(matrix);
        let maxQueue = [];

        while (max > 0) {
            for (let i = matrix.length - 1; i >= 0; i--) {
                const matrRow = matrix[i];
                //console.log(matrRow);
                for (let j = matrRow.length - 1; j >= 0; j--) {
                    const matrElem = matrRow[j];
                    if (max < matrElem) {
                        max = matrElem;
                        for (let k = 0; k < matrix.length; k++) {
                            matrix[k][j] = 0;
                        }
                        maxQueue.push(j + 1);
                        i = matrix.length - 1;
                    }
                }
            }
            //console.log(matrix);
            max--;
        }

        queue = maxQueue;

        return queue;
    }

    getFiveQueue() {
        let queue = [];
        let row = [];
        this.queue[0].forEach(element => {
            let index = element;
            let sum = 0;
            for (let i = 1; i < this.queue.length; i++) {
                const item = this.queue[i];
                for (let j = 0; j < item.length; j++) {
                    const field = this.queue[i][j];
                    if (field === index) {
                        sum += j + 1;
                    }
                }
            }
            row.push(sum);
        });
        let elements = this.getElements(row, 'asc');
        elements.forEach(element => {
            queue.push(element.index);
        });
        return queue;
    }

    calcQueues() {
        this.queue.push(this.getDefQueue());
        this.queue.push(this.getFirstQueue());
        this.queue.push(this.getSecQueue());
        this.queue.push(this.getThirdQueue());
        this.queue.push(this.getFourQueue());
        this.queue.push(this.getFiveQueue());

        return this.queue;
    }

    getQueue(index) {
        return this.queue[index];
    }

    calcQueuesDurations(queueNum) {
        const queue = this.queue[queueNum];
        const transp_matrix = this.transp(this.matrix);
        //console.log(queue);
        //console.log('');

        let stonks = [];

        const maxOf = arr => {
            let max = arr[0];
            arr.forEach(element => {
                if (element > max) {
                    max = element;
                }
            });
            return max;
        };

        const getRows = queueRow => {
            let timeSum = 0;
            let stonkRow = [];
            let stonkMatrix = [];

            for (let i = 0; i < queueRow.length; i++) {
                timeSum = 0;
                const index = queueRow[i] - 1;
                stonkRow = [];
                for (let jindex = 0; jindex < transp_matrix[index].length; jindex++) {
                    let item = transp_matrix[index][jindex];
                    let stonk = { start: 0, end: 0, duration: 0 };
                    if (i === 0) {
                        stonk.start = timeSum;
                    } else {
                        stonk.start = maxOf([stonkMatrix[i - 1][jindex].end, timeSum]);
                    }
                    timeSum = stonk.start + item;
                    stonk.end = timeSum;
                    stonk.duration = item;
                    stonkRow.push(stonk);
                }
                stonkMatrix.push(stonkRow);
            }

            return this.transp(stonkMatrix);
        };

        stonks = getRows(queue);
        return stonks;
    }
}

export { Matrix, Row, OptimQueue };
