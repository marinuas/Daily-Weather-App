class WeatherService
    include HTTParty
    base_uri 'https://api.open-meteo.com/v1/forecast'
  
    def self.get_weather(city, start_date, end_date)
      begin
        latitude, longitude = GeocodingService.get_coordinates(city)
        Rails.logger.info("Coordinates for #{city}: #{latitude}, #{longitude}")
  
        response = get('', query: {
          latitude: latitude,
          longitude: longitude,
          daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset',
          time: 'auto',
          start_date: start_date,
          end_date: end_date
        })
  
        Rails.logger.info("Weather API response: #{response.body}")
  
        if response.success?
          weather_data = response.parsed_response
          weather_data['daily']['time'].each_with_index do |time, index|
            date = Date.parse(time)
            temperature_max = weather_data['daily']['temperature_2m_max'][index]
            temperature_min = weather_data['daily']['temperature_2m_min'][index]
            sunrise = DateTime.parse(weather_data['daily']['sunrise'][index])
            sunset = DateTime.parse(weather_data['daily']['sunset'][index])
  
            DailyWeather.create!(
              location: city,
              date: date,
              temperature_max: temperature_max,
              temperature_min: temperature_min,
              sunrise: sunrise,
              sunset: sunset
            )
          end
          return weather_data
        else
          raise "Failed to fetch weather data: #{response.message}"
        end
      rescue => e
        Rails.logger.error("Error fetching weather data: #{e.message}")
        raise e
      end
    end
  end
  