import React, { Component } from 'react';
import { Jumbotron, Button, Form, FormGroup, Label, Input, Col } from 'reactstrap';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';

const stat_dict = require('./stats.json');
const batting_attributes = ["stint", "G", "AB", "R", "H", "2B", "TWOB", "THREEB", "3B", "HR", "RBI", "SB", "CS", "BB", "SO", "IBB", "HBP", "SH", "SF", "GIDP"];
const pitching_attributes = ["stint", "W", "L", "G", "GS", "CG", "SHO", "SV", "IPouts", "H", "ER", "HR", "BB", "SO", "BAOpp", "ERA", "IBB", "WP", "HBP", "BK", "BFP", "GF", "R", "SH", "SF", "GIDP"];

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table: <br />,
      statsToShow: [],

      infoFor: "Player",
      criteria: "Batting",
      extreme: "Most",
      stats: "G",
      timeRange: "In",
      year: 1871
    };

    this.getYears = this.getYears.bind(this);
    this.setStats = this.setStats.bind(this);

    this.onDropdownInfoForSelected = this.onDropdownInfoForSelected.bind(this);
    this.onDropdownCriteriaSelected = this.onDropdownCriteriaSelected.bind(this);
    this.onDropdownExtremeSelected = this.onDropdownExtremeSelected.bind(this);
    this.onDropdownStatsSelected = this.onDropdownStatsSelected.bind(this);
    this.onDropdownTimeRangeSelected = this.onDropdownTimeRangeSelected.bind(this);
    this.onDropdownYearSelected = this.onDropdownYearSelected.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      statsToShow: this.setStats("Batting")
    });
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
   * Sets the menu options for the "Stats" field based on criteria
   * @param {criteria} value 
   */
  setStats(value) {
    let currStats = value === "Batting" ? batting_attributes : pitching_attributes;
    let stats = [];
    for (let i = 0; i < currStats.length; i++) {
      let fullWord = "";
      if (currStats[i] in stat_dict) {
        fullWord = " (" + stat_dict[currStats[i]] + ")";
      }
      fullWord = currStats[i] + fullWord;
      stats.push(<option key={currStats[i]} value={currStats[i]}>{fullWord}</option>);
    }
    return stats;
  }

  /**
   * Sets the state upon the Criteria being selected
   * @param {event} e 
   */
  onDropdownCriteriaSelected(e) {
    this.setState({
      criteria: e.target.value,
      statsToShow: this.setStats(e.target.value)
    });

  }

  /**
   * Sets the state upon the Extreme being selected
   * @param {event} e 
   */
  onDropdownExtremeSelected(e) {
    this.setState({
      extreme: e.target.value
    });
  }

  /**
   * Sets the state upon the Stats being selected
   * @param {event} e 
   */
  onDropdownStatsSelected(e) {
    this.setState({
      stats: e.target.value
    });
  }

  /**
   * Sets the state upon the TimeRange being selected
   * @param {event} e 
   */
  onDropdownTimeRangeSelected(e) {
    this.setState({
      timeRange: e.target.value
    });
  }

  /**
   * Sets the state upon the Year being selected
   * @param {event} e 
   */
  onDropdownYearSelected(e) {
    this.setState({
      year: e.target.value
    });
  }

  /**
   * Generates the years options for the dropdown
   */
  getYears() {
    let years = [];
    for (let i = 1871; i <= 2019; i++) {
      years.push(<option key={i} value={i}>{i}</option>);
    }
    return years;
  }

  handleSubmit() {
    let tableToUse = this.state.criteria === "Batting" ? "batting" : "pitching";
    let statsToSelect = this.state.stats;
    let yearToQuery = this.state.year;
    let timeRangeToQuery = this.state.timeRange === "In" ? "=" :
      this.state.timeRange === "Since" ? ">=" :
        "<=";
    let dataOrderBy = this.state.extreme === "Most" ? "DESC" : "ASC";

    let joinTable = this.state.infoFor === "Player" ? "people" : "teams";
    let joinTableAttributes = joinTable === "people" ? "playerId, namegiven" : "teamId, name";
    let joinTableAttributeToShow = joinTable === "people" ? "namegiven AS PlayerName" : "name AS TeamName";
    
    let query = `
      SELECT * 
      FROM (
        SELECT YearID, ${joinTableAttributeToShow}, ${statsToSelect}
        FROM ${tableToUse}
        NATURAL JOIN (
          SELECT ${joinTableAttributes}
          FROM ${joinTable}
        )
        WHERE yearId ${timeRangeToQuery} date '${yearToQuery}-04-01'
        ORDER BY ${statsToSelect} ${dataOrderBy}
      )
      WHERE ROWNUM <= 200
    `;

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

      let tableAttributeDisplay = joinTableAttributeToShow.split(" AS ")[1];
      const columns = [
        {
          dataField: "#",
          text: "#",
          sort: true
        },
        {
          dataField: 'Year',
          text: 'Year',
          sort: true
        },
        {
          dataField: statsToSelect,
          text: statsToSelect,
          sort: true
        },
        {
          dataField: tableAttributeDisplay,
          text: tableAttributeDisplay,
          sort: true
        }
      ];

      let data = [];
      for (let i = 0; i < res.results.length; i++) {
        let rowData = res.results[i];
        let dataObj = {};

        dataObj['#'] = i;
        dataObj['Year'] = rowData[0].substring(0, 4);
        dataObj[tableAttributeDisplay] = rowData[1];
        dataObj[statsToSelect] = rowData[2];

        data.push(dataObj);
      }

      return <BootstrapTable keyField='#' data={data} columns={columns} hover = {true} pagination={paginationFactory()} />;
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
              <Label for="selectPlayerOrTeam" sm={2}>Info for</Label>
              <Col sm={10}>
                <Input onChange={this.onDropdownInfoForSelected} type="select" name="select" id="selectPlayerOrTeam">
                  <option key="Player" value="Player">Player</option>
                  <option key="Team" value="Team">Team</option>
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="selectBattingOrPitching" sm={2}>Criteria</Label>
              <Col sm={10}>
                <Input onChange={this.onDropdownCriteriaSelected} type="select" name="select" id="selectBattingOrPitching">
                  <option key="Batting" value="Batting">Batting</option>
                  <option key="Pitching" value="Pitching">Pitching</option>
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="mostOrLeast" sm={2}>Extreme</Label>
              <Col sm={10}>
                <Input onChange={this.onDropdownExtremeSelected} type="select" name="select" id="mostOrLeast">
                  <option key="Most" value="Most">Most</option>
                  <option key="Least" value="Least">Least</option>
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="stats" sm={2}>Stats</Label>
              <Col sm={10}>
                <Input onChange={this.onDropdownStatsSelected} type="select" name="select" id="stats">
                  {this.state.statsToShow}
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="timeRange" sm={2}>Time range</Label>
              <Col sm={10}>
                <Input onChange={this.onDropdownTimeRangeSelected} type="select" name="select" id="timeRange">
                  <option key="In" value="In">In</option>
                  <option key="Since" value="Since">Since</option>
                  <option key="Before" value="Before">Before</option>
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="year" sm={2}>Year</Label>
              <Col sm={10}>
                <Input onChange={this.onDropdownYearSelected} type="select" name="text" id="year">
                  {this.getYears()}
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col sm={{ size: 10, offset: 2 }}>
                <Button onClick={this.handleSubmit} color="primary">Submit</Button>
              </Col>
            </FormGroup>
          </Form>

          {this.state.table}

        </Jumbotron>
      </div>
    );
  }
}

export default Search;
