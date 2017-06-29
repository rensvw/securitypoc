container :
	cp ../../telegram/telegram-service.js .
	cp ../../telegram/telegram.js .	
	sudo docker build -t telegram .
	sudo docker images | grep telegram

run-single :
	sudo docker service create --replicas 1 --network securitypoc  --name telegram -e HOST=@eth0 -e BASES=base0:39000,base1:39001 telegram

rm-single :
	sudo docker service rm telegram

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean