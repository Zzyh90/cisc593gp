import { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import './App.css';

const Home = (props)=>{
    const [appointmentList, setAppointmentList] = useState(undefined);
	const [theUser,settheUser] = useState(undefined);
	const [userName, setUserName] = useState(undefined);

    let appointments
    useEffect(()=>{
        async function getUser(){
            try{
                let userResult = await axios.get('/users')
            } catch(e){
                console.log(e)
            }
        }
        getUser()
    })


}
export default Home;