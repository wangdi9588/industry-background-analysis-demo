import axios from 'axios'
import img1 from '/static/images/weather/1.png'
import img2 from '/static/images/weather/2.png'
import img3 from '/static/images/weather/3.png'
import img4 from '/static/images/weather/4.png'
import img5 from '/static/images/weather/5.png'
import img6 from '/static/images/weather/6.png'

export function useWeatherHook() {
  const temperature = ref('20')
  const weatherImg = ref(null) as any

  function weatherInfo() {
    axios.get('https://restapi.amap.com/v3/weather/weatherInfo?key=68bb2642051bc24c307a9dcdf608e1e8&city=510800').then((response) => {
      const data = response.data.lives[0]
      temperature.value = data.temperature
      if (data.weather.indexOf('小雨') > -1) {
        weatherImg.value = img2
      } else if (data.weather.indexOf('雨') > -1) {
        weatherImg.value = img1
      } else if (data.weather.indexOf('雪') > -1) {
        weatherImg.value = img3
      } else if (data.weather.indexOf('阴') > -1) {
        weatherImg.value = img4
      } else if (data.weather.indexOf('晴') > -1) {
        weatherImg.value = img5
      } else if (data.weather.indexOf('多云') > -1) {
        weatherImg.value = img6
      }
    })
  }

  onMounted(() => {
    weatherInfo()
  })

  return {
    temperature,
    weatherImg
  }
}
