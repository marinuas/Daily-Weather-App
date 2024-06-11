class WeatherController < ApplicationController
    def index
      city = params[:location]
      start_date = params[:start_date]
      end_date = params[:end_date]
  
      Rails.logger.info("Fetching weather data for #{city} from #{start_date} to #{end_date}")
  
      begin
        weather_data = DailyWeather.where(location: city, date: start_date..end_date)
  
        if weather_data.empty?
          weather_data = WeatherService.get_weather(city, start_date, end_date)
        else
          weather_data = {
            daily: {
              time: weather_data.map { |w| w.date.to_s },
              temperature_2m_max: weather_data.map { |w| w.temperature_max },
              temperature_2m_min: weather_data.map { |w| w.temperature_min },
              sunrise: weather_data.map { |w| w.sunrise.to_s },
              sunset: weather_data.map { |w| w.sunset.to_s }
            }
          }
        end
  
        render json: weather_data
      rescue => e
        Rails.logger.error("Error in WeatherController: #{e.message}")
        render json: { error: e.message }, status: :unprocessable_entity
      end
    end
  end
  