import React, { Component } from 'react'
import { Dropbox } from 'dropbox'
import Slider from 'react-slick'


/**
 * Un album correspond a un dossier dans Dropbox
 */
class Album extends Component {

    constructor(props) {
        super(props)
        this.state = {
            images: []
        }

        this.slideChange = this.slideChange.bind( this )
        this.getImages = this.getImages.bind( this )
    }

    componentDidMount(){
        this.getImages()
    }
    componentDidUpdate( prevProps ){
       if( this.state.images.length > 0 && prevProps.album !== this.props.album ){
           this.setState(
               { images: [] },
               this.getImages()
           )
       }
    }
    getImages(){

        const component = this

        const dbx = new Dropbox({ accessToken: process.env.REACT_APP_DROPBOX_ACCESSTOKEN })

        dbx.filesListFolder({
            path: this.props.album.path_display,
        })
            .then(function(response) {

                const thumbnailBatchEntries = response.entries.filter( function ( file, index ) {
                    return file['.tag'] === 'file'

                }).map( function( image ){
                    return {
                        path: image.path_display,
                        size: { '.tag': 'w1024h768'}
                    }
                })

                dbx.filesGetThumbnailBatch({
                        entries: thumbnailBatchEntries
                    })
                    .then( function(response){

                        const images = response.entries.map( function( file ){
                                return {
                                    src: 'data:image/jpg;base64,' + file.thumbnail,
                                    alt: file.metadata.name,
                                    width: file.metadata.media_info.metadata.dimensions.width,
                                    height: file.metadata.media_info.metadata.dimensions.height
                                }
                            })

                        component.setState({
                            images: images
                        } )

                    })
                    .catch(function(error) {
                        console.error(error)
                    });
            })
            .catch(function(error) {
                console.error(error)
            });

    }

    slideChange( oldIndex, newIndex ){
        if( newIndex === 0 ){
            // Il est temps de changer de slider
            this.props.nextSlider()
        }
    }

    render(){
        const { name } = this.props.album
        const { images } = this.state


        const sliderSettings = {
            autoplay: true,
            dots: true,
            beforeChange: this.slideChange,
        }

        return(
             <div>
                 <h1>{name}</h1>
                 { images.length > 0 ?
                     <Slider {...sliderSettings}>
                         { images.map( function ( image, index) {
                             return (<img alt=''  {...image} key={index}/>)
                         }) }
                     </Slider> :
                     <p>Loading...</p>
                 }
             </div>
        )
    }
}


/**
 * Ce composent gére la liste de tous les albums
 */
class Albums extends Component {

    constructor(props) {
        super(props)

        this.state = {
            albums: [],
            albumToDisplay: 0
        }

        this.nextSlider = this.nextSlider.bind( this )
    }

    componentDidMount(){

        const component = this

        const albums = localStorage.getItem( 'albums' )

        if( ! albums ){

            const dbx = new Dropbox({ accessToken: process.env.REACT_APP_DROPBOX_ACCESSTOKEN })

            dbx.filesListFolder({
                path: ''
            })
            .then(function(response) {

                const foldersList = response.entries.filter( function ( file ) {
                    return file['.tag'] === 'folder'
                })

                localStorage.setItem( 'albums', JSON.stringify( foldersList ) )
                component.setState({
                    albums: foldersList,
                })
            })
            .catch(function(error) {
                console.error(error)
            });

        } else {

            component.setState({
                albums: JSON.parse( albums )
            })
        }
    }

    nextSlider(){
        const { albumToDisplay, albums } = this.state

        let nextAlbum = albumToDisplay + 1
        if( nextAlbum + 1 > albums.length ){
            nextAlbum = 0
        }

        this.setState({
            albumToDisplay: nextAlbum
        })
    }

    render() {

        const { albums, albumToDisplay } = this.state

        return (
            <div className="album">
                { albums.length > 0 ?
                    <Album album={albums[ albumToDisplay ] } nextSlider={ this.nextSlider }/> :
                    <p>Loading...</p>
                }
            </div>
        );
    }
}

export default Albums;