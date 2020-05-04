import React, { Component } from 'react';
import { Button } from 'reactstrap';

class Timer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            minutes: '01',
            seconds: '00'
        }

        this.intervalHandle = null;
        this.startCountDown = this.startCountDown.bind(this);
        this.tick = this.tick.bind(this);
    }

    tick() {
        var min = parseInt(this.state.minutes);
        var sec = parseInt(this.state.seconds);

        if (sec === 0) {
            if (min === 0) {
                sec = 0;
                min = 0;
            } else {
                sec = 59;
                min--;
            }
        } else {
            sec--;
        }

        this.setState({
            minutes: min < 10 ? "0" + min : "" + min,
            seconds: sec < 10 ? "0" + sec : "" + sec
        })
    
        if (min === 0 & sec === 0) {
        clearInterval(this.intervalHandle);
        this.props.modalToggle();
        }
      }
    
    startCountDown() {
        
        this.setState({
            minutes: '01',
            seconds: '00'
        })
        if (this.intervalHandle) {
            clearInterval(this.intervalHandle);
        } 
        this.intervalHandle = setInterval(this.tick, 1000);
        this.props.toggleGameElements();
    }

    render() {
        return (
            <div>
                <h1 style={{margin: "0", display: "inline-block"}}>{this.state.minutes}:{this.state.seconds}</h1>  <Button style={{float: "right"}} onClick={this.startCountDown}>Start</Button>
            </div>
            
        );
    }
}

export default Timer;