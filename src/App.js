import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
// var Promise = require('bluebird') // I only need this for Promise.map and Promise.all
var request = require('request')

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
    {this.props.children}
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
      <div>
        <p>{data.title} - {data.year}</p>
        <p>Tracks: {data.trackCount}</p>
        <img src={data.coverArt} className="coverArt" />
      </div>
    )
  }
}

class Artist extends Component {
  constructor(props) {
    super(props)
    this.state = {albums:[]}
    send_post("https://itunes.apple.com/lookup?id="+this.props.artistId+"&entity=album")
      .then(results => JSON.parse(results).results.slice(1))
      .then(albums => this.setState({albums: albums}))
      .catch(console.log)
  }
  render() {
    console.log("rendering",this.props.artistName)
    return (
      <div>
      <header className="App-header">
        <img src={logo} className="App-logo"/>
        <h1 className="title">{this.props.artistName}</h1>
        <p className="contents">{this.props.contents}</p>
        {
          [0].map(x => {
            return (this.state.albums.length === 0)?(<p>Getting albums...</p>):(<p/>)
          })
        }
      </header>
        { 
          this.state.albums.map(album => {
            return albumConstructor(album)
          })
        }
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
