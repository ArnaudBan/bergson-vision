import React, { Component, PureComponent } from 'react'
import Slider from 'react-slick'



/**
 * Ce composent gére la liste de tous les albums
 */
class Event extends PureComponent{

    render(){

        const { event } = this.props

        const eventDate = new Date( event.meta.goliath_event_start_date )
        const dateOptions = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
        return(
            <article className="event">
                <p className="event-date">{eventDate.toLocaleDateString( 'fr-FR', dateOptions)}</p>
                <h2 className="event-title" dangerouslySetInnerHTML={{__html: event.title.rendered}} />
                <div dangerouslySetInnerHTML={{__html: event.content.rendered}} />
            </article>
        )
    }
}


class Events extends Component {

    constructor(props) {
        super(props)

        this.state = {
            events: [],
        }
    }

    componentDidMount(){

        const component = this

        let events = localStorage.getItem( 'events' )

        if( ! events ){

            fetch( process.env.REACT_APP_SITE_API + '/wp/v2/event')
                .then(function(response) {
                    return response.json()
                })
                .then( function( json ){
                    component.setState({
                        events: json
                    })
                    localStorage.setItem( 'events', JSON.stringify( json ) )
                } )
        } else {
            component.setState({
                events: JSON.parse( events )
            })
        }
    }


    render(){

        const { events } = this.state

        const sliderSettings = {
            autoplay: true,
            dots: true,
            //beforeChange: this.slideChange,
        }

        return (
            <div className="album">
                { events.length > 0 ?
                    <Slider {...sliderSettings}>
                        { events.map( function( event ){
                            return <Event key={event.id} event={event}/>
                        } ) }
                    </Slider>
                    :
                    <p>Loading...</p>
                }
            </div>
        );
    }
}

export default Events;