class GeocodingService
    include HTTParty
    base_uri 'https://api.opencagedata.com/geocode/v1/json'
  
    def self.get_coordinates(city)
      response = get('', query: { q: city, key: 'daa23921276a45d3a5959a8718a43d88' })
      if response.success?
        results = response['results']
        if results.any?
          coordinates = results.first['geometry']
          return coordinates['lat'], coordinates['lng']
        end
      end
      raise "City not found"
    end
  end
  