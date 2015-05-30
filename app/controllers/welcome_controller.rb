get '/' do
  erb :index
end

get '/:c1/:c2' do
  if request.xhr?
    city1 = params[:c1]
    city2 = params[:c2]
    "Moving from #{city1} to #{city2}."
  else
    status 404
  end
end