import { useState, useEffect } from "react";
import { Divider, Grid, Stack, Select, InputLabel, MenuItem, FormControl  ,useMediaQuery, useTheme} from "@mui/material";
import Prayer from "./Prayer";
import axios from 'axios';
import moment from "moment";
import "moment/dist/locale/ar-dz";

moment.locale("ar")
export default function MainContent() { 
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

	/////////states/////////
    const [timings, setTimings] = useState({
        Fajr: "04:20",
        Dhuhr: "11:50",
        Asr: "15:18",
        Sunset: "18:03",
        Isha: "19:33",
    });
	/////////////////
    const [selectedCity, setSelectedCity] = useState({
        displayName: "اسوان",
        apiName: "Aswan",
    });
	//////////////////
	const [today, setToday] = useState("")
	/////////////////
	const [remainingTime,setRemainingTime] = useState ("")
	////////////////
	const [nextPrayerIndex, setNextPrayerIndex] = useState(4)
	//////////////////////////
    const availableCities = [
        { displayName: "اسوان", apiName: "Aswan" },
        { displayName: "القاهره", apiName: "Cairo" },
        { displayName: "القبيوبيه", apiName: "Qalyubia" },
        { displayName: "اسيوط", apiName: "Asyut" },
        { displayName: "دمياط", apiName: "Damietta" },
        { displayName: "مطروح", apiName: "Matrouh" },
    ];
//////////////////////
    const getTimings = async () => {
        try {
            const response = await axios.get(
                `https://api.aladhan.com/v1/timingsByCity?country=EG&city=${selectedCity.apiName}`
            );
            setTimings(response.data.data.timings);
        } catch (error) {
            console.error("Error fetching prayer timings:", error);
        }
    };
////////////////////////
    useEffect(() => {
        getTimings();
    }, [selectedCity]);
////////////////////////
useEffect(() => {
	let interval = setInterval(()=>{
		setupCountdownTimer()
	},1000)

	const t = moment()
	setToday(t.format("MMM Do YYYY | h:mm"))

	return ()=>{
		clearInterval(interval)
	}
}, [timings]);
////////////////////////// 
const setupCountdownTimer =()=>{
	const momentNow = moment()
	let prayerIndex = 2

//////////////////

		if (
			momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
		) {
			prayerIndex = 1;
		} else if (
			momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
		) {
			prayerIndex = 2;
		} else if (
			momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
		) {
			prayerIndex = 3;
		} else if (
			momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
		) {
			prayerIndex = 4;
		} else {
			prayerIndex = 0;
		}
		setNextPrayerIndex(prayerIndex)
		const nextPrayerObject = prayersArray[prayerIndex]
		const nextPrayerTime = timings[nextPrayerObject.key]
		const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm")
		let remainingTime =
		moment(nextPrayerTime, "hh:mm").diff(momentNow)
		if(remainingTime < 0){
			const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow)
			const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
				moment("00:00:00", "hh:mm:ss")
			)
			const totalDifferance = midnightDiff + fajrToMidnightDiff
			remainingTime = totalDifferance
		}

		const durationRemainingTime = moment.duration(remainingTime)

		setRemainingTime(
			`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
		);
}

//////////////////
const prayersArray = [
	{ key: "Fajr", displayName: "الفجر" },
	{ key: "Dhuhr", displayName: "الظهر" },
	{ key: "Asr", displayName: "العصر" },
	{ key: "Sunset", displayName: "المغرب" },
	{ key: "Isha", displayName: "العشاء" },
]
///////////////////////
    const handleCityChange = (event) => {
        const cityObject = availableCities.find((city) => city.apiName === event.target.value);
        setSelectedCity(cityObject);
    };
///////////////////////
    return (
        <>
            {/* top row */}
            <Grid container ={isSmallScreen ? false : true}  justifyContent="center" alignContent={"center"} direction={isSmallScreen ? 'column' : 'row'} >
                <Grid xs={6}>
                    <div>
                        <h2>{today}</h2>
                        <h1>{selectedCity.displayName}</h1>
                    </div>
                </Grid>

                <Grid xs={6}>
                    <div>
                        <h2>متبقى حتى صلاه {prayersArray[nextPrayerIndex].displayName}</h2>
                        <h1>{remainingTime}</h1>
                    </div>
                </Grid>
            </Grid>
            {/* top row */}

            <Divider />
            {/* cards */}
            <Stack direction="row" justifyContent="space-around" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: '10px' }}>
                <Prayer
                    name="الفجر"
                    time={timings.Fajr}
                    image="https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2"
                />
                <Prayer
                    name="الظهر"
                    time={timings.Dhuhr}
                    image="https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921"
                />
                <Prayer
                    name="العصر"
                    time={timings.Asr}
                    image="https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf"
                />
                <Prayer
                    name="المغرب"
                    time={timings.Sunset}
                    image="https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5"
                />
                <Prayer
                    name="العشاء"
                    time={timings.Isha}
                    image="https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d"
                />
            </Stack>
            {/* cards*/}

            {availableCities.length > 0 && (
                <Stack direction="row" justifyContent="center" style={{ marginTop: "30px" }}>
                    <FormControl sx={{ m: 1, minWidth: 140 }} size="small">
                        <InputLabel id="city-select-label">المدينه</InputLabel>
                        <Select
                            labelId="city-select-label"
                            id="city-select"
                            value={selectedCity.apiName}
                            label="المدينه"
                            onChange={handleCityChange}
                        >
                            {availableCities.map((city) => (
                                <MenuItem key={city.apiName} value={city.apiName}>
                                    {city.displayName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            )}
        </>
    );
}
