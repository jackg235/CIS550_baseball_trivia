
import React, { Component } from 'react';
import './App.css';
import QuestionGenerator from './QuestionGenerator';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      question: "",
      query: ""
    };

    this.getRandomQuestion = this.getRandomQuestion.bind(this);
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

    this.setState({
      question: questionRes,
      query: queryRes
    })
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
            Next Question is
          </button>
          <div>
            {this.state.question}
          </div>
        </header>
        <p className="App-intro">{this.state.data}</p>
      </div>
    );
  }
}

export default App;
