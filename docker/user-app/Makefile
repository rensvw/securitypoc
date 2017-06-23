container :
	cp ../../user/user-app/user-app-service-redis.js .
	cp ../../user/user-app/user-app.js .	
	
	sudo docker build -t user-app .
	sudo docker images | grep user-app

run-single :
	sudo docker service create --replicas 1 --network securitypoc  --name user-app -e HOST=@eth0 -e BASES=base0:39000,base1:39001 user-app

rm-single :
	sudo docker service rm user-app

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean