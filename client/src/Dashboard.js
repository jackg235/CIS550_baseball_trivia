import React from 'react';
import './index.css';
import './Dashboard.css';
import App from './App.js';
import Search from './Search.js';

import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
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
      tabPage = <App />
      //   tabPage = <MultiPlayer />;
    }

    if (this.state.tabValue === 2) {
      tabPage = <Search />;
    }

    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">
          <img 
            src="https://www.stickpng.com/assets/images/580b585b2edbce24c47b2acf.png" 
            weign="40"
            height="40"
            alt="baseball img"
          />
            Baseball Trivia
          </NavbarBrand>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="#" onClick={() => this.setTabValue(0)}>Single Player</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" onClick={() => this.setTabValue(1)}>Multi Player</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" onClick={() => this.setTabValue(2)}>Search</NavLink>
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
