import React, { Component } from "react";
import axios from "axios";
import { Input, TextArea } from "../../components/Form";
import { Row, Container } from "../../components/Grid";
import "./NewActivity.css";
import Leaflet from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine";

class NewActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLocation: {
                lat: 34.0522,
                lon: -118.2437
            },
            actTitle: "",
            actDesc: "",
            durationMins: 0,
            durationSecs: 0,
            distance: 0,
            sportType: "",
            message: "",
            waypoints: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {

        //get user location
        const geoSuccess = (position) => {
            console.log(position);
            this.setState({
                userLocation: {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                }
            })
        };
        navigator.geolocation.getCurrentPosition(geoSuccess);

        //leaflet map render
        const map = Leaflet.map('map').setView([this.state.userLocation.lat, this.state.userLocation.lon], 13);

        //base map layer
        Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: ['a', 'b', 'c'],
            maxZoom: 17,
            minZoom: 9
        })
            .addTo(map);
        //bike lanes
        Leaflet.tileLayer('http://tiles.mapc.org/trailmap-onroad/{z}/{x}/{y}.png', {
            maxZoom: 17,
            minZoom: 9
        })
            .addTo(map);

        //init LRM
        const control = Leaflet.Routing.control({
            waypoints: [
                Leaflet.latLng(this.state.userLocation.lat, this.state.userLocation.lon),
                Leaflet.latLng(34.0407, -118.2468)
            ],
            routeWhileDragging: true
            }).addTo(map);
        
        function createButton(label, container) {
            var btn = Leaflet.DomUtil.create('button', '', container);
            btn.setAttribute('type', 'button');
            btn.innerHTML = label;
            return btn;
        }
        //routing endpoint buttons
        map.on('click', function (e) {
            var container = Leaflet.DomUtil.create('div'),
                startBtn = createButton('Start from this location', container),
                destBtn = createButton('Go to this location', container);
                
            Leaflet.DomEvent.on(startBtn, 'click', function () {
                control.spliceWaypoints(0, 1, e.latlng);
                map.closePopup();
            });

            Leaflet.DomEvent.on(destBtn, 'click', function () {
                control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
                map.closePopup();
            });

            Leaflet.popup()
                .setContent(container)
                .setLatLng(e.latlng)
                .openOn(map);
        });
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            waypoints: () => Leaflet.Routing.control.getWaypoints()
            })
        const history = this.props.history
        console.log('new activity handleSubmit, username: ');
        console.log(this.props.username);
        //request to server to add new activity
        axios.post('/api/activities', {
            userId: this.props.username,
            actTitle: this.state.actTitle,
            actDesc: this.state.actDesc,
            actDate: this.state.actDate,
            durationMins: this.state.durationMins,
            durationSecs: this.state.durationSecs,
            distance: this.state.distance,
            sportType: this.state.sportType,
            waypoints: this.state.waypoints
        })
            .then(res => {
                console.log(res)
                if (!res.data.errmsg) { //redirect to activity detail page
                    console.log('activity create successful')
                    history.push("/api/activities/" + res.data._id);
                }
            }).catch(error => {
                console.log('activity creation error: ')
                console.log(error)
                this.setState({ message: "Something went wrong...oops! Please try again later." })
            })
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <div className="col-xs-12 col-md-6 mx-auto" id="map"></div>
                    <div className="col-xs-12 col-md-6 mx-auto">
                        <form>
                        <p className="newActP">Activity title: </p>
                        <Input value={this.state.actTitle}
                        onChange={this.handleInputChange}
                        name="actTitle"
                        placeholder="Name your activity"/>
                        <p className="newActP">Activity description: </p>
                        <TextArea value={this.state.actDesc}
                        onChange={this.handleInputChange}
                        name="actDesc"
                        placeholder="Describe this activity (how did it go? how were you feeling?)"/>
                        <p className="newActP">Date: </p>
                        <Input type="date" value={this.state.actDate}
                        onChange={this.handleInputChange}
                        name="date"/>
                        <p className="newActP">Duration: </p>
                        <Input value={this.state.durationMins}
                        onChange={this.handleInputChange}
                        name="durationMins" size="2"/> Minutes 
                        <Input value={this.state.durationSecs}
                        onChange={this.handleInputChange}
                        name="durationSecs" size="2"/> Seconds
                        <p className="newActP">Distance (in miles): </p>
                        <Input value={this.state.distance}
                        onChange={this.handleInputChange}
                        name="distance"
                        type="number" size="6" />
                        <p className="newActP">Type of activity: </p>
                        <select name="sportType" onChange={this.handleInputChange}>
                            <option value="">--Please choose an option--</option>
                            <option value="hiking">Hiking</option>
                            <option value="running">Running</option>
                            <option value="cycling">Cycling</option>
                            <option value="swimming">Swimming</option>
                            <option value="rowing">Rowing</option>
                        </select>
                        <div className="submitBtn">
                            <button className="btn btnSub1" font-color="white" onClick={this.handleSubmit} type="submit">Create Activity</button>
                        </div>
                        </form>

                    </div>
                </Row>
            </Container>
        )
    }
}

export default NewActivity;