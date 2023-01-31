import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import {Redirect} from 'react-router-dom';
import './App.css';

const Home = (props)=>{
    const [appointmentList, setAppointmentList] = useState(undefined);
	const [theUser,settheUser] = useState(undefined);
	const [userName, setUserName] = useState(undefined);

    let appointments
    userEffect(()=>{
        async function getUser(){
            try{
                let userResult = await axios.get('/users')
            } catch(e){
                console.log(e)
                return (
                    <Redirect to='/login'/>
                )
            }
        }
    })


}
export default Home;