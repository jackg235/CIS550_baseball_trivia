
import React, { Component } from 'react';
import './App.css';
import QuestionGenerator from './QuestionGenerator';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      question: "",
      query: "",
      correctIndex: 0,
      choice0: "",
      choice1: "",
      choice2: "",
      choice3: "",
      result: ""
    };

    this.getRandomQuestion = this.getRandomQuestion.bind(this);
    this.click0 = this.click0.bind(this);
    this.click1 = this.click1.bind(this);
    this.click2 = this.click2.bind(this);
    this.click3 = this.click3.bind(this);
  }

  componentDidMount() {
      // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }

  getRandomQuestion() {
    var qg = new QuestionGenerator();
    let questionAndQuery = qg.generateQuestion();
    let questionRes = questionAndQuery[0];
    let queryRes = questionAndQuery[1];

    //should send out query here
    // update the index of the correct one
    // randomly generate the other choices and locations
    let correctIndex = Math.floor(Math.random() * 4);

    this.setState({
      question: questionRes,
      query: queryRes,
      choice0: "0",
      choice1: "1",
      choice2: "2",
      choice3: "3",
      correctIndex: correctIndex
    })
  }

  click0() {
    console.log(this.state.correctIndex);
    if (this.state.correctIndex == 0) {
      this.setState({
        result: "Correct!"
      });
      
    } else {
      this.setState({
        result: "Incorrect"
      });
    }
    this.getRandomQuestion();
  }

  click1() {
    console.log(this.state.correctIndex);
    if (this.state.correctIndex == 1) {
      this.setState({
        result: "Correct!"
      });
    } else {
      this.setState({
        result: "Incorrect"
      });
    }
    this.getRandomQuestion();
  }

  click2() {
    console.log(this.state.correctIndex);
    if (this.state.correctIndex == 2) {
      this.setState({
        result: "Correct!"
      });
    } else {
      this.setState({
        result: "Incorrect"
      });
    }
    this.getRandomQuestion();
  }

  click3() {
    console.log(this.state.correctIndex);
    if (this.state.correctIndex == 3) {
      this.setState({
        result: "Correct!"
      });
    } else {
      this.setState({
        result: "Incorrect"
      });
    }
    this.getRandomQuestion();
  }



    // t
  callBackendAPI = async () => {
    const response = await fetch('/query');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.getRandomQuestion}>
            Start
          </button>
          <div>
            {this.state.question}
          </div>
        
          <button onClick={this.click0}>
              Choice 0
          </button>
          <button onClick={this.click1}>
              Choice 1
          </button>
          <button onClick={this.click2}>
              Choice 2
          </button>
          <button onClick={this.click3}>
              Choice 3
          </button>

          <div>
            {this.state.result}
          </div>
        </header>

        <p className="App-intro">{this.state.data}</p>
      </div>
    );
  }
}

export default App;
