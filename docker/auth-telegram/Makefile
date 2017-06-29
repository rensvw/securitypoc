container :
	cp ../../auth/auth-telegram/auth-telegram.js .
	cp ../../auth/auth-telegram/auth-telegram-service.js .
	
	sudo docker build -t auth-telegram .
	sudo docker images | grep auth-telegram

run-single :
	sudo docker service create --replicas 1 --network securitypoc  --name auth-telegram -e HOST=@eth0 -e BASES=base0:39000,base1:39001 auth-telegram

rm-single :
	sudo docker service rm auth-telegram

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean