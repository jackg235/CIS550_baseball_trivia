import React, { Component } from 'react';
import { Jumbotron, Button, Form, FormGroup, Label, Input, FormText, Modal, ModalBody, ModalFooter } from 'reactstrap';
import './App.css';
import QuestionGenerator from './QuestionGenerator';
import Timer from './Timer';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      qg : new QuestionGenerator(),
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
      countQuestions: 0,
      modalIsOpen: false
    };
    this.getRandomQuestion = this.getRandomQuestion.bind(this);
    this.clickSubmit = this.clickSubmit.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  async componentDidMount() {
    this.getRandomQuestion()
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }


  getRandomQuestion() {
    let questionAndQuery = this.state.qg.generateQuestion();
    let questionRes = questionAndQuery[0];
    let queryRes = questionAndQuery[1];
    console.log(queryRes)

    fetch('http://localhost:5000/query', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
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
      if (arrayRes.length < 4) {
        console.log('not enough query results');
        return this.getRandomQuestion();
      }
      // create array for 3 other viable choices
      var arr = [];
      while (arr.length < 3) {
        var r = Math.ceil(Math.random() * (arrayRes.length - 1));
        if (arr.indexOf(r) === -1) arr.push(r);
      }

      // shuffle results
      var shuffledArray = [arrayRes[0], arrayRes[arr[0]], arrayRes[arr[1]], arrayRes[arr[2]]];


      this.shuffle(shuffledArray);

      console.log(shuffledArray);

      let correctIndex = shuffledArray.indexOf(arrayRes[0]);

      if (shuffledArray[0].length == 2) {
        this.setState({
          question: questionRes,
          query: queryRes,
          choice0: shuffledArray[0][0] + ", " + shuffledArray[0][1],
          choice1: shuffledArray[1][0] + ", " + shuffledArray[1][1],
          choice2: shuffledArray[2][0] + ", " + shuffledArray[2][1],
          choice3: shuffledArray[3][0] + ", " + shuffledArray[3][1],
          correctIndex: correctIndex
        })
      } else {
        this.setState({
          question: questionRes,
          query: queryRes,
          choice0: shuffledArray[0],
          choice1: shuffledArray[1],
          choice2: shuffledArray[2],
          choice3: shuffledArray[3],
          correctIndex: correctIndex
        })
      }

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

  modalToggle() {
    console.log("modalToggle");
    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    })
    console.log(this.state.modalIsOpen);
  }

  resetGame() {
    this.setState({
      countCorrect: 0,
      countQuestions: 0
    });
    this.modalToggle();
  }


  render() {
    return (
      <div>
        <Jumbotron>
          <Form>
            <FormGroup tag="fieldset">
              <h3>{this.state.question}</h3>
              <FormGroup check>
                <Label check>
                  <Input id="a0" type="radio" name="answer" value="0" />{this.state.choice0}
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input id="a1" type="radio" name="answer" value="1" />{this.state.choice1}
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input id="a2" type="radio" name="answer" value="2" />{this.state.choice2}
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input id="a3" type="radio" name="answer" value="3" />{this.state.choice3}
                </Label>
              </FormGroup>
            </FormGroup>
            <Button color="primary" onClick={this.clickSubmit}>Submit</Button>
            <Timer modalToggle={this.modalToggle} />
            <br />
            <br />
            <h4>{this.state.result}</h4>
            <h4>{this.state.countCorrect} for {this.state.countQuestions}! ({(100 * this.state.countCorrect / (this.state.countQuestions + 0.0000000001)).toFixed(1)}%)</h4>
          </Form>
        </Jumbotron>
        <Modal isOpen={this.state.modalIsOpen} toggle={this.resetGame}>
            <ModalBody>
              You got {this.state.countCorrect} questions correct within the time allotted!
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.resetGame}>Play Again</Button>
            </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default App;
