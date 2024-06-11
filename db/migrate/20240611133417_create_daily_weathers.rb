class CreateDailyWeathers < ActiveRecord::Migration[7.2]
  def change
    create_table :daily_weathers do |t|
      t.string :location
      t.date :date
      t.float :temperature_max
      t.float :temperature_min
      t.datetime :sunrise
      t.datetime :sunset

      t.timestamps
    end
  end
end
