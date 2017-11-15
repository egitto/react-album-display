import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
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
        this.props.children
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
      <Border style={{height:300,width:300}}>
          <p style={{color:"white",background:"rgba(50,50,50,0.5)"}}>
            {data.title}
            <br/><br/>{data.artist} - {data.year}
            <br/>Tracks: {data.trackCount}
            </p>
        <img src={data.coverArt} className="coverArt" />        
      </Border>
    )
  }
}

class Artist extends Component {
  constructor(props) {
    super(props)
    this.state = {albums:[], status:"Getting albums"}
    send_post("https://itunes.apple.com/lookup?id="+this.props.artistId+"&entity=album")
      .then(results => JSON.parse(results).results.slice(1))
      .then(albums => this.setState({albums: albums}))
      .then(this.setState({status: ""}))
      .catch(x => this.setState({status:""+x}))
  }
  render() {
    console.log("rendering",this.props.artistName)
    return (
      <div>
        <header className="App-header">
          <h1 className="title">{this.props.artistName}</h1>
          <p className="contents">{this.props.contents}</p>
          <p key="status">{this.state.status}</p>
        </header>
        <div className="albumHolder">
        { 
          this.state.albums.map(album => {
            return albumConstructor(album)
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
