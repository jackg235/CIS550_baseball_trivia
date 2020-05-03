import React from 'react';
import './index.css';
import { Button } from "reactstrap";
import { useState } from 'react';
import App from './App.js';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.setTabValue = this.setTabValue.bind(this);

    this.state = {
      tabValue: 0,
    };
  }

  componentDidMount() {
  }

  setTabValue(value) {
    this.setState({
      tabValue: value
    });
  }

  render() {
    let tabPage;
    if (this.state.tabValue === 0) {
      tabPage = <App />
    }

    if (this.state.tabValue === 1) {
      //   tabPage = <Search />;
    }

    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Baseball Trivia</NavbarBrand>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="#" onClick={() => this.setTabValue(0)}>Trivia</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" onClick={() => { console.log("works"); }}>Search</NavLink>
            </NavItem>
          </Nav>
          <NavbarText>CIS 450</NavbarText>
        </Navbar>
        {tabPage}
      </div>
    );
  }
}

export default Dashboard;
