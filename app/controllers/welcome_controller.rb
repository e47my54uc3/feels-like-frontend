get '/' do
  erb :index
end

get '/things' do
  if request.xhr?
    resp = Unirest.get "https://api.forecast.io/forecast/81c88efeafdeb098caa777f0281510a8/37.8267,-122.423"
    resp.body.to_json
  else
    status 404
  end
end
