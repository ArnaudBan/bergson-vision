import React, { Component, PureComponent } from 'react'
import Slider from 'react-slick'


/**
 * Un album correspond a un dossier dans Dropbox
 */
class Album extends PureComponent{

    constructor(props) {
        super(props)

        this.slideChange = this.slideChange.bind( this )
    }

    slideChange( oldIndex, newIndex ){
        if( newIndex === 0 ){
            // Il est temps de changer de slider
            this.props.nextSlider()
        }
    }

    render(){
        const { name, images } = this.props.album


        const sliderSettings = {
            autoplay: true,
            dots: true,
            beforeChange: this.slideChange,
            pauseOnHover: false,
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

            fetch( '/api/albums/')
            .then(function(response) {
                return response.json()
            })
            .then(function(response) {

                const foldersList = response

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