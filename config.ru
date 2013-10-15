use Rack::Static, 
  :urls => [ "" ],
  :index => 'index.html'

run lambda { |env| [ 200, { "Content-Type" => "text/html" } ] }
