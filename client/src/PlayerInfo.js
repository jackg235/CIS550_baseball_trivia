import React, { Component } from 'react';
import { Jumbotron, Button, Form, FormGroup, Label, Input, Col } from 'reactstrap';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';

class PlayerInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table: <br />,

      infoFor: "PlayerNameGiven",
      inputName: "",
    };

    this.onDropdownInfoForSelected = this.onDropdownInfoForSelected.bind(this);
    this.handleInputName = this.handleInputName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {

  }

  /**
   * Sets the state upon the InfoFor being selected
   * @param {event} e 
   */
  onDropdownInfoForSelected(e) {
    this.setState({
      infoFor: e.target.value,
    });
  }

  /**
   * Sets the state upon the Criteria being selected
   * @param {event} e 
   */
  handleInputName(e) {
    this.setState({
      inputName: e.target.value.toLowerCase().trim(),
    });

  }

  handleSubmit() {
    let tableToUse = this.state.infoFor === "SchoolName" ? "schools" : "people";
    let query = ``;

    if (tableToUse === "people") {
      let searchOn = this.state.infoFor === "PlayerNameGiven" ? "namegiven" :
        this.state.infoFor === "PlayerFirstName" ? "namefirst" :
          "namelast";
      query = `
        SELECT *
        FROM (
          SELECT namefirst, namelast, namegiven, birthcountry, height, weight, name_full
          FROM (
            SELECT playerid, namefirst, namelast, namegiven, birthcountry, height, weight
            FROM people
            WHERE lower(${searchOn}) like '%${this.state.inputName}%'
          ) p1
          NATURAL JOIN (
            SELECT playerid, schoolid
            FROM CollegePlaying
            GROUP BY playerid, schoolid
          ) cp1
          NATURAL JOIN (
            SELECT schoolid, name_full
            FROM schools
          ) s1
        )
        WHERE ROWNUM <= 200
      `;
    } else {
      query = `
        SELECT *
        FROM (
          SELECT namefirst, namelast, namegiven, birthcountry, height, weight, name_full
          FROM (
            SELECT schoolid, name_full
            FROM schools
            WHERE lower(name_full) like '%${this.state.inputName}%'
          ) s1
          NATURAL JOIN (
            SELECT playerid, schoolID
            FROM CollegePlaying
            GROUP BY playerid, schoolid
          ) cp1
          NATURAL JOIN (
            SELECT playerid, namefirst, namelast, namegiven, birthcountry, height, weight
            FROM people
          ) p1
        )
        WHERE ROWNUM <= 200
      `;
    }

    fetch('http://localhost:5000/query', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "query": query
      })
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(res => {
      if (!res) return;
      console.log(res);

      const columns = [
        {
          dataField: '#',
          text: '#',
          sort: true
        },
        {
          dataField: 'namefirst',
          text: 'First Name',
          sort: true
        },
        {
          dataField: 'namelast',
          text: 'Last Name',
          sort: true
        },
        {
          dataField: 'namegiven',
          text: 'Given Name',
          sort: true
        },
        {
          dataField: 'BirthCountry',
          text: 'Birth Country',
          sort: true
        },
        {
          dataField: 'height',
          text: 'Height',
          sort: true
        },
        {
          dataField: 'weight',
          text: 'Weight',
          sort: true
        },
        {
          dataField: 'name_full',
          text: 'School Name',
          sort: true
        }
      ];

      let data = [];
      for (let i = 0; i < res.results.length; i++) {
        let rowData = res.results[i];
        let dataObj = {};

        dataObj['#'] = i;
        dataObj['namefirst'] = rowData[0];
        dataObj['namelast'] = rowData[1];
        dataObj['namegiven'] = rowData[2];
        dataObj['BirthCountry'] = rowData[3];
        dataObj['height'] = rowData[4];
        dataObj['weight'] = rowData[5];
        dataObj['name_full'] = rowData[6];

        data.push(dataObj);
      }

      return <BootstrapTable keyField='#' data={data} columns={columns} hover={true} pagination={paginationFactory()} />;
    }).then(res => {
      if (!res) return;
      this.setState({
        table: res
      });
    });
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
              <Label for="selectPlayerNameOrSchool" sm={2}>Info for</Label>
              <Col sm={10}>
                <Input onChange={this.onDropdownInfoForSelected} type="select" name="select" id="selectPlayerNameOrSchool">
                  <option key="PlayerNameGiven" value="PlayerNameGiven">Player Given Name</option>
                  <option key="PlayerFirstName" value="PlayerFirstName">Player First Name</option>
                  <option key="PlayerLastName" value="PlayerLastName">Player Last Name</option>
                  <option key="SchoolName" value="SchoolName">School Name</option>
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="textName" sm={2}>Name</Label>
              <Col sm={10}>
                <Input onChange={this.handleInputName} type="text" name="select" id="textName" />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col sm={{ size: 10, offset: 2 }}>
                <Button
                  disabled={this.state.inputName.trim() === "" || this.state.inputName === null ? true : false}
                  onClick={this.handleSubmit}
                  color="primary">
                  Submit
                </Button>
              </Col>
            </FormGroup>
          </Form>

          {this.state.table}

        </Jumbotron>
      </div>
    );
  }
}

export default PlayerInfo;
