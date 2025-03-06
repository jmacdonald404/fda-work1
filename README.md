1. clone
2. bundle install
3. (create psql user if needed and) rake db:create db:migrate
4. create admin user
5. create some restaurants and dishes
6. (for DO dev): rails s --binding=0.0.0.0
7. (for local dev): ./bin/dev