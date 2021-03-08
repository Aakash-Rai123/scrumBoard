import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      age: '',
      team:'',
      users: []
    }
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    axios.get('http://localhost:3001/users').then(res => this.setState({users: res.data}));
  }

  handleChange = (name) => event => {
    this.setState({ [name]: event.target.value });
  }
  
  handleRemove = (id) => {
    axios.delete(`http://localhost:3001/users/${id}`).then(() => this.getUsers());
  }

  handleSubmit = () => {
    axios.post('http://localhost:3001/users', {name: this.state.name, age: this.state.age, team: this.state.team})
      .then(this.setState({name: '', age: '', team:''}))
      .then(() => this.getUsers());
  }

  handleEdit = (value) => {
    axios.put(`http://localhost:3001/users/${value.id}`, {name: value.name, age: value.age, team: value.team})
      .then(() => this.getUsers())
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <div className="title">Add Story</div>
          <input placeholder="description" type="text" value={this.state.name} onChange={this.handleChange('name')}/>
          <input placeholder="points" type="text" value={this.state.age} onChange={this.handleChange('age')}/>
          <select placeholder="Team" value={this.state.team} onChange={this.handleChange('team')}>
            <option>Dev</option>
            <option>Test</option>
          </select>
          <div className="btn"  onClick={this.handleSubmit}>Add</div>
        </form>
        <div className="title">Scrum Board</div>
        <ul className="list">
          {this.state.users.length > 0 ? this.state.users.map((x, i) => 
            <User key={i} user={x} remove={() => this.handleRemove(x.id)} edit={this.handleEdit}/>
            // <li className="item" key={i}>
            //   <input value={x.name} disabled/>
            //   <input value={x.age} disabled/>
            //   <div className="btn-edit" onClick={this.handleEdit}>edit</div>
            //   <div className="btn-remove" onClick={() => this.handleRemove(x.id)}>remove</div>
            // </li>
          ) : <div></div>}          
        </ul>
          <div style={{width:'100%',display:'flex'}}>
          <div style={{width:'50%'}}><TestUser datatest={this.state.users}/></div>
          <div style={{width:'50%'}}><DevUser datatest={this.state.users}/></div>
          </div>
      </div>
    );
  }
}


class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      name: this.props.user.name,
      age: this.props.user.age,
      team: this.props.user.team,
      id: this.props.user.id
    }
  }

  handleEdit = () => {
    this.setState({
      disabled: false
    }) 
  }

  handleChange = (name) => event => {
    this.setState({ [name]: event.target.value });
  }

  handleSubmit = () => {
    this.setState({
      disabled: true
    }) 
    return {id: this.props.user.id, name: this.state.name, age: this.state.age, team: this.state.team};
  }

  render(){
    const {disabled, name, age, team} = this.state;
    console.log("team state",this.state.team,this.props.user);
    return (
      <li className="item">
        <input value={name} disabled={disabled}  onChange={this.handleChange('name')}/>
        <input value={age} disabled={disabled}  onChange={this.handleChange('age')}/>
        <select value={team} disabled={disabled} onChange={this.handleChange('team')}>
            <option>Dev</option>
            <option>Test</option>
          </select>
        {disabled ? 
          <div className="btn-edit" onClick={this.handleEdit}>Edit</div> 
          : <div className="btn-save" onClick={() => this.props.edit(this.handleSubmit())}>Save</div>}
        <div className="btn-remove" onClick={this.props.remove}>Delete</div>
      </li>
      
    )
  }
}

class TestUser extends Component{
  constructor(props){
    super(props);
  }
  render(){
   
    let dat = this.props.datatest.filter((val)=> val.team==='Test')
    console.log("test user",this.props.datatest,dat)
    return(
      <div>
        <div style={{marginBottom:'20px'}}><h3>Test Board</h3></div>
        {dat && dat.map((user)=>{
           return <li className="item">
             <label>Description: {user.name}</label><br/>
             <label>Points: {user.age}</label><br/>
             <label>Team: {user.team}</label><br/>
           </li>
        })}
      </div>
    )
  }
}

class DevUser extends Component{
  constructor(props){
    super(props);
  }
  render(){
   
    let dat = this.props.datatest.filter((val)=> val.team==='Dev')
    console.log("dev user",this.props.datatest,dat)
    return(
      <div>
        <div style={{marginBottom:'20px'}}><h3>Dev Board</h3></div>
        {dat && dat.map((user)=>{
           return <li className="item" style={{listStyle:'none'}}>
             <label>Description: {user.name}</label><br/>
             <label>Points: {user.age}</label><br/>
             <label>Team: {user.team}</label><br/>
           </li>
        })}
      </div>
    )
  }
}

export default App;
