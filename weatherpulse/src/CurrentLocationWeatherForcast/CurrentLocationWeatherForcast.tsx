import React, {useState, useEffect} from "react";
import Styles  from "./CurrentLocationWeatherForcast.module.scss";

function CurrentLocationWeatherForcast(){
    interface HoursObject {
        time: String,
        temp_c: Number,
        temp_f: Number,
    }
    let [nextHours, setNextHours] = useState<any[]>([])

    
    useEffect(()=>{
        let cachedWeatherForcast = localStorage.getItem("cachedWeatherForcastData");
        const options = { 
            method: "GET", 
            headers: { accept: "application/json" },
            mode: 'no-cors' as RequestMode // Correct type assignment
          };

        if(cachedWeatherForcast){
            let cachedWeatherForcastData = JSON.parse(cachedWeatherForcast)
            console.log("Weather cached: ",cachedWeatherForcastData)
            let updatedHours: HoursObject[] = [];
            for(let i=0;i<cachedWeatherForcastData.forecast.forecastday[0].hour.length;i++){
                let hour = cachedWeatherForcastData.forecast.forecastday[0].hour[i]
                let hourSplit = hour.time.split(" ")
                if(parseInt(hourSplit[1].replace(":", "")) >= 1200){
                    hourSplit[1] = hourSplit[1].concat(" pm")
                }else{
                    hourSplit[1] = hourSplit[1].concat(" am")
                }
                let hoursObject: HoursObject = {
                    time: hourSplit[1],
                    temp_c: hour.temp_c,
                    temp_f: hour.temp_f
                }
                updatedHours.push(hoursObject);
                }
                setNextHours(updatedHours);
                console.log("nextHours: ",nextHours)

        }else{
            console.log("Weather not cached")
            fetch("https://api.weatherapi.com/v1/forecast.json?key=2332dfb52a52492ab80143318240709&q=Isle%20of%20Man", options)
            .then((response) => response.json())
            .then((response)=>{
                localStorage.setItem("cachedWeatherForcastData", JSON.stringify(response));
            })
            }
    },[])

    return(
        <div className={Styles.hourDiv}>
            <h2>Hourly temperature</h2>
            <ul>
                {nextHours.map((hour,index)=>(
                    <li key={index}>
                        <div>
                        <p>{hour.time}</p>
                        </div>
                        <div className={Styles.tempDiv}>
                            <span>C {hour.temp_c}{" "}</span>
                            <span>F {hour.temp_f}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CurrentLocationWeatherForcast