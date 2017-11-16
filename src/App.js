import React, { Component } from 'react'
import './App.css'
import axios from 'axios'

class Border extends Component {
  render() {
    return (
      <div className="Border">
        {this.props.children}
      </div>
    )
  }
}

function enlargeArtworkUrl(url,size){
  return url.replace(/\/100x100/,"/"+size+"x"+size)
}

function albumConstructor(album){
  return (
    <a>
      <Album 
        key={album.collectionId} 
        coverArt={enlargeArtworkUrl(album.artworkUrl100,350)} 
        title={album.collectionName} 
        year={album.releaseDate.slice(0,4)}
        artist={album.artistName} 
        trackCount={album.trackCount}
        collectionPrice={album.collectionPrice}
        collectionViewUrl={album.collectionViewUrl}
        albumId={album.collectionId}/>
    </a>
  )
}

class Album extends Component {
  constructor(props) {
    super(props)
    this.state = {tracks:[],status:"loading tracks"}
    axios.get("https://itunes.apple.com/lookup?collectionId="+this.props.albumId+"")
      .then(results => {console.log(results); return results.data.results.slice(1)})
      .then(albums => this.setState({tracks: albums}))
      .then(this.setState({status:"tracks loaded"}))
      .catch(e => {this.setState({status:""+e}); console.log(e)})
  }
  render() {
    var data = this.props
    console.log("rendering",data.title)
    return (
      <Border>
        <a className="AlbumLabel">
          <p className="AlbumTitle">{data.title}<br/>
          <a href={data.collectionViewUrl}>${data.collectionPrice}</a></p>
          <p className="AlbumArtist">Tracks: {data.trackCount}<br/>{data.year} - {data.artist}</p>
        </a>
        <img src={data.coverArt} className="CoverArt" alt={"Cover of "+data.title} />    
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
          <h1 className="App-title">{this.props.artistName}</h1>
          <p className="contents">{this.props.contents}</p>
          <p key="status">Status: {this.state.status}</p>
          <div className="ButtonHolder">
            <button type="button" 
              onClick={x => this.setState({permitSingles:!this.state.permitSingles})}
              >Toggle Singles</button>
            <button type="button" 
              onClick={x => this.setState({permitCollaboration:!this.state.permitCollaboration})}
              >Toggle Collaboration</button>
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
        {//<Artist artistId="20006408" artistName="Regina Spektor" contents="A list of albums released by Regina Spektor"/>
      }
        <Artist artistId="551695" artistName="David Bowie" contents="A list of albums released by David Bowie"/> 
      </div>
    )
  }
}

export default App
