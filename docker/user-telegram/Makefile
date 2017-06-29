container :
	cp ../../user/user-telegram/user-telegram-service.js .
	cp ../../user/user-telegram/user-telegram.js .	
	
	sudo docker build -t user-telegram .
	sudo docker images | grep user-telegram

run-single :
	sudo docker service create --replicas 1 --network securitypoc  --name user-telegram -e HOST=@eth0 -e BASES=base0:39000,base1:39001 user-telegram

rm-single :
	sudo docker service rm user-telegram

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean