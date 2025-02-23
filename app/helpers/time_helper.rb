module TimeHelper
  def time_normalized(date_entry: date)
    if date_entry.present?
      time_normalized = time.strftime("%A, %B #{date_entry.to_time.day.ordinalize}")
    else
      time_normalized = time.strftime("%A, %B #{time.day.ordinalize}")
    end
  end

  def time_in_summary
    t = 2.days.from_now.in_time_zone('Pacific Time (US & Canada)')
    t.strftime("%a, %b #{t.day.ordinalize}")
  end

  def time
    time = Time.new
  end
end
