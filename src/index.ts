// TODO Change color to C6E2FF
//const API_KEY: any = "ed3ed362e70a96cf667a6c73c5a8f737";

import { API_KEY } from "./api";
import { Chart } from 'chart.js'

const cityInput = <HTMLInputElement>document.getElementById("city-input");
const searchButton: HTMLElement | null = document.getElementById("search-button");

const weatherIcon: HTMLElement | null = document.getElementById("weatherImg");

const cityDisplay: HTMLElement | null = document.getElementById("city");
const weatherTypeDisplay: HTMLElement | null = document.getElementById("weatherType");
const feelsLikeDisplay: HTMLElement | null = document.getElementById("feelsLike");
const temperatureDisplay: HTMLElement | null = document.getElementById("temperature");

const humidityDisplay: HTMLElement | null = document.getElementById("humidity");
const windSpeedDisplay: HTMLElement | null = document.getElementById("windspeed");
const dateDisplay: HTMLElement | null = document.getElementById("date");

const chartContainer = document.querySelectorAll("#chart");
const tabs = document.querySelectorAll(".tab");

const temperatureData: any = [];
const chartLabels: any = [];
const labels: any = [];

function addListeners() {
    searchButton?.addEventListener("click", () => {
        const city = cityInput.value;
        getWeatherData(city);
    });

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            tabs.forEach((tab) => {
                tab.classList.remove("active");
            });
            tab.classList.add("active");
            updateChart(index);
        });
    });
}

async function fetchData(city: any) {
    const [currentWeatherResponse, forecastResponse] = await Promise.all([
        fetch(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        ),
        fetch(
            `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        ),
    ]);

    const currentWeatherData = await currentWeatherResponse.json();
    const forecastData = await forecastResponse.json();

    return [currentWeatherData, forecastResponse];
}

function drawChart() {
    const chart = new Chart(chartContainer, {
        type: "line",
        data: {
            labels: chartLabels[0], 
            datasets: [
                {
                    label: "Temperature",
                    data: temperatureData[0],
                    backgroundColor: "rgba(183, 216, 248, 1)",
                    borderColor: "rgba(24, 90, 157, 1)",
                    borderWidth: 1,
                    pointRadius: 5,
                    pointHoverRadius: 10,
                    fill: true
                }
            ]
        }
    })
}

function updateText() {
    cityDisplay?.textContent
    //TODO Add logic
}

function updateChart(index: any) {}

async function getWeatherData(city: any) {
    const [currentWeatherData, forecastData] = await fetchData(city);

    forecastData.list.forEach((item:any, i:any) => {
        let date = new Date(item.dt * 1000);
        let dateString = date.toLocaleDateString();
        if (i === 0 || dateString !== new Date(forecastData.list[i - 1].dt * 1000).toLocaleDateString()) {
            temperatureData.push([item.main.temp]);
            labels.push(date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            }));
            chartLabels.push(date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }))
        }
        else {
            temperatureData[temperatureData.length - 1].push(item.main.temp);
            chartLabels[chartLabels.length - 1].push(date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
        }
    });

    updateText(city, currentWeatherData);
    drawChart();

    tabs[0].classList.add('active')
    tabs.forEach((tab, index) => {
        tab.textContent = labels[index];
    })
}

addListeners();
