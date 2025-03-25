module Webhookable
  extend ActiveSupport::Concern

  def set_header
    response.headers["Content-Type"] = "text/xml"
  end

  def render_twiml(response)
    render text: response
  end

  def twiml_response(message)
    twiml = Twilio::TwiML::MessagingResponse.new do |r|
      r.message body: message
    end

    twiml.to_s
  end

  def support_twiml_response(message)
    twiml = Twilio::TwiML::MessagingResponse.new do |r|
      r.message body: message
    end

    twiml.to_s
  end
end