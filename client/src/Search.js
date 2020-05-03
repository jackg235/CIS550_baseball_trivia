import React, { Component } from 'react';
import { Jumbotron, Button, Form, FormGroup, Label, Input, Table, Col } from 'reactstrap';

const batting_attributes = ["playerID", "yearID", "stint", "teamID", "lgID", "G", "AB", "R", "H", "2B", "TWOB", "THREEB", "3B", "HR", "RBI", "SB", "CS", "BB", "SO", "IBB", "HBP", "SH", "SF", "GIDP"];
const pitching_attributes = ["playerID", "yearID", "stint", "teamID", "lgID", "W", "L", "G", "GS", "CG", "SHO", "SV", "IPouts", "H", "ER", "HR", "BB", "SO", "BAOpp", "ERA", "IBB", "WP", "HBP", "BK", "BFP", "GF", "R", "SH", "SF", "GIDP"];

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      year: 1871,

    };

    this.getYears = this.getYears.bind(this);
  }

  getYears() {
    let years = [];         
     for (let i = 1871; i <= 2019; i++) {             
          years.push(<option key={i} value={i}>{i}</option>);
     }
     return years;  
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <Jumbotron>
          <Form>
            <FormGroup tag="fieldset">
              <h3>Enter your search fields</h3>
            </FormGroup>
          </Form>
          <Form>
            <FormGroup row>
              <Label for="selectPlayerOrTeam" sm={2}>Info for</Label>
              <Col sm={10}>
                <Input type="select" name="select" id="selectPlayerOrTeam">
                  <option>Player</option>
                  <option>Team</option>
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="selectPlayerOrTeam" sm={2}>Criteria</Label>
              <Col sm={10}>
                <Input type="select" name="select" id="selectBattingOrPitching">
                  <option>Batting</option>
                  <option>Pitching</option>
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="mostOrLeast" sm={2}>Extreme</Label>
              <Col sm={10}>
                <Input type="select" name="select" id="mostOrLeast">
                  <option>most</option>
                  <option>least</option>
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="stats" sm={2}>Stats</Label>
              <Col sm={10}>
                <Input type="select" name="select" id="stats">
                  <option>hr</option>
                  <option>rbi</option>
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="timeRange" sm={2}>Time range</Label>
              <Col sm={10}>
                <Input type="select" name="select" id="timeRange">
                  <option>in</option>
                  <option>since</option>
                  <option>before</option>
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="year" sm={2}>Year</Label>
              <Col sm={10}>
                <Input type="select" name="text" id="year">
                  { this.getYears() }
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col sm={{ size: 10, offset: 2 }}>
                <Button color="primary">Submit</Button>
              </Col>
            </FormGroup>
          </Form>

          <Table dark>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </Table>
        </Jumbotron>
      </div>
    );
  }
}

export default Search;
