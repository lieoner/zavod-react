import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './index.css';
//components
import { Matrix, OptimQueue } from './components/matrix.js';
import { Guant } from './components/guant.js';

const matrix = require('./matrix.json');

class StankiBegin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { matrix: this.props.matrix };
    }

    render() {
        const matrix = this.state.matrix;
        const queueClass = new OptimQueue(matrix);
        let queues = queueClass.calcQueues();
        let queue1 = queueClass.calcQueuesDurations(0);
        let queue2 = queueClass.calcQueuesDurations(5);

        let labels = [
            'по умолчанию',
            'по первому ⬆',
            'по последнему ⬇',
            'по сумме ⬇',
            'по макс времени ⬇',
            'по сумме мест в очередях ⬆',
        ];

        return (
            <div>
                <Matrix matrix={matrix} title="Детали\Станки" foot={true} />
                <br />
                <Matrix matrix={queues} title="Очереди запуска" labels={labels} />
                <br />
                <Guant
                    matrix={matrix}
                    queue={queue1}
                    title="Очередь по умолчанию"
                    order={queueClass.getQueue(0)}
                />
                <br />
                <Guant
                    matrix={matrix}
                    queue={queue2}
                    title="Оптимизированная очередь"
                    order={queueClass.getQueue(5)}
                />
            </div>
        );
    }
}

ReactDOM.render(<StankiBegin matrix={matrix} />, document.getElementById('root'));

$('.color-block').each(function(index, element) {
    // element == this
    $(element).css('background-color', $(this).data('color'));
});
