#!/usr/bin/env ruby

begin
  puts 'killing old nginx'
  system("kill #{File.read('logs/nginx/nginx.pid').strip}")
  sleep 1
rescue
end

current_dir = `pwd`.strip


s = <<EOF

# user       www www;  ## Default: nobody
worker_processes  5;  ## Default: 1
error_log  #{current_dir}/logs/nginx/error.log;
pid        #{current_dir}/logs/nginx/nginx.pid;
worker_rlimit_nofile 8192;
 
events {
  worker_connections  4096;  ## Default: 1024
}
 
http {
  index    index.html;

types {
  text/html                             html htm shtml;
  text/css                              css;
  text/xml                              xml rss;
  image/gif                             gif;
  image/jpeg                            jpeg jpg;
  application/x-javascript              js;
  text/plain                            txt;
  text/x-component                      htc;
  text/mathml                           mml;
  image/png                             png;
  image/x-icon                          ico;
  image/x-jng                           jng;
  image/vnd.wap.wbmp                    wbmp;
  application/java-archive              jar war ear;
  application/mac-binhex40              hqx;
  application/pdf                       pdf;
  application/x-cocoa                   cco;
  application/x-java-archive-diff       jardiff;
  application/x-java-jnlp-file          jnlp;
  application/x-makeself                run;
  application/x-perl                    pl pm;
  application/x-pilot                   prc pdb;
  application/x-rar-compressed          rar;
  application/x-redhat-package-manager  rpm;
  application/x-sea                     sea;
  application/x-shockwave-flash         swf;
  application/x-stuffit                 sit;
  application/x-tcl                     tcl tk;
  application/x-x509-ca-cert            der pem crt;
  application/x-xpinstall               xpi;
  application/zip                       zip;
  application/octet-stream              deb;
  application/octet-stream              bin exe dll;
  application/octet-stream              dmg;
  application/octet-stream              eot;
  application/octet-stream              iso img;
  application/octet-stream              msi msp msm;
  audio/mpeg                            mp3;
  audio/x-realaudio                     ra;
  video/mpeg                            mpeg mpg;
  video/quicktime                       mov;
  video/x-flv                           flv;
  video/x-msvideo                       avi;
  video/x-ms-wmv                        wmv;
  video/x-ms-asf                        asx asf;
  video/x-mng                           mng;
}

proxy_redirect          off;
proxy_set_header        Host            $host;
proxy_set_header        X-Real-IP       $remote_addr;
proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
client_max_body_size    10m;
client_body_buffer_size 128k;
proxy_connect_timeout   90;
proxy_send_timeout      90;
proxy_read_timeout      90;
proxy_buffers           32 4k;

 default_type application/octet-stream;
  log_format   main '$remote_addr - $remote_user [$time_local]  $status '
    '"$request" $body_bytes_sent "$http_referer" '
    '"$http_user_agent" "$http_x_forwarded_for"';
  access_log   #{current_dir}/logs/nginx/access.log  main;
  sendfile     on;
  tcp_nopush   on;
  server_names_hash_bucket_size 128; # this seems to be required for some vhosts
 
  
  upstream nodebackend {
    server 127.0.0.1:8081;
  }
  
  
  server {
    listen        8080;
    # server_name   www.mysite.com mysite.com;
    access_log     #{current_dir}/logs/nginx/nginx_www.access.log;
    error_log     #{current_dir}/logs/nginx/nginx_www.error.log;
    
    
    location /node {
      proxy_pass http://nodebackend;
    }
    
    location / {
      gzip_static on;
      gzip_vary   on;
      autoindex on;
      root  #{current_dir}/app;
    }
    
  }

}
EOF

File.open('config/nginx.conf', 'w') { |f| f.write(s) }

puts 'starting new nginx'
system("nginx -c #{current_dir}/config/nginx.conf -p #{current_dir}/")
