
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
      result: "Good Luck!",
      countCorrect: 0,
      countQuestions: 0
    };
    this.getHeaders = this.getHeaders.bind(this);
    this.getRandomQuestion = this.getRandomQuestion.bind(this);
    this.clickSubmit = this.clickSubmit.bind(this);
    this.shuffle = this.shuffle.bind(this);
  }

  componentDidMount() {
    this.getHeaders()
    this.getRandomQuestion()
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  getHeaders() {
    fetch('http://localhost:5000/get_headers',
    {
      method: 'GET' 
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      console.log(err);
    }).then(headers => {
      if (!headers) return;
      console.log(headers)

    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  }

  getRandomQuestion() {
    var qg = new QuestionGenerator();
    let questionAndQuery = qg.generateQuestion();
    let questionRes = questionAndQuery[0];
    let queryRes = questionAndQuery[1];
    console.log(queryRes)
    console.log('here')

    fetch('http://localhost:5000/query', {
      method: 'post',
      headers: {
        'Content-Type':'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
       "query": queryRes
      })
     }).then(res => {
        return res.json();
     }, err => {
        console.log(err);
    }).then(results => {
      if (!results) return;

      // get the possible answers for the query
      var arrayRes = results["results"];
      console.log(arrayRes)
      // create array for 3 other viable choices
      var arr = [];
      while(arr.length < 3){
          var r = Math.ceil(Math.random() * (arrayRes.length - 1));
          if(arr.indexOf(r) === -1) arr.push(r);
      }

      console.log(arr);

      // shuffle results
      var shuffledArray = [arrayRes[0], arrayRes[arr[0]], arrayRes[arr[1]], arrayRes[arr[2]]];
      this.shuffle(shuffledArray);

      console.log(shuffledArray);
      
      let correctIndex = shuffledArray.indexOf(arrayRes[0]);

      this.setState({
        question: questionRes,
        query: queryRes,
        choice0: shuffledArray[0],
        choice1: shuffledArray[1],
        choice2: shuffledArray[2],
        choice3: shuffledArray[3],
        correctIndex: correctIndex
      })

    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  }

  clickSubmit() {

    var anythingChecked = document.getElementById("a0").checked || (
      document.getElementById("a1").checked) || (
        document.getElementById("a2").checked) || (
          document.getElementById("a3").checked);

    if (anythingChecked) {
      var correctChecked = document.getElementById("a" + this.state.correctIndex).checked;
      if (correctChecked) {
        this.setState({
          result: "Correct!",
          countCorrect: this.state.countCorrect + 1,
          countQuestions: this.state.countQuestions + 1
        });
        
      } else {
        this.setState({
          result: "Incorrect",
          countQuestions: this.state.countQuestions + 1
        });
      }
      this.getRandomQuestion();
      document.getElementById("a0").checked = false;
      document.getElementById("a1").checked = false;
      document.getElementById("a2").checked = false;
      document.getElementById("a3").checked = false;
    }
  }

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

        <h3>{this.state.question}</h3>
      
        <input type="radio" id="a0" name="answer" value="0"></input>
        <label for="a0">
          {this.state.choice0}
        </label><br></br>
        <input type="radio" id="a1" name="answer" value="1"></input>
        <label for="a1">
          {this.state.choice1}
        </label><br></br>
        <input type="radio" id="a2" name="answer" value="2"></input>
        <label for="a2">
          {this.state.choice2}
        </label><br></br>
        <input type="radio" id="a3" name="answer" value="3"></input>
        <label for="a3">
          {this.state.choice3}
        </label><br></br><br></br>


        <button onClick={this.clickSubmit}>
          Submit
        </button>

        <h3>
          {this.state.result}
        </h3>

        <h3>{this.state.countCorrect} for {this.state.countQuestions}! ({(100 * this.state.countCorrect / (this.state.countQuestions + 0.0000000001)).toFixed(1)}%)</h3>

        <p className="App-intro">{this.state.data}</p>
      </div>
    );
  }
}

export default App;
