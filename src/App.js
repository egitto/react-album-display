import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import axios from 'axios'
// var Promise = require('bluebird') // I only need this for Promise.map and Promise.all
var request = require('request')

const divStyle = {
  WebkitTransition: 'all',
  msTransition: 'all' 
}

function send_post(url, value) {
  return new Promise((resolve, reject) => {
    request.post(url, value, (err, response, body) => {
        err && reject(err, response)
        body && resolve(body)
    })
  })
}

class Border extends Component {
  render() {
    return (
      <div className="Border">
        {this.props.children}
      </div>
    )
  }
}

function albumConstructor(album){
  return (
    <Album 
      key={album.collectionId} 
      coverArt={album.artworkUrl100} 
      title={album.collectionName} 
      year={album.releaseDate.slice(0,4)}
      artist={album.artistName} 
      trackCount={album.trackCount}/>
  )
}

class Album extends Component {
  render() {
    var data = this.props
    console.log("rendering",data.title)
    return (
      <Border>
          <p className="UpperLabel">
            {data.title}<br/>
            <br/>
            {data.artist} - {data.year}<br/>
            Tracks: {data.trackCount}
          </p>
        <img src={data.coverArt} className="CoverArt" />        
      </Border>
    )
  }
}

class Artist extends Component {
  constructor(props) {
    super(props)
    this.state = {albums:[], status:"getting albums",permitSingles:false,permitCollaboration:false}
  }
  componentDidMount(){
    // console.log("https://itunes.apple.com/lookup?id="+this.props.artistId+"&entity=album")
    axios.get("https://itunes.apple.com/lookup?id="+this.props.artistId+"&entity=album")
      .then(results => {console.log(results.data); return results.data.results.slice(1)})
      .then(albums => this.setState({albums: albums}))
      .then(this.setState({status:"albums loaded"}))
      .catch(e => {this.setState({status:""+e}); console.log(e)})
  }
  render() {
    console.log("rendering",this.props.artistName)
    return (
      <div className="Artist">
        <header className="App-header">
          <h1 className="title">{this.props.artistName}</h1>
          <p className="contents">{this.props.contents}</p>
          <p key="status">Status: {this.state.status}</p>
          <div className="ToggleButtons">
            <p onClick={x => this.setState({permitSingles:!this.state.permitSingles})}>Toggle Singles</p>
            <p onClick={x => this.setState({permitCollaboration:!this.state.permitCollaboration})}>Toggle Collaboration</p>
          </div>
        </header>
        <div className="AlbumHolder">
        { 
          this.state.albums.map(album => {
            if ((this.state.permitSingles || album.trackCount > 1) &&
               (this.state.permitCollaboration || album.artistName === this.props.artistName))
              {return albumConstructor(album)}
          })
        }
        </div>
      </div>
   )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Artist artistId="20006408" artistName="Regina Spektor" contents="A list of albums released by Regina Spektor"/>
      </div>
    )
  }
}

export default App
