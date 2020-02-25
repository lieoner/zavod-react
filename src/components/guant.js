import React from 'react';
import TimeLine from 'react-gantt-timeline';
import moment from 'moment';
import randomColor from 'randomcolor';

class Guant extends React.Component {
    constructor(props) {
        super(props);
        this.state = { matrix: this.props.matrix, queue: this.props.queue };
        this.data = [];
        this.links = [];
        this.colors = [];
        this.legend = <div />;
    }

    render() {
        const task_queue = this.state.queue;
        task_queue.forEach((e, index) => {
            this.colors = randomColor({
                count: 10,
                luminosity: 'light',
            });
        });

        this.legend = this.props.order.map((element, index) => {
            return (
                <div>
                    <div>Деталь {element}</div>
                    <div className="color-block" key={index} data-color={this.colors[index]}></div>
                </div>
            );
        });
        this.legend = <div className="legend">{this.legend}</div>;

        for (let i = 0; i < task_queue.length; i++) {
            let taskLine = task_queue[i];
            taskLine.forEach((queue, index) => {
                let task = {
                    id: index + 'detal' + i,
                    start: moment()
                        .set({ date: 30 + queue.start })
                        .toDate(),
                    end: moment()
                        .set({ date: 30 + queue.end })
                        .toDate(),
                    name: 'Станок ' + i,
                    color: this.colors[index],
                };
                let link = {
                    id: i,
                    start: index + 'detal' + i,
                    end: index + 'detal' + (i + 1),
                };
                this.links.push(link);
                this.data.push(task);
            });
        }
        return (
            <div className="app-container">
                <h1>{this.props.title}</h1>
                {this.legend}
                <div className="time-line-container">
                    <TimeLine data={this.data} links={this.links} />
                </div>
            </div>
        );
    }
}

export { Guant };
