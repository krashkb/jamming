import React from 'react';
import './SearchBar.css';
class SearchBar extends React.Component { 
    constructor(props) {
        
    super(props);
    this.state = { term: this.getSessionTerm() };
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    }
    getSessionTerm(){
      let sTerm = sessionStorage.getItem("com.jammming.searchTerm")
      return sTerm === null ? '': sTerm;
    }
    setSessionTerm(value){
      sessionStorage.setItem("com.jammming.searchTerm", value);
    }
    search(event) {
        this.props.onSearch(this.state.term)
        this.setSessionTerm(this.state.term)
        event.preventDefault();
        
    }
    handleTermChange(event) {
        
        this.setState({term: event.target.value })
    }
     onKeyPress(event) {
    if (event.key === "Enter") {
      this.props.onSearch(this.state.term);
      this.setSessionTerm(this.state.term)
    }
  }
  
    render() {
        return (
        <div className="SearchBar" >
            <input placeholder="Enter A Song, Album, or Artist" onChange = {this.handleTermChange}
    onKeyPress={this.onKeyPress} value={this.state.term}/>
            <a type="button" onClick={this.search}>SEARCH</a>
        </div>
        );
    }
}
export default SearchBar;
