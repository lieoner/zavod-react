import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './index.css';
//components
import { Matrix, OptimQueue } from './components/matrix.js';
import { Guant } from './components/guant.js';

const matrix = require('./matrix.json');

const use_links = true;

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
                <Matrix matrix={matrix} key="1" title="Детали\Станки" foot={true} />
                <br />
                <Matrix matrix={queues} key="2" title="Очереди запуска" labels={labels} />
                <br />
                <Guant
                    use_links={use_links}
                    matrix={matrix}
                    queue={queue1}
                    key="3"
                    title="Очередь по умолчанию"
                    order={queueClass.getQueue(0)}
                />
                <br />
                <Guant
                    use_links={use_links}
                    matrix={matrix}
                    queue={queue2}
                    key="4"
                    title="Оптимизированная очередь"
                    order={queueClass.getQueue(5)}
                />
            </div>
        );
    }
}

ReactDOM.render(<StankiBegin matrix={matrix} />, document.getElementById('root'));

$(document).ready(function() {
    $('.color-block').each(function(index, element) {
        // element == this
        $(element).css('background-color', $(this).data('color'));
    });

    const flatView = matrix => {
        const row_margin = 20;
        $('.timeLine-main-data-container').each(function(index, element) {
            // element == this
            var stonk_rows = $(element).find('.timeLine-main-data-row');
            var rows_count = stonk_rows.length / matrix[0].length;
            var cur_global_iterator = 0;
            while (cur_global_iterator < stonk_rows.length) {
                for (let i = 1; i < rows_count; i++) {
                    $(stonk_rows[cur_global_iterator]).append(
                        $(stonk_rows[cur_global_iterator + i]).find('div')
                    );
                    $(stonk_rows[cur_global_iterator + i]).remove();
                }

                if (cur_global_iterator !== 0) {
                    $(stonk_rows[cur_global_iterator]).offset({
                        top:
                            $(stonk_rows[cur_global_iterator - rows_count]).offset().top +
                            row_margin,
                    });
                }
                cur_global_iterator += rows_count;
            }
            $(element).css('height', row_margin * matrix[0].length);
        });
        $('.timeLine-side-task-container').each(function(index, element) {
            // element == this
            $(element)
                .find('.timeLine-side-task-row')
                .each(function(index, element1) {
                    // element == this
                    if (index < matrix[0].length) {
                        $(element1)
                            .find('div')
                            .html('Станок ' + (index + 1));
                    } else $(element1).remove();
                });
            //$(element).css('max-height', row_margin * matrix[0].length);
        });
        $('.time-line-container').each(function(index, element) {
            // element == this
            $(element).css('overflow', 'hidden');
            $(element).css(
                'max-height',
                row_margin * matrix[0].length + $('.timeLine-side-title').height() + 2
            );
        });
    };
    //flatView(matrix);
});
